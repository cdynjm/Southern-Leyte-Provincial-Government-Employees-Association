<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Session;
use Carbon\Carbon;

use App\Models\User;
use App\Models\Contributions;
use App\Models\ContributionTypes;
use App\Models\LoanAmortization;
use App\Models\LoanTracker;
use App\Models\FinancialAccount;

use App\Traits\HasFinancialAccountHelpers;
use App\Traits\HasDateHelpers;

class DashboardController extends Controller
{
    protected $aes;

     use HasFinancialAccountHelpers;
     use HasDateHelpers;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index(Request $request)
    {
       $search = session('search');

        $employees = User::with('office')->where('role', 'employee')
            ->when(filled($search), function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
        ->orderBy('name', 'asc')
        ->paginate(10)->through(function ($employee) {
            $employee->encrypted_id = $this->aes->encrypt($employee->id);
            return $employee;
        });

        if(auth()->user()->loantracker?->tracker) {
            $borrowers = LoanAmortization::with('user')->where('tracker', auth()->user()->loantracker->tracker)
                ->orderBy('paymentStatus', 'desc')
                ->orderBy('dateApplied', 'desc')
                ->paginate(30)->through(function ($borrower) {
                    $borrower->encrypted_id = $this->aes->encrypt($borrower->id);
                    return $borrower;
                });
        } else {
            $borrowers = LoanAmortization::with('user')->where('users_id', auth()->user()->id)
                ->orderBy('paymentStatus', 'desc')
                ->orderBy('dateApplied', 'desc')
                ->paginate(10)->through(function ($borrower) {
                    $borrower->encrypted_id = $this->aes->encrypt($borrower->id);
                    return $borrower;
                });
        }

        return Inertia::render('employee/dashboard', [
            'employees' => $employees,
            'borrowers' => $borrowers,
            'search' => $search,
        ]);
    }

    public function forwardLoan(Request $request)
    {
        $loanAmortizationId = $this->aes->decrypt($request->encrypted_id);

        $loanAmortization = LoanAmortization::where('id', $loanAmortizationId)
        ->where('tracker', auth()->user()->loantracker->tracker)->first();
        
        if($loanAmortization) {

            $loanTracker = LoanTracker::orderBy('tracker', 'desc')->value('tracker');
            
            if($loanTracker == $loanAmortization->tracker)
            {
                $loanAmortization->update([
                    'status' => 'approved',
                    'date' => $this->todayDate()->toDateString()
                ]);

                FinancialAccount::where('id', $this->loanID())->decrement('balance', $loanAmortization->borrowed);

            }

             if(auth()->user()?->loantracker->tracker == 2)
                $loanAmortization->update(['validatedBy' => auth()->user()->name]);
             if(auth()->user()?->loantracker->tracker == 3)
                $loanAmortization->update(['approvedBy' => auth()->user()->name]);

             $loanAmortization->increment('tracker');

        } else {
            return redirect()->back()
                ->withErrors(['forwarding' => 'This transaction has already been processed at your station'])
                ->withInput();
        }
    }

    public function search(Request $request)
    {
        Session::put('search', $request->search);
        return redirect()->route('employee.dashboard');
    }

    public function clearSearch()
    {
        Session::forget('search');
        return redirect()->route('employee.dashboard');
    }
}
