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
use Illuminate\Support\Facades\Gate;
use App\Traits\DailyInterestComputation;

class ViewEmployeeLoanController extends Controller
{
    protected $aes;

    use HasDateHelpers;
    use DailyInterestComputation;

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

        $this->authorize('view-loan-transaction', $borrower);

        $borrower->duedates = $borrower->duedates->map(function ($duedate) {
            $duedate->encrypted_id = $this->aes->encrypt($duedate->id);
            return $duedate;
        });

        $months = DueDates::with('loaninstallment')->where('loan_amortization_id', $loanAmortizationId)
        ->orderBy('date', 'asc')
        ->get();

        $today = $this->todayDate();

        $this->dailyInterestComputation($borrower, $months, $today, $loanAmortizationId);

        return Inertia::render('employee/special-account/view-employee-loan', [
            'encrypted_id' => $request->encrypted_id,
            'borrower' => $borrower,
            'today' => $today
        ]);
    }
}
