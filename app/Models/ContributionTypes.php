<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContributionTypes extends Model
{
    use SoftDeletes;

    protected $table = 'contribution_types';

    protected $fillable = [
        'description',
    ];

    public function contributions()
    {
        return $this->hasMany(Contribution::class, 'contribution_types_id');
    }
}
