<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Models\Date;

trait HasDateHelpers
{
    public function todayDate()
    {
        $date = Date::first();
        return Carbon::parse($date->date);
    }
}
