<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminPermissions extends Model
{
    use SoftDeletes;

    protected $table = 'admin_permissions';

    protected $fillable = [
        'users_id',
        'permissions_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    public function permission()
    {
        return $this->belongsTo(Permissions::class, 'permissions_id');
    }
}
