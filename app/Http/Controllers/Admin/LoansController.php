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

class LoansController extends Controller
{
    protected $aes;

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
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($borrower) {
                $borrower->encrypted_id = $this->aes->encrypt($borrower->id);
                return $borrower;
        });

        return Inertia::render('admin/loans/loans', [
            'borrowers' => $borrowers,
            'search' => $search,
        ]);
    }

    public function viewEmployeeLoan(Request $request)
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

        $monthlyRate = $borrower->rateInMonth / 100;
        $today = Carbon::parse('2026-08-17');

        for ($m = 0; $m < $months->count(); $m++) {

            $current = $months[$m];

            $lastPrevPayment = $current->loaninstallment
                ->whereNotNull('paymentDate')
                ->sortBy('paymentDate')
                ->last();
            
            if($lastPrevPayment) {
                $prevDate = Carbon::parse($lastPrevPayment->paymentDate);
            } else {

                if($m == 0)
                    $prevDate = Carbon::parse($borrower->date);
                else {
                    $prev = $months[$m - 1];
                    $prevDate = Carbon::parse($prev->date);
                }
                    
            }

            foreach ($current->loaninstallment as $payment) {

                $cycleStart = $prevDate->copy()->addDay();
                $cycleEnd = Carbon::parse($current->date);

                if($payment->status == 'paid') {
                    continue;
                }

                if ($payment->lastComputedDate === $today->toDateString()) {
                    break;
                }

                if ($today->between($cycleStart, $cycleEnd)) {
            
                    $daysInMonth = $prevDate->daysInMonth;

                    $daysGap = $cycleStart->diffInDays($today) + 1;

                    $interest = $payment->originalBalance
                                * $monthlyRate
                                * ($daysGap / $daysInMonth);

                    $payment->interest = $interest;
                    $payment->outstandingBalance = $payment->originalBalance + $interest;

                    $payment->lastComputedDate = $today->toDateString();
                    $payment->save();

                    break;

                } else {

                    if ($m === $months->count() - 1) {
        
                        $nextDueDate = Carbon::parse($months->last()->date)->addMonth();

                        if($today->gt($months->last()->date) && $nextDueDate->month != 1)
                        {

                            $dueDates = DueDates::create([
                                'loan_amortization_id' => $loanAmortizationId,
                                'date' => $nextDueDate,
                                'status' => 'unpaid'
                            ]);

                            LoanInstallment::create([
                                'users_id' => $borrower->users_id,
                                'loan_amortization_id' => $loanAmortizationId,
                                'due_dates_id' => $dueDates->id,
                                'interest' => 0,
                                'principal' => 0,
                                'outstandingBalance' => $payment->outstandingBalance,
                                'originalBalance' => $payment->outstandingBalance,
                                'status' => 'unpaid'
                            ]);

                            $months->push($dueDates);
                        }
                    }
                }

            }
            
        }

        $borrower->load('duedates.loaninstallment');

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
