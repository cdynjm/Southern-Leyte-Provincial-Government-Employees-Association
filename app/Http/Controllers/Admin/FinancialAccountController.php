<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Contributions;
use App\Models\ContributionTypes;
use App\Models\Offices;
use App\Models\FinancialAccount;

class FinancialAccountController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $financialAccount = FinancialAccount::get()->map(function ($financialAccount) {
            $financialAccount->encrypted_id = $this->aes->encrypt($financialAccount->id);
            return $financialAccount;
        });

        return Inertia::render('admin/financial-account', [
            'financialAccount' => $financialAccount,
        ]);
    }

    public function store(Request $request)
    {
        FinancialAccount::create([
            'name' => $request->name,
            'balance' => $request->balance,
        ]);
    }

    public function update(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);
        $financialAccount = FinancialAccount::findOrFail($id);

        DB::transaction(function () use ($request, $financialAccount) {

            $financialAccount->update([
                'name' => $request->name,
                'balance' => $request->balance,
            ]);

            if ($request->boolean('deduct_enabled')) {

                if (!$request->deduct_from_account || !$request->deduct_amount) {
                    return redirect()->back()
                        ->withErrors(['deduct' => 'Deduction account and amount are required.'])
                        ->withInput();
                }

                $deductAccountId = $this->aes->decrypt($request->deduct_from_account);
                $deductAccount = FinancialAccount::findOrFail($deductAccountId);

                if ($deductAccount->id === $financialAccount->id) {
                    return redirect()->back()
                        ->withErrors(['deduct' => 'Cannot deduct from the same account.'])
                        ->withInput();
                }

                if ($deductAccount->balance < $request->deduct_amount) {
                    return redirect()->back()
                        ->withErrors(['deduct' => 'Insufficient balance in selected account.'])
                        ->withInput();
                }

                $deductAccount->decrement('balance', $request->deduct_amount);

                $financialAccount->increment('balance', $request->deduct_amount);
            }
        });
    }

    public function destroy(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);
        $financialAccount = FinancialAccount::findOrFail($id);
        $financialAccount->delete();
    }
}
