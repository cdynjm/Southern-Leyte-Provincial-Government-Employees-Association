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

class DashboardController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $regulars = User::where('employmentType', 'regular')->count(); 
        $joborders = User::where('employmentType', 'job order')->count(); 

        $contributions = Contributions::select(
                'contribution_types_id',
                DB::raw('SUM(amount) as amount')
            )
            ->groupBy('contribution_types_id')
            ->with('contributiontype')
            ->get();
        
        $balance = $contributions->sum('amount');

        return Inertia::render('admin/dashboard', [
            'regulars' => $regulars,
            'joborders' => $joborders,
            'contributions' => $contributions,
            'balance' => $balance,
        ]);
    }
}
