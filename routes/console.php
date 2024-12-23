<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();

Schedule::command('app:scan-media')->hourly();
Schedule::command('app:generate-thumbnail')->everyThirtyMinutes();
Schedule::command('app:check-schedule')->everyMinute();
