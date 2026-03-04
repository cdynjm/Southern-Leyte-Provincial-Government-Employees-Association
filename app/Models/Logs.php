<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Logs extends Model
{
    use SoftDeletes;
    
    protected $table = 'logs';

    protected $fillable = [
        'users_id',
        'name',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}
