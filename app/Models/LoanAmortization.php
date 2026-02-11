<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanAmortization extends Model
{
    use SoftDeletes;
    
    protected $table = 'loan_amortization';

    protected $fillable = [
        'users_id',
        'tracker',
        'borrowed',
        'processingFee',
        'netProceeds',
        'periodInMonths',
        'rateInMonth',
        'monthlyInstallment',
        'date',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function loaninstallment()
    {
        return $this->hasMany(LoanInstallment::class, 'loan_amortization_id');
    }
}
