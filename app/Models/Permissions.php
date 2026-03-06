<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permissions extends Model
{
    use SoftDeletes;

    protected $table = 'permissions';

    protected $fillable = [
        'pages'
    ];

    public function adminpermissions()
    {
        return $this->hasMany(AdminPermissions::class, 'permissions_id');
    }
}
