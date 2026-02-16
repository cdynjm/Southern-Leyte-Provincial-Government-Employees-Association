<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Session;

use App\Models\User;
use App\Models\Contributions;
use App\Models\ContributionTypes;
use App\Models\LoanAmortization;
use App\Models\LoanInstallment;
use App\Models\DueDates;
use Carbon\Carbon;
use App\Traits\HasDateHelpers;

class ViewEmployeeLoanController extends Controller
{
    protected $aes;

    use HasDateHelpers;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index(Request $request)
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
        $today = $this->todayDate();

         if($borrower->paymentStatus === 'unpaid') {

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

                    if($prevDate->isSameDay($current->date))
                       $cycleStart = $prevDate->copy();
                    else
                        $cycleStart = $prevDate->copy()->addDay();
                    
                    $cycleEnd = Carbon::parse($current->date);

                    if ($payment->lastComputedDate === $today->toDateString()) {
                        break;
                    }

                    if ($cycleStart->ne($cycleEnd) && $today->between($cycleStart, $cycleEnd)) {
                    
                        if($payment->status == 'paid') {
                            continue;
                        }
                        
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
        }

        return Inertia::render('employee/special-account/view-employee-loan', [
            'encrypted_id' => $request->encrypted_id,
            'borrower' => $borrower,
            'today' => $today
        ]);
    }
}
