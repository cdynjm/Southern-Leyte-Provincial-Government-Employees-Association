<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanInstallment extends Model
{
    use SoftDeletes;

    protected $table = 'loan_installment';

    protected $fillable = [
       'users_id',
       'loan_amortization_id',
       'due_dates_id',
       'date',
       'paymentDate',
       'installment',
       'interest',
       'principal',
       'outstandingBalance',
       'originalBalance',
       'lastComputedDate',
       'status',
       'processedBy'
       
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
    
    public function loanamortization()
    {
        return $this->belongsTo(LoanAmortization::class, 'loan_amortization_id');
    }

    public function duedates()
    {
        return $this->belongsTo(DueDates::class, 'due_dates_id');
    }
}
