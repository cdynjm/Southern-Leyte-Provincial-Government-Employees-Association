<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use App\Models\User;

class DashboardController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $employees = User::where('role', 'employee')->count(); 
        return Inertia::render('admin/dashboard', [
            'employees' => $employees,
        ]);
    }
}
