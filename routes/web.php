<?php

// Import semua controller yang digunakan dalam route
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia; // Inertia digunakan untuk membuat SPA (Single Page Application) dengan React/Vue

// Route untuk halaman utama (landing page)
Route::get('/', function () {
    return Inertia::render('Welcome', [  // Menampilkan komponen 'Welcome' menggunakan Inertia
        'canLogin' => Route::has('login'),       // Mengecek apakah route login tersedia
        'canRegister' => Route::has('register'), // Mengecek apakah route register tersedia
        'laravelVersion' => Application::VERSION, // Mengirimkan versi Laravel ke frontend
        'phpVersion' => PHP_VERSION,              // Mengirimkan versi PHP ke frontend
    ]);
});

// Route untuk dashboard, hanya bisa diakses oleh user yang sudah login dan emailnya terverifikasi
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard'); // Menampilkan komponen 'Dashboard' menggunakan Inertia
})->middleware(['auth', 'verified'])     // Middleware 'auth' memastikan user login, 'verified' memastikan email sudah diverifikasi
  ->name('dashboard');                   // Memberikan nama 'dashboard' untuk route ini

// Grup route yang hanya bisa diakses oleh user yang sudah login
Route::middleware('auth')->group(function () {
    // Route resource untuk manajemen permissions (CRUD), menggunakan PermissionController
    Route::resource('/permissions', PermissionController::class);

    // Route resource untuk manajemen roles (CRUD), kecuali fungsi 'show' untuk melihat detail role
    Route::resource('roles', RoleController::class)->except('show');

    // Route resource untuk manajemen users (CRUD), menggunakan UserController
    Route::resource('/users', UserController::class);

    // Route untuk mengedit profil user yang sedang login
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    // Route untuk mengupdate data profil user yang sedang login (menggunakan metode PATCH)
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Route untuk menghapus akun user yang sedang login
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Memasukkan route tambahan untuk otentikasi (login, register, lupa password, dll)
require __DIR__ . '/auth.php';