<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EmployeesController;
use App\Http\Controllers\Admin\ContributionsController;

use App\Http\Controllers\Employee\DashboardController as EmployeeDashboardController;

Route::get('/', function () {

    if (!auth()->check()) {
        return redirect()->route('login');
    }

    if (auth()->user()->role == "admin") {
        return redirect()->route('admin.dashboard');
    }

    if (auth()->user()->role == "employee") {
        return redirect()->route('employee.dashboard');
    }

})->name('home');


Route::middleware(['auth'])->group(function () {

    Route::prefix('admin')
        ->middleware('admin')
        ->group(function () {

            Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

            Route::get('/employees', [EmployeesController::class, 'index'])->name('admin.employees');
            Route::post('/employees', [EmployeesController::class, 'store'])->name('admin.employee.store');
            Route::put('/employees', [EmployeesController::class, 'update'])->name('admin.employee.update');
            Route::delete('/employees', [EmployeesController::class, 'destroy'])->name('admin.employee.destroy');

            Route::get('/contributions', [ContributionsController::class, 'index'])->name('admin.contributions');
            Route::get('/contributions/{encrypted_id}', [ContributionsController::class, 'viewContributions'])->name('admin.contributions.view');
            Route::post('/contributions/search', [ContributionsController::class, 'search'])->name('admin.contributions.search');
            Route::post('/contributions/clear-search', [ContributionsController::class, 'clearSearch'])->name('admin.contributions.clear-search');
            Route::post('/contributions/store', [ContributionsController::class, 'store'])->name('admin.contributions.store');
            
        });

    Route::prefix('employee')
        ->middleware('employee')
        ->group(function () {

            Route::get('/dashboard', [EmployeeDashboardController::class, 'index'])->name('employee.dashboard');

        });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
