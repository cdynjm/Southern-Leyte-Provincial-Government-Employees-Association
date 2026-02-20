<?php

namespace App\Traits;

use Carbon\Carbon;

trait HasDateHelpers
{
    public function todayDate()
    {
        return Carbon::today();
    }
}
