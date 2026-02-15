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

class EncodeEmployeeLoanController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index(Request $request)
    {

        $employee = User::where('id', $this->aes->decrypt($request->encrypted_id))->first();

        return Inertia::render('employee/special-account/encode-employee-loan', [
            'encrypted_id' => $request->encrypted_id,
            'employee' => $employee,
        ]);
    }

    public function store(Request $request)
    {
        $employeeId = $this->aes->decrypt($request->encrypted_id);

        $borrowed = (float) $request->borrowed;
        $processingFee = (float) $request->processingFee;
        $rateInMonth = (float) $request->rateInMonth / 100; // convert % to decimal

        // Net Proceeds
        $netProceeds = $borrowed - $processingFee;

        // Use loan date from request
        $loanDate = Carbon::parse($request->date);
        $loanMonth = $loanDate->month;

        // Determine period in months
        // If loan in December → 1-time payment
        if ($loanMonth == 12) {
            $periodInMonths = 1;
        } else {
            $periodInMonths = 12 - $loanMonth;
        }

        // ---- PMT Formula (same as Excel) ----
        // PMT = (r * PV) / (1 - (1 + r)^(-n))
        if ($rateInMonth > 0) {
            $monthlyInstallment = ($rateInMonth * $borrowed) /
                (1 - pow(1 + $rateInMonth, -$periodInMonths));
        } else {
            $monthlyInstallment = $borrowed / $periodInMonths;
        }

        $monthlyInstallment = round($monthlyInstallment, 2);

        // Save to database
        $loanAmortization = LoanAmortization::create([
            'users_id' => $employeeId,
            'tracker' => 1,
            'borrowed' => $borrowed,
            'processingFee' => $processingFee,
            'netProceeds' => $netProceeds,
            'periodInMonths' => $periodInMonths,
            'rateInMonth' => $rateInMonth * 100, // store as percent
            'monthlyInstallment' => $monthlyInstallment,
            'status' => 'pending',
            'paymentStatus' => 'unpaid',
            'date' => $loanDate, // payment date = loan date
        ]);

        $paymentDate = $loanDate->copy(); // Keep exact loan date (15th stays 15th)

        $dueDates = DueDates::create([
            'loan_amortization_id' => $loanAmortization->id,
            'date' => $paymentDate->addMonth(),
            'status' => 'unpaid'
        ]);

        LoanInstallment::create([
            'users_id' => $employeeId,
            'loan_amortization_id' => $loanAmortization->id,
            'due_dates_id' => $dueDates->id,
            'interest' => 0,
            'principal' => 0,
            'outstandingBalance' => $borrowed,
            'originalBalance' => $borrowed,
            'status' => 'unpaid'
        ]);
    }
}
