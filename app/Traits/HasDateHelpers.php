<?php

namespace App\Traits;

use Carbon\Carbon;

trait HasDateHelpers
{
    public function todayDate()
    {
        return Carbon::parse('2026-10-24');
    }
}
