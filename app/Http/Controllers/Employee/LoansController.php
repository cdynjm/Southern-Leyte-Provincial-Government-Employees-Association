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

class LoansController extends Controller
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

        $borrowers = LoanAmortization::with('user')->where('users_id', auth()->user()->id)
            ->orderBy('dateApplied', 'desc')
            ->paginate(30)->through(function ($borrower) {
                $borrower->encrypted_id = $this->aes->encrypt($borrower->id);
                return $borrower;
            });
        
        return Inertia::render('employee/loans', [
            'borrowers' => $borrowers,
        ]);
    }
}
