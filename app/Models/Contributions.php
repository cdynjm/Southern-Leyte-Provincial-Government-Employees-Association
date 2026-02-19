<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contributions extends Model
{
    use SoftDeletes;

    protected $table = 'contributions';

    protected $fillable = [
        'users_id',
        'contribution_types_id',
        'month',
        'year',
        'amount',
        'processedBy'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function contributiontype()
    {
        return $this->belongsTo(ContributionTypes::class, 'contribution_types_id');
    }
}
