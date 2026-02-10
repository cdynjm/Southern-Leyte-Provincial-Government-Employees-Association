<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Session;

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
        $search = session('search');
        $type = session('type');
        $officeEncrypted = session('office');
        $office = $officeEncrypted != '' ? $this->aes->decrypt($officeEncrypted) : '';

        $employees = User::with('office')->where('role', 'employee')
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
        ->paginate(30)->through(function ($employee) {
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
            'offices' => $offices,
            'search' => $search,
            'office' => $officeEncrypted,
            'type' => $type,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'employeeID' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'office' => ['required', 'string', 'max:255'],
            'startDate' => ['required', 'date'],
            'birthDate' => ['required', 'date'],
            'employmentType' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => ['required', 'string'],
            'specialAccount' => ['required', 'string', 'max:255'],
        ]);

        User::create([
            'name' => strtoupper($validated['name']),
            'employeeID' => strtoupper($validated['employeeID']),
            'position' => ucwords($validated['position']),
            'offices_id' => $this->aes->decrypt($validated['office']),
            'contactNumber' => $request->contactNumber,
            'startDate' => $validated['startDate'],
            'endDate' => $validated['endDate'] ?? null,
            'birthDate' => $validated['birthDate'],
            'employmentType' => $validated['employmentType'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'employee',
            'specialAccount' => $validated['specialAccount'],
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
            'startDate' => ['required', 'date'],
            'birthDate' => ['required', 'date'],
            'employmentType' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'specialAccount' => ['required', 'string', 'max:255'],

        ]);

        $data = [
            'name' => strtoupper($validated['name']),
            'employeeID' => strtoupper($validated['employeeID']),
            'position' => ucwords($validated['position']),
            'offices_id' => $this->aes->decrypt($validated['office']),
            'contactNumber' => $request->contactNumber,
            'startDate' => $validated['startDate'],
            'endDate' => $validated['endDate'] ?? null,
            'birthDate' => $validated['birthDate'],
            'employmentType' => $validated['employmentType'],
            'email' => $validated['email'],
            'specialAccount' => $validated['specialAccount'],
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
