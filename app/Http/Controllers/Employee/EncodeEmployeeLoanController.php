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
}
