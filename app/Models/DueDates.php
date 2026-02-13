<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DueDates extends Model
{
    use SoftDeletes;

    protected $table = 'due_dates';

    protected $fillable = [
        'loan_amortization_id',
        'date',
        'status'
    ];

    public function loaninstallment()
    {
        return $this->hasMany(LoanInstallment::class, 'due_dates_id');
    }

    public function loanamortization()
    {
        return $this->belongsTo(LoanAmortization::class, 'loan_amortization_id');
    }
}
