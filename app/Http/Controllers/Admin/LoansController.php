<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Contributions;
use App\Models\FinancialAccount;
use App\Models\LoanTracker;
use App\Models\ContributionTypes;
use App\Models\LoanAmortization;
use App\Models\LoanInstallment;
use App\Models\DueDates;
use Carbon\Carbon;
use Session;
use App\Traits\HasDateHelpers;
use App\Traits\HasFinancialAccountHelpers;
use App\Services\InterestComputationService;

class LoansController extends Controller
{
    protected $aes;

    use HasDateHelpers;
    use HasFinancialAccountHelpers;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $search = session('search');

        $borrowers = LoanAmortization::with('user')
            ->when(filled($search), function ($query) use ($search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy('paymentStatus', 'desc')
            ->orderBy('dateApplied', 'desc')
            ->paginate(30)->through(function ($borrower) {
                $borrower->encrypted_id = $this->aes->encrypt($borrower->id);
                return $borrower;
        });

        return Inertia::render('admin/loans/loans', [
            'borrowers' => $borrowers,
            'search' => $search,
        ]);
    }

    public function viewEmployeeLoan(Request $request, InterestComputationService $interestComputationService)
    {
        $loanAmortizationId = $this->aes->decrypt($request->encrypted_id);

        $borrower = LoanAmortization::with([
            'user',
            'duedates.loaninstallment'
        ])->findOrFail($loanAmortizationId);

        $borrower->duedates = $borrower->duedates->map(function ($duedate) {
            $duedate->encrypted_id = $this->aes->encrypt($duedate->id);
            return $duedate;
        });

        $months = DueDates::with('loaninstallment')->where('loan_amortization_id', $loanAmortizationId)
        ->orderBy('date', 'asc')
        ->get();

        $today = $this->todayDate();

        $interestComputationService->InterestComputation($borrower, $months, $today, $loanAmortizationId);

        return Inertia::render('admin/loans/view-employee-loan', [
            'encrypted_id' => $request->encrypted_id,
            'borrower' => $borrower,
            'today' => $today
        ]);
    }

    public function loanTracker()
    {
        $officers = User::where('specialAccount', '!=', 'No')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($officer) {
                $officer->encrypted_id = $this->aes->encrypt($officer->id);
                return $officer;
            });

        $trackers = LoanTracker::with('user')
        ->orderBy('tracker')
        ->get()
        ->map(function ($tracker) {
            if ($tracker->user) {
                $tracker->user->encrypted_id = $this->aes->encrypt($tracker->user->id);
            }
            return $tracker;
        });

        return Inertia::render('admin/loans/loan-tracker', [
            'officers' => $officers,
            'trackers' => $trackers,
        ]);
    }

    public function storeOrUpdate(Request $request)
    {
            DB::transaction(function () use ($request) {
            $existingTrackers = LoanTracker::all()->keyBy('users_id');

            $submittedUserIds = collect($request->trackers)
                ->map(fn($tracker) => $this->aes->decrypt($tracker['officer']))
                ->toArray();

            $existingTrackers->whereNotIn('users_id', $submittedUserIds)->each(function($tracker) {
                $tracker->delete();
            });

            foreach ($request->trackers as $index => $trackerData) {
                $userId = $this->aes->decrypt($trackerData['officer']);
                $description = $trackerData['description'] ?? null;

                LoanTracker::updateOrCreate(
                    ['users_id' => $userId],
                    [
                        'tracker' => $index + 1,
                        'description' => $description,
                    ]
                );
            }
        });
    }

    public function repayLoan(Request $request)
    {
        $loanAmortizationId = $this->aes->decrypt($request->encrypted_id);
        $installment = $request->installment;
        $paymentDate = $this->todayDate()->toDateString();

        $dueDate = DueDates::with('loaninstallment')
            ->where('loan_amortization_id', $loanAmortizationId)
            ->orderBy('date', 'desc')
            ->first();

        if ($dueDate && $dueDate->loaninstallment) {
        
            $loanInstallment = $dueDate->loaninstallment
                ->where('due_dates_id', $dueDate->id)
                ->where('status', 'unpaid')
                ->first();

            if ($loanInstallment) {

                if($installment > $loanInstallment->outstandingBalance){
                    return redirect()->back()
                        ->withErrors(['installment' => 'Installment cannot be greater than the outstanding balance'])
                        ->withInput();
                }

                $newOutstandingBalance = $loanInstallment->outstandingBalance - $installment;

                $loanInstallment->update([
                    'installment' => $installment,
                    'principal' => $installment - $loanInstallment->interest,
                    'outstandingBalance' => $newOutstandingBalance,
                    'paymentDate' => $paymentDate,
                    'status' => 'paid'
                ]);

                FinancialAccount::where('id', $this->loanID())->increment('balance', $installment);

                LoanInstallment::where('loan_amortization_id', $loanAmortizationId)
                    ->where('status', 'unpaid')
                    ->update([
                        'status' => 'paid'
                ]);

                if($newOutstandingBalance == 0) {
                    LoanAmortization::where('id', $loanAmortizationId)->update(['paymentStatus' => 'paid']);
                    return;
                }

                if ($paymentDate != $dueDate->date) {
                    
                    LoanInstallment::create([
                        'users_id' => $loanInstallment->users_id,
                        'loan_amortization_id' => $loanAmortizationId,
                        'due_dates_id' => $dueDate->id,
                        'interest' => 0,
                        'principal' => 0,
                        'outstandingBalance' => $newOutstandingBalance,
                        'originalBalance' => $newOutstandingBalance,
                        'status' => 'unpaid',
                        'lastComputedDate' => $loanInstallment->lastComputedDate
                    ]);

                } else {

                    $nextDueDate = Carbon::parse($dueDate->date)->addMonth();

                    $borrower = LoanAmortization::where('id', $loanAmortizationId)->first();

                    $loanInstallment->refresh();

                    $dueDates = DueDates::create([
                        'loan_amortization_id' => $loanAmortizationId,
                        'date' => $nextDueDate,
                    ]);

                    LoanInstallment::create([
                        'users_id' => $borrower->users_id,
                        'loan_amortization_id' => $loanAmortizationId,
                        'due_dates_id' => $dueDates->id,
                        'interest' => 0,
                        'principal' => 0,
                        'outstandingBalance' => $loanInstallment->outstandingBalance,
                        'originalBalance' => $loanInstallment->outstandingBalance,
                        'status' => 'unpaid'
                    ]);
                }
            }
        }

    }

    public function search(Request $request)
    {
        Session::put('search', $request->search);
        return redirect()->route('admin.loans');
    }

    public function clearSearch()
    {
        Session::forget('search');
        return redirect()->route('admin.loans');
    }
}
