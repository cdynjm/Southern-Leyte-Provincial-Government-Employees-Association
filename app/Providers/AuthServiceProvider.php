<?php 

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Borrower;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        
    ];

    public function boot(): void
    {
        Gate::define('view-loan-transaction', fn($user, $borrower) => $user->canViewLoan($borrower));
    }
}
