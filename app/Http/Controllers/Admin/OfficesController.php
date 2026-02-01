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

class OfficesController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $offices = Offices::orderBy('officeName', 'asc')->get()->map(function ($office) {
            $office->encrypted_id = $this->aes->encrypt($office->id);
            return $office;
        });

        return Inertia::render('admin/offices', [
            'offices' => $offices
        ]);
    }

    public function store(Request $request)
    {
        Offices::create([
            'officeName' => strtoupper($request->officeName),
        ]);
    }

    public function update(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);
        Offices::where('id', $id)->update([
            'officeName' => strtoupper($request->officeName),
        ]);
    }

    public function destroy(Request $request)
    {
        $id = $this->aes->decrypt($request->encrypted_id);
        Offices::where('id', $id)->delete();
    }
    
}
