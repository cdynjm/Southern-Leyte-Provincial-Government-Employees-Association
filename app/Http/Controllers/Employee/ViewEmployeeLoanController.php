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

        $borrower = LoanAmortization::with([
            'user',
            'duedates.loaninstallment'
        ])->findOrFail($loanAmortizationId);

        $borrower->duedates = $borrower->duedates->map(function ($duedate) {
            $duedate->encrypted_id = $this->aes->encrypt($duedate->id);
            return $duedate;
        });


      /*  $installments = LoanInstallment::where('loan_amortization_id', $loanAmortizationId)
        ->orderBy('date', 'asc')
        ->get();

        $monthlyRate = $borrower->rateInMonth / 100;
        $today = Carbon::parse('2026-04-13');

        for ($i = 1; $i < $installments->count(); $i++) {

            $prev = $installments[$i - 1];
            $current = $installments[$i];

            if($prev->paymentDate == null) {
                $prevDate = Carbon::parse($prev->date);
            }
            else {
                $prevDate = Carbon::parse($prev->paymentDate);
            }

            $currentDate = Carbon::parse($current->date);

            $cycleStart = $prevDate->copy()->addDay();
            $cycleEnd = $currentDate;

            if ($current->lastComputedDate === $today->toDateString()) {
                break;
            }

            if($current->status == 'paid') {
                continue;
            }

            // 🟢 CASE 1: Today passed this month completely
            if ($today->gt($cycleEnd)) {

                $daysInMonth = $prevDate->daysInMonth;

                $interest = $prev->outstandingBalance * $monthlyRate;

                $current->interest = $interest;
                $current->outstandingBalance = $prev->outstandingBalance + $interest;

                $current->lastComputedDate = $cycleEnd->toDateString();
                $current->save();

                // move to next month
                continue;
            }

            // 🟡 CASE 2: Today is inside this cycle
            if ($today->between($cycleStart, $cycleEnd)) {

                $daysInMonth = $prevDate->daysInMonth;

                $daysGap = $cycleStart->diffInDays($today) + 1;

                $interest = $prev->outstandingBalance
                            * $monthlyRate
                            * ($daysGap / $daysInMonth);

                $current->interest = $interest;
                $current->outstandingBalance = $prev->outstandingBalance + $interest;

                $current->lastComputedDate = $today->toDateString();
                $current->save();

                break;
            }
        }


        $borrower->load('loaninstallment'); */

        return Inertia::render('employee/special-account/view-employee-loan', [
            'encrypted_id' => $request->encrypted_id,
            'borrower' => $borrower,
        ]);
    }
}
