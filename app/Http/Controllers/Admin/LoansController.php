<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Security\AESCipher;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Contributions;
use App\Models\FinancialAccount;
use App\Models\LoanTracker;

class LoansController extends Controller
{
    protected $aes;

    public function __construct(AESCipher $aes)
    {
        $this->aes = $aes;
    }

    public function index()
    {
        return Inertia::render('admin/loans/loans', [
            
        ]);
    }

    public function loanTracker()
    {
        $officers = User::where('specialAccount', '!=', 'No')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($officer) {
                $officer->encrypted_id = $this->aes->encrypt($officer->id);
                return $officer;
            });

        $trackers = LoanTracker::with('user')
        ->orderBy('tracker')
        ->get()
        ->map(function ($tracker) {
            if ($tracker->user) {
                $tracker->user->encrypted_id = $this->aes->encrypt($tracker->user->id);
            }
            return $tracker;
        });

        return Inertia::render('admin/loans/loan-tracker', [
            'officers' => $officers,
            'trackers' => $trackers,
        ]);
    }

    public function storeOrUpdate(Request $request)
    {
        DB::transaction(function () use ($request) {
        $existingTrackers = LoanTracker::all()->keyBy('users_id');

        $submittedUserIds = collect($request->trackers)
            ->map(fn($tracker) => $this->aes->decrypt($tracker['officer']))
            ->toArray();

        $existingTrackers->whereNotIn('users_id', $submittedUserIds)->each(function($tracker) {
            $tracker->delete();
        });

        foreach ($request->trackers as $index => $trackerData) {
            $userId = $this->aes->decrypt($trackerData['officer']);
            $description = $trackerData['description'] ?? null;

            LoanTracker::updateOrCreate(
                ['users_id' => $userId],
                [
                    'tracker' => $index + 1,
                    'description' => $description,
                ]
            );
        }
    });
    }
}
