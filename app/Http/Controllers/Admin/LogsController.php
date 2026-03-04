<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\Logs;
use App\Traits\HasDateHelpers;

class LogsController extends Controller
{
    protected $aes;
    use HasDateHelpers;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        $year = session('year-logs', now()->year);

         $logs = Logs::when(filled($year), function ($query) use ($year) {
            $query->whereYear('created_at', $year);
        })->orderBy('created_at', 'desc')->paginate(50)->through(function ($log) {
            $log->encrypted_id = $this->aes->encrypt($log->id);
            return $log;
        });

        return Inertia::render('admin/logs', [
            'logs' => $logs,
            'year' => $year,
        ]);
    }

    public function search(Request $request)
    {
        Session::put('year-logs', $request->year);
        return redirect()->route('admin.logs');
    }

    public function clearSearch()
    {
        Session::put('year-logs', now()->year);
        return redirect()->route('admin.logs');
    }
}
