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

class DashboardController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index(Request $request)
    {
       $search = session('search');

        $employees = User::with('office')->where('role', 'employee')
            ->when(filled($search), function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
        ->orderBy('name', 'asc')
        ->paginate(10)->through(function ($employee) {
            $employee->encrypted_id = $this->aes->encrypt($employee->id);
            return $employee;
        });

        return Inertia::render('employee/dashboard', [
            'employees' => $employees,
            'search' => $search,
        ]);
    }

    public function search(Request $request)
    {
        Session::put('search', $request->search);
        return redirect()->route('employee.dashboard');
    }

    public function clearSearch()
    {
        Session::forget('search');
        return redirect()->route('employee.dashboard');
    }
}
