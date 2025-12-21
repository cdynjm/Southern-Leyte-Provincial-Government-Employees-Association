<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Session;

use App\Models\User;

class ContributionsController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index(Request $request)
    {
        $search = session('search');

        $employees = User::where('role', 'employee')
        ->where('name', 'like', "%{$search}%")
        ->orderBy('name', 'asc')->paginate(10)->through(function ($employee) {
            $employee->encrypted_id = $this->aes->encrypt($employee->id);
            return $employee;
        });

        return Inertia::render('admin/contributions', [
            'employees' => $employees,
            'search' => $search,
        ]);
    }

    public function search(Request $request)
    {
        Session::put('search', $request->search);
    }

    public function clearSearch()
    {
        Session::forget('search');
    }
}
