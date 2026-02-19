<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

use App\Models\User;
use App\Models\Contributions;
use App\Models\ContributionTypes;
use App\Models\Offices;
use App\Models\FinancialAccount;

class AdminsController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $admins = User::where('role', 'admin')->orderBy('name', 'asc')->get()->map(function ($admin) {
            $admin->encrypted_id = $this->aes->encrypt($admin->id);
            return $admin;
        });

        return Inertia::render('admin/admins', [
            'admins' => $admins
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => ['required', 'string'],
        ]);

        User::create([
            'name' => strtoupper($validated['name']),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin'
        ]);
    }

    public function update(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'password' => ['required', 'string'],
        ]);

        $data = [
            'name' => strtoupper($validated['name']),
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        User::where('id', $id)->update($data);
    }
}
