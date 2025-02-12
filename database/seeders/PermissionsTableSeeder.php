<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Menjalankan seeder untuk mengisi tabel permissions.
     */
    public function run(): void
    {
        // Permissions untuk manajemen pengguna (users)
        Permission::create(['name' => 'users index', 'guard_name' => 'web']);  // Izin untuk melihat daftar pengguna
        Permission::create(['name' => 'users create', 'guard_name' => 'web']); // Izin untuk membuat pengguna baru
        Permission::create(['name' => 'users edit', 'guard_name' => 'web']);   // Izin untuk mengedit data pengguna
        Permission::create(['name' => 'users delete', 'guard_name' => 'web']); // Izin untuk menghapus pengguna

        // Permissions untuk manajemen peran (roles)
        Permission::create(['name' => 'roles index', 'guard_name' => 'web']);  // Izin untuk melihat daftar peran
        Permission::create(['name' => 'roles create', 'guard_name' => 'web']); // Izin untuk membuat peran baru
        Permission::create(['name' => 'roles edit', 'guard_name' => 'web']);   // Izin untuk mengedit peran
        Permission::create(['name' => 'roles delete', 'guard_name' => 'web']); // Izin untuk menghapus peran

        // Permissions untuk manajemen izin (permissions)
        Permission::create(['name' => 'permissions index', 'guard_name' => 'web']);  // Izin untuk melihat daftar izin
        Permission::create(['name' => 'permissions create', 'guard_name' => 'web']); // Izin untuk membuat izin baru
        Permission::create(['name' => 'permissions edit', 'guard_name' => 'web']);   // Izin untuk mengedit izin
        Permission::create(['name' => 'permissions delete', 'guard_name' => 'web']); // Izin untuk menghapus izin
    }
}