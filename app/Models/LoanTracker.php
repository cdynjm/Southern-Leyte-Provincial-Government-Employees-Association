<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LoanTracker extends Model
{
    use SoftDeletes;

    protected $table = 'loan_tracker';

    protected $fillable = [
        'users_id',
        'tracker',
        'description'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

}
