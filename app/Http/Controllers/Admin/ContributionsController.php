<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Session;

use App\Models\User;
use App\Models\Contributions;

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

    public function store(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);

        Contributions::create([
            'users_id' => $id,
            'year' => $request->year,
            'month' => $request->month,
            'amount' => $request->amount,
        ]);

        User::where('id', $id)->increment('totalContribution', $request->amount);
    }

    public function viewContributions(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);

       $employee = User::findOrFail($id);

        $contributions = $employee->contributions()
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->paginate(20)->through(function ($contribution) {
                $contribution->encrypted_id = $this->aes->encrypt($contribution->id);
                return $contribution;
        })->withQueryString();

        return Inertia::render('admin/view-contributions', [
            'employee' => $employee,
            'contributions' => $contributions,
            'encrypted_id' => $request->encrypted_id,
        ]);
    }

    public function destroy(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);

        $contribution = Contributions::findOrFail($id);

        User::where('id', $contribution->users_id)->decrement('totalContribution', $contribution->amount);

        $contribution->delete();
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
