<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Session;

use App\Models\User;
use App\Models\Contributions;
use App\Models\ContributionTypes;
use App\Models\Offices;
use App\Models\FinancialAccount;

class ContributionsController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function employeeContributions(Request $request)
    {
        $search = session('search');
        $type = session('type');
        $officeEncrypted = session('office');
        $office = $officeEncrypted != '' ? $this->aes->decrypt($officeEncrypted) : '';

        $employees = User::with('office')
            ->where('role', 'employee')
            ->when(filled($search), function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when(filled($office), function ($query) use ($office) {
                $query->where('offices_id', $office);
            })
            ->when(filled($type), function ($query) use ($type) {
                $query->where('employmentType', $type);
            })
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->through(function ($employee) {
                $employee->encrypted_id = $this->aes->encrypt($employee->id);
                return $employee;
            });

        $contributionTypes = ContributionTypes::orderBy('description', 'asc')->get()->map(function ($contributionType) {
            $contributionType->encrypted_id = $this->aes->encrypt($contributionType->id);
            return $contributionType;
        });

        $offices = Offices::orderBy('officeName', 'asc')->get()->map(function ($office) {
            $office->encrypted_id = $this->aes->encrypt($office->id);
            return $office;
        });

        return Inertia::render('admin/contributions/employee-contributions', [
            'employees' => $employees,
            'search' => $search,
            'office' => $officeEncrypted,
            'type' => $type,
            'contributionTypes' => $contributionTypes,
            'offices' => $offices,
        ]);
    }

    public function store(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);
        $contributionTypeId = $this->aes->decrypt($request->contribution_type_id);

        $months = $request->month;
        $monthlyAmount = $request->amount / count($months);

        foreach ($months as $month) {
            Contributions::create([
                'users_id' => $id,
                'contribution_types_id' => $contributionTypeId,
                'year' => $request->year,
                'month' => $month,
                'amount' => $monthlyAmount,
            ]);
        }

        $type = ContributionTypes::where('id', $contributionTypeId)->value('financial_account_id');
        FinancialAccount::where('id', $type)->increment('balance', $request->amount);

        User::where('id', $id)->increment('totalContribution', $request->amount);
    }

    public function viewContributions(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);

        $employee = User::findOrFail($id);

        $contributionTypes = ContributionTypes::orderBy('description', 'asc')->get();

        $contributionsByType = $contributionTypes->map(function ($type) use ($employee, $request) {

            $pageKey = 'page_' . $type->id;

            $paginated = $employee->contributions()
                ->where('contribution_types_id', $type->id)
                ->with('contributiontype')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'asc')
                ->paginate(
                    12,
                    ['*'],
                    $pageKey
                )
                ->through(function ($contribution) {
                    $contribution->encrypted_id = $this->aes->encrypt($contribution->id);
                    return $contribution;
                })
                ->withQueryString();

            return [
                'type' => $type,
                'contributions' => $paginated,
            ];
        });

        return Inertia::render('admin/contributions/view-contributions', [
            'employee' => $employee,
            'contributionsByType' => $contributionsByType,
            'encrypted_id' => $request->encrypted_id,
        ]);
    }


    public function destroy(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);

        $contribution = Contributions::findOrFail($id);

        User::where('id', $contribution->users_id)->decrement('totalContribution', $contribution->amount);

        $contribution->delete();
    }

    public function contributionTypes()
    {
        $contributionTypes = ContributionTypes::with('financialaccount')->orderBy('description', 'asc')->get()->map(function ($contributionType) {
            $contributionType->encrypted_id = $this->aes->encrypt($contributionType->id);
            $contributionType->financialAccountEncrypted_id = $this->aes->encrypt($contributionType->financial_account_id);
            return $contributionType;
        });

        $financialAccount = FinancialAccount::orderBy('name', 'asc')->get()->map(function ($financialAccount) {
            $financialAccount->encrypted_id = $this->aes->encrypt($financialAccount->id);
            return $financialAccount;
        });

        return Inertia::render('admin/contributions/contribution-types', [
            'contributionTypes' => $contributionTypes,
            'financialAccount' => $financialAccount,
        ]);
    }

    public function storeContributionType(Request $request)
    {
        $financialAccountId = $this->aes->decrypt($request->financialAccount);
        ContributionTypes::create([
            'description' => ucwords($request->description),
            'financial_account_id' => $financialAccountId,
        ]);
    }

    public function updateContributionType(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);
        $financialAccountId = $this->aes->decrypt($request->financialAccount);

        ContributionTypes::where('id', $id)->update([
            'description' => ucwords($request->description),
            'financial_account_id' => $financialAccountId,
        ]);
    }

    public function destroyContributionType(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);
        ContributionTypes::where('id', $id)->delete();
    }

    public function search(Request $request)
    {
        Session::put('search', $request->search);
        Session::put('office', $request->office);
        Session::put('type', $request->type);
    }

    public function clearSearch()
    {
        Session::forget('search');
        Session::forget('office');
        Session::forget('type');
    }
}
