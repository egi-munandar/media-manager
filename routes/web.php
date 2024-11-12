<?php

use App\Http\Controllers\MediaController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect(route('login'));
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->prefix('media')->controller(MediaController::class)->group(function () {
    Route::get('/', 'index')->name('media.index');
    Route::post('/', 'store')->name('media.store');
    Route::put('/{media}/update', 'update')->name('media.update');
    Route::get('/create', 'create')->name('media.create');
    Route::get('/get-video/{media}', 'get_video')->name('media.get-video');
    Route::put('/scan-proxy/{media}', 'scan_proxy')->name('media.scan-proxy');
    Route::delete('/{media}/delete', 'delete')->name('media.delete');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
