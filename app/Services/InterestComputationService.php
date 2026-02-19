<?php 

namespace App\Services;

use App\Models\LoanAmortization;
use App\Models\LoanInstallment;
use App\Models\DueDates;
use Carbon\Carbon;

class InterestComputationService
{
    public function InterestComputation($borrower, $months, $today, $loanAmortizationId)
    {
        $monthlyRate = $borrower->rateInMonth / 100;

        if($borrower->paymentStatus === 'unpaid' && $borrower->status === 'approved') {

            for ($m = 0; $m < $months->count(); $m++) {

                if($m == 0) {
                    $prev = Carbon::parse($borrower->date);
                } else {
                    $prev = Carbon::parse($months[$m - 1]->date);
                }

                $current = $months[$m];

                $lastPrevPayment = $current->loaninstallment
                    ->whereNotNull('paymentDate')
                    ->sortBy('paymentDate')
                    ->last();
               
                if($lastPrevPayment) {
                    $prevDate = Carbon::parse($lastPrevPayment->paymentDate);
                } else {

                    if($m == 0) {
                        $prevDate = $prev;
                    }
                    else {
                        $prevDate = $prev;
                    }
                        
                }

                foreach ($current->loaninstallment->where('status', 'unpaid') as $payment) {

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
                        
                        $daysInMonth = $prev->daysInMonth;

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

                                $daysInMonth = $prev->daysInMonth;

                                $daysGap = $cycleStart->diffInDays($cycleEnd) + 1;

                                $interest = $payment->originalBalance
                                            * $monthlyRate
                                            * ($daysGap / $daysInMonth);

                                $payment->interest = $interest;
                                $payment->outstandingBalance = $payment->originalBalance + $interest;

                                $payment->lastComputedDate = $today->toDateString();
                                $payment->save();

                                $payment->refresh();

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
    }
}