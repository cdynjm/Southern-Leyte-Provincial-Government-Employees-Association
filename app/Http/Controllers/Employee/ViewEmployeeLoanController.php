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
use Carbon\Carbon;

class ViewEmployeeLoanController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index(Request $request)
    {
        $loanAmortizationId = $this->aes->decrypt($request->encrypted_id);
        $borrower = LoanAmortization::with(['loaninstallment', 'user'])->where('id', $loanAmortizationId)->first();

        $borrower->loaninstallment->map(function ($installment) {
            $installment->encrypted_id = $this->aes->encrypt($installment->id);
            return $installment;
        });

        $installments = LoanInstallment::where('loan_amortization_id', $loanAmortizationId)
        ->orderBy('date', 'asc')
        ->get();

        $monthlyRate = $borrower->rateInMonth / 100;

        $today = Carbon::today();

        for ($i = 1; $i < $installments->count(); $i++) {
            $prev = $installments[$i - 1];
            $current = $installments[$i];

            $prevDate = Carbon::parse($prev->date);
            $currentDate = Carbon::parse($current->date);

            if ($today->between($prevDate->copy()->addDay(), $currentDate)) {
        
                if ($current->lastComputedDate === $today->toDateString()) {
                    break;
                }

                $daysInMonth = $currentDate->daysInMonth;

                $daysGap = $prevDate->diffInDays($today);

                $dailyInterest = $prev->outstandingBalance * $monthlyRate * ($daysGap / $daysInMonth);

                $current->interest = $dailyInterest;

                $current->outstandingBalance = $prev->outstandingBalance + $dailyInterest;

                $current->lastComputedDate = $today->toDateString();

                $current->save();

                break;
            }

        }


        return Inertia::render('employee/special-account/view-employee-loan', [
            'encrypted_id' => $request->encrypted_id,
            'borrower' => $borrower,
        ]);
    }
}
