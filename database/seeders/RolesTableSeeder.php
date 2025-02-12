<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolesTableSeeder extends Seeder
{
    /**
     * Menjalankan seeder untuk mengisi tabel roles.
     */
    public function run(): void
    {
        // Membuat peran (roles) baru di database
        Role::create(['name' => 'admin']); // Peran untuk administrator dengan akses penuh
        Role::create(['name' => 'user']);  // Peran untuk pengguna biasa dengan akses terbatas
    }
}