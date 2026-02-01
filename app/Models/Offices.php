<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Offices extends Model
{
    use SoftDeletes;

    protected $table = 'offices';

    protected $fillable = [
        'officeName'
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'offices_id');
    }
}
