<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserTableSeeder extends Seeder
{
    /**
     * Menjalankan seeder untuk membuat user dan mengatur role serta permissions.
     */
    public function run(): void
    {
        // Membuat user baru dengan data default
        $user = User::create([
            'name'      => 'Syahrizaldev',             // Nama pengguna
            'email'     => 'izaldev@gmail.com',        // Email pengguna
            'password'  => bcrypt('password'),         // Password yang dienkripsi menggunakan bcrypt
        ]);

        // Mengambil semua permissions yang ada di tabel permissions
        $permissions = Permission::all();

        // Mengambil role dengan ID 1 (diasumsikan sebagai admin)
        $role = Role::find(1);

        // Menyinkronkan semua permissions ke role admin
        $role->syncPermissions($permissions);

        // Memberikan role admin kepada user yang baru dibuat
        $user->assignRole($role);
    }
}