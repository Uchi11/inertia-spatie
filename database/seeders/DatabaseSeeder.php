<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed basis data aplikasi.
     * 
     * Fungsi `run()` ini adalah titik masuk utama untuk menjalankan seeder lainnya.
     * Anda dapat memanggil seeder lain menggunakan `$this->call(NamaSeeder::class);`
     */
    public function run(): void
    {
        // Memanggil seeder untuk tabel roles
        $this->call(RolesTableSeeder::class);
        
        // Memanggil seeder untuk tabel permissions
        $this->call(PermissionsTableSeeder::class);
        
        // Memanggil seeder untuk tabel users
        $this->call(UserTableSeeder::class);
    }
}