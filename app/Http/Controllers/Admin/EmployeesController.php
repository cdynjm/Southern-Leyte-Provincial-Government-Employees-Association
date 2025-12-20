<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

use App\Models\User;

class EmployeesController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $employees = User::where('role', 'employee')->orderBy('name', 'asc')->paginate(10)->through(function ($employee) {
            $employee->encrypted_id = $this->aes->encrypt($employee->id);
            return $employee;
        });

        return Inertia::render('admin/employees', [
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => ['required', 'string'],
        ]);

        User::create([
            'name' => strtoupper($validated['name']),
            'position' => ucwords($validated['position']),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'employee',
        ]);
    }

    public function update(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
        ]);

        $data = [
            'name' => strtoupper($validated['name']),
            'position' => ucwords($validated['position']),
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        User::where('id', $id)->update($data);
    }

    public function destroy(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);
        User::where('id', $id)->delete();
    }
    
}
