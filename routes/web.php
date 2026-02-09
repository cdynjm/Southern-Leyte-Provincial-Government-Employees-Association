<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EmployeesController;
use App\Http\Controllers\Admin\OfficesController;
use App\Http\Controllers\Admin\ContributionsController;
use App\Http\Controllers\Admin\FinancialAccountController;
use App\Http\Controllers\Admin\LoansController;

use App\Http\Controllers\Employee\DashboardController as EmployeeDashboardController;
use App\Http\Controllers\Employee\EncodeEmployeeLoanController;

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
            Route::post('/employees/store', [EmployeesController::class, 'store'])->name('admin.employee.store');
            Route::put('/employees/update', [EmployeesController::class, 'update'])->name('admin.employee.update');
            Route::delete('/employees/destroy', [EmployeesController::class, 'destroy'])->name('admin.employee.destroy');
            Route::post('/employees/search', [EmployeesController::class, 'search'])->name('admin.employees.search');
            Route::post('/employees/clear-search', [EmployeesController::class, 'clearSearch'])->name('admin.employees.clear-search');

            Route::get('/offices', [OfficesController::class, 'index'])->name('admin.offices');
            Route::post('/offices/store', [OfficesController::class, 'store'])->name('admin.office.store');
            Route::put('/offices/update', [OfficesController::class, 'update'])->name('admin.office.update');
            Route::delete('/offices/destroy', [OfficesController::class, 'destroy'])->name('admin.office.destroy');

            Route::get('/contributions', [ContributionsController::class, 'employeeContributions'])->name('admin.contributions');
            Route::get('/contributions/{encrypted_id}', [ContributionsController::class, 'viewContributions'])->name('admin.contributions.view');
            Route::post('/contributions/search', [ContributionsController::class, 'search'])->name('admin.contributions.search');
            Route::post('/contributions/clear-search', [ContributionsController::class, 'clearSearch'])->name('admin.contributions.clear-search');
            Route::post('/contributions/store', [ContributionsController::class, 'store'])->name('admin.contribution.store');
            Route::delete('/contributions/destroy', [ContributionsController::class, 'destroy'])->name('admin.contribution.destroy');
            
            Route::get('/contribution-types', [ContributionsController::class, 'contributionTypes'])->name('admin.contribution-types');
            Route::post('/contribution-types/store', [ContributionsController::class, 'storeContributionType'])->name('admin.contribution-type.store');
            Route::put('/contribution-types/update', [ContributionsController::class, 'updateContributionType'])->name('admin.contribution-type.update');
            Route::delete('/contribution-types/destroy', [ContributionsController::class, 'destroyContributionType'])->name('admin.contribution-type.destroy');
        
            Route::get('/financial-account', [FinancialAccountController::class, 'index'])->name('admin.financial-account');
            Route::post('/financial-account/store', [FinancialAccountController::class, 'store'])->name('admin.financial-account.store');
            Route::put('/financial-account/update', [FinancialAccountController::class, 'update'])->name('admin.financial-account.update');
            Route::delete('/financial-account/destroy', [FinancialAccountController::class, 'destroy'])->name('admin.financial-account.destroy');
       
            Route::get('/loans', [LoansController::class, 'index'])->name('admin.loans');
            Route::get('/loan-tracker', [LoansController::class, 'loanTracker'])->name('admin.loan-tracker');
            Route::post('/loan-tracker/store-or-update', [LoansController::class, 'storeOrUpdate'])->name('admin.loan-tracker.store-or-update');
            
        });

    Route::prefix('employee')
        ->middleware('employee')
        ->group(function () {

            Route::get('/dashboard', [EmployeeDashboardController::class, 'index'])->name('employee.dashboard');
            Route::post('/employees/search', [EmployeeDashboardController::class, 'search'])->name('employee.employees.search');
            Route::post('/employees/clear-search', [EmployeeDashboardController::class, 'clearSearch'])->name('employee.employees.clear-search');

            Route::get('/encode-employee-loan/{encrypted_id}', [EncodeEmployeeLoanController::class, 'index'])->name('employee.encode-employee-loan');

        });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
