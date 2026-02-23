<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contributions;
use App\Models\ContributionTypes;
use App\Traits\HasContributionTypeHelpers;
use Inertia\Inertia;

class UnpaidController extends Controller
{
    use HasContributionTypeHelpers;

    public function index(Request $request)
    {
        $pendingContributions = Contributions::with('contributionType')
                ->where('users_id', auth()->user()->id)
                ->where('contribution_types_id', $this->contributionTypeId())
                ->orderBy('created_at', 'desc')
                ->get();

        return Inertia::render('employee/unpaid', [
            'pendingContributions' => $pendingContributions,
            'year' => $this->year()
        ]);
    }
}
