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
use App\Models\Offices;

class EmployeesController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $employees = User::with('office')->where('role', 'employee')->orderBy('name', 'asc')->paginate(10)->through(function ($employee) {
            $employee->encrypted_id = $this->aes->encrypt($employee->id);
            $employee->officeEncrypted_id = $this->aes->encrypt($employee->offices_id);
            return $employee;
        });

       $offices = Offices::orderBy('officeName', 'asc')->get()->map(function ($office) {
            $office->encrypted_id = $this->aes->encrypt($office->id);
            return $office;
        });

        return Inertia::render('admin/employees', [
            'employees' => $employees,
            'offices' => $offices
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'employeeID' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'office' => ['required', 'string', 'max:255'],
            'contactNumber' => ['required', 'string', 'max:255'],
            'startDate' => ['required', 'date'],
            'birthDate' => ['required', 'date'],
            'employmentType' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => ['required', 'string'],
        ]);

        User::create([
            'name' => strtoupper($validated['name']),
            'employeeID' => strtoupper($validated['employeeID']),
            'position' => ucwords($validated['position']),
            'offices_id' => $this->aes->decrypt($validated['office']),
            'contactNumber' => $validated['contactNumber'],
            'startDate' => $validated['startDate'],
            'endDate' => $validated['endDate'] ?? null,
            'birthDate' => $validated['birthDate'],
            'employmentType' => $validated['employmentType'],
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
            'employeeID' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'office' => ['required', 'string', 'max:255'],
            'contactNumber' => ['required', 'string', 'max:255'],
            'startDate' => ['required', 'date'],
            'birthDate' => ['required', 'date'],
            'employmentType' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
        ]);

        $data = [
            'name' => strtoupper($validated['name']),
            'employeeID' => strtoupper($validated['employeeID']),
            'position' => ucwords($validated['position']),
            'offices_id' => $this->aes->decrypt($validated['office']),
            'contactNumber' => $validated['contactNumber'],
            'startDate' => $validated['startDate'],
            'endDate' => $validated['endDate'] ?? null,
            'birthDate' => $validated['birthDate'],
            'employmentType' => $validated['employmentType'],
            'email' => $validated['email']
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
