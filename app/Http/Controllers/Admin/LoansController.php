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

class LoansController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        return Inertia::render('admin/loans/loans', [
            
        ]);
    }

    public function loanTracker()
    {
        return Inertia::render('admin/loans/loan-tracker', [
            
        ]);
    }
}
