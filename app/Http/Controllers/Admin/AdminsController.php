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
use App\Models\AdminPermissions;
use App\Models\Permissions;

class AdminsController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $admins = User::with('adminpermissions.permission')
        ->where('role', 'admin')
        ->orderBy('name', 'asc')
        ->get()
        ->map(function ($admin) {

            $admin->encrypted_id = $this->aes->encrypt($admin->id);

            if ($admin->adminpermissions) {
                $admin->adminpermissions->each(function ($adminPermission) {

                    if ($adminPermission->permission) {
                        $adminPermission->permission->encrypted_id =
                            $this->aes->encrypt($adminPermission->permission->id);
                    }

                });
            }

        return $admin;
    });

        $permissions = Permissions::get()->map(function ($per) {
            $per->encrypted_id = $this->aes->encrypt($per->id);
            return $per;
        });

        return Inertia::render('admin/admins', [
            'admins' => $admins,
            'permissions' => $permissions
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
            'password' => ['nullable', 'string'],
            'permissions' => ['array'],
            'permissions.*' => ['string']
        ]);


        $data = [
            'name' => strtoupper($validated['name']),
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        User::where('id', $id)->update($data);

        $requestedPermissions = collect($request->permissions ?? [])
            ->map(fn($encId) => $this->aes->decrypt($encId))
            ->filter();

        $currentPermissions = AdminPermissions::where('users_id', $id)
            ->pluck('permissions_id');

        $toRemove = $currentPermissions->diff($requestedPermissions);

        if ($toRemove->isNotEmpty()) {
            AdminPermissions::where('users_id', $id)
                ->whereIn('permissions_id', $toRemove)
                ->delete();
        }

        $toAdd = $requestedPermissions->diff($currentPermissions);

        $insertData = $toAdd->map(function ($permissionId) use ($id) {
            return [
                'users_id' => $id,
                'permissions_id' => $permissionId,
                'created_at' => now(),
                'updated_at' => now()
            ];
        });

        if ($insertData->isNotEmpty()) {
            AdminPermissions::insert($insertData->toArray());
        }
    }
}
