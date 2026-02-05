<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FinancialAccount extends Model
{
    use SoftDeletes;

    protected $table = 'financial_account';

    protected $fillable = [
        'name',
        'balance',
    ];

    public function contributiontypes()
    {
        return $this->hasMany(ContributionTypes::class, 'financial_account_id');
    }
}