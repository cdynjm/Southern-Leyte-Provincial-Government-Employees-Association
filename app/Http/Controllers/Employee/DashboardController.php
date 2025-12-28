<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;

use App\Models\User;
use App\Models\Contributions;
use App\Models\ContributionTypes;

class DashboardController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index(Request $request)
    {
       $employee = User::findOrFail(auth()->user()->id);

        $contributionTypes = ContributionTypes::orderBy('description', 'asc')->get();

        $contributionsByType = $contributionTypes->map(function ($type) use ($employee, $request) {

            $pageKey = 'page_' . $type->id;

            $paginated = $employee->contributions()
                ->where('contribution_types_id', $type->id)
                ->with('contributiontype')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
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

        return Inertia::render('employee/dashboard', [
            'employee' => $employee,
            'contributionsByType' => $contributionsByType,
        ]);
    }
}
