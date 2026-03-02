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
use App\Models\FinancialAccount;
use Carbon\Carbon;
use App\Traits\HasFinancialAccountHelpers;
use App\Traits\HasDateHelpers;

class EncodeEmployeeLoanController extends Controller
{
    protected $aes;

    use HasDateHelpers;
    use HasFinancialAccountHelpers;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index(Request $request)
    {

        $employee = User::where('id', $this->aes->decrypt($request->encrypted_id))->first();

        $today = $this->todayDate();

        return Inertia::render('employee/special-account/encode-employee-loan', [
            'encrypted_id' => $request->encrypted_id,
            'employee' => $employee,
            'today' => $today,
        ]);
    }

    public function store(Request $request)
    {

        $loanBalance = FinancialAccount::where('id', $this->loanID())->value('balance');

        if($loanBalance < $request->borrowed) {
            return redirect()->back()
                ->withErrors(['balance' => 'Loanable balance is currently insufficient'])
                ->withInput();
        }

        $employeeId = $this->aes->decrypt($request->encrypted_id);

        $borrowed = (float) $request->borrowed;

        if ($borrowed <= 5000) {
            $calculatedProcessingFee = 50;
        } else {
            $calculatedProcessingFee = $borrowed * 0.01;
        } // 1% processing fee

        $processingFee = (float) $calculatedProcessingFee;
        $rateInMonth = (float) $request->rateInMonth / 100; // convert % to decimal

        // Net Proceeds
        $netProceeds = $borrowed - $processingFee;

        // Use loan date from request
        $loanDate = Carbon::parse($request->date);

        // Save to database
        $loanAmortization = LoanAmortization::create([
            'users_id' => $employeeId,
            'tracker' => 1,
            'borrowed' => $borrowed,
            'processingFee' => $processingFee,
            'netProceeds' => $netProceeds,
           // 'periodInMonths' => $periodInMonths,
            'rateInMonth' => $rateInMonth * 100,
          //  'monthlyInstallment' => $monthlyInstallment,
            'status' => 'pending',
            'paymentStatus' => 'unpaid',
            'dateApplied' => $loanDate, 
            'encodedBy' => auth()->user()->name
        ]);

        $paymentDate = $loanDate->copy(); // Keep exact loan date (15th stays 15th)

        $dueDates = DueDates::create([
            'loan_amortization_id' => $loanAmortization->id,
           // 'date' => $paymentDate->addMonth(),
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
