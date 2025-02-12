<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Jalankan migrasi.
     */
    public function up(): void
    {
        // Mengambil konfigurasi dari file config/permission.php
        $teams = config('permission.teams'); // Cek apakah fitur teams diaktifkan
        $tableNames = config('permission.table_names'); // Nama tabel dari konfigurasi
        $columnNames = config('permission.column_names'); // Nama kolom dari konfigurasi
        $pivotRole = $columnNames['role_pivot_key'] ?? 'role_id'; // Default role_id jika tidak ada konfigurasi
        $pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_id'; // Default permission_id

        // Validasi konfigurasi permission
        if (empty($tableNames)) {
            throw new \Exception('Error: config/permission.php not loaded. Run [php artisan config:clear] and try again.');
        }
        if ($teams && empty($columnNames['team_foreign_key'] ?? null)) {
            throw new \Exception('Error: team_foreign_key on config/permission.php not loaded. Run [php artisan config:clear] and try again.');
        }

        // Membuat tabel permissions
        Schema::create($tableNames['permissions'], function (Blueprint $table) {
            $table->bigIncrements('id'); // Primary key
            $table->string('name');      // Nama permission, misalnya "edit post"
            $table->string('guard_name'); // Guard seperti 'web' atau 'api'
            $table->timestamps(); // Kolom created_at dan updated_at

            $table->unique(['name', 'guard_name']); // Kombinasi nama dan guard harus unik
        });

        // Membuat tabel roles
        Schema::create($tableNames['roles'], function (Blueprint $table) use ($teams, $columnNames) {
            $table->bigIncrements('id'); // Primary key untuk role

            // Jika fitur teams diaktifkan, tambahkan kolom team_foreign_key
            if ($teams || config('permission.testing')) {
                $table->unsignedBigInteger($columnNames['team_foreign_key'])->nullable();
                $table->index($columnNames['team_foreign_key'], 'roles_team_foreign_key_index');
            }

            $table->string('name');       // Nama role seperti "admin", "editor"
            $table->string('guard_name'); // Guard seperti 'web' atau 'api'
            $table->timestamps();

            // Unik berdasarkan team_foreign_key jika teams aktif, atau hanya nama dan guard_name jika tidak
            if ($teams || config('permission.testing')) {
                $table->unique([$columnNames['team_foreign_key'], 'name', 'guard_name']);
            } else {
                $table->unique(['name', 'guard_name']);
            }
        });

        // Membuat tabel model_has_permissions (relasi antara model seperti User dengan permissions)
        Schema::create($tableNames['model_has_permissions'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotPermission, $teams) {
            $table->unsignedBigInteger($pivotPermission); // FK ke permissions

            $table->string('model_type'); // Menyimpan tipe model, contoh: App\Models\User
            $table->unsignedBigInteger($columnNames['model_morph_key']); // FK ke ID model
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_model_id_model_type_index');

            // Foreign key constraint ke tabel permissions
            $table->foreign($pivotPermission)
                ->references('id')
                ->on($tableNames['permissions'])
                ->onDelete('cascade');

            // Jika menggunakan fitur teams
            if ($teams) {
                $table->unsignedBigInteger($columnNames['team_foreign_key']);
                $table->index($columnNames['team_foreign_key'], 'model_has_permissions_team_foreign_key_index');

                // Primary key gabungan untuk mencegah duplikasi
                $table->primary([$columnNames['team_foreign_key'], $pivotPermission, $columnNames['model_morph_key'], 'model_type'], 
                    'model_has_permissions_permission_model_type_primary');
            } else {
                $table->primary([$pivotPermission, $columnNames['model_morph_key'], 'model_type'], 
                    'model_has_permissions_permission_model_type_primary');
            }
        });

        // Membuat tabel model_has_roles (relasi antara model seperti User dengan roles)
        Schema::create($tableNames['model_has_roles'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams) {
            $table->unsignedBigInteger($pivotRole); // FK ke roles

            $table->string('model_type'); // Menyimpan tipe model, contoh: App\Models\User
            $table->unsignedBigInteger($columnNames['model_morph_key']); // FK ke ID model
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_roles_model_id_model_type_index');

            // Foreign key constraint ke tabel roles
            $table->foreign($pivotRole)
                ->references('id')
                ->on($tableNames['roles'])
                ->onDelete('cascade');

            // Jika menggunakan fitur teams
            if ($teams) {
                $table->unsignedBigInteger($columnNames['team_foreign_key']);
                $table->index($columnNames['team_foreign_key'], 'model_has_roles_team_foreign_key_index');

                // Primary key gabungan
                $table->primary([$columnNames['team_foreign_key'], $pivotRole, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_roles_role_model_type_primary');
            } else {
                $table->primary([$pivotRole, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_roles_role_model_type_primary');
            }
        });

        // Membuat tabel role_has_permissions (relasi antara role dengan permissions)
        Schema::create($tableNames['role_has_permissions'], function (Blueprint $table) use ($tableNames, $pivotRole, $pivotPermission) {
            $table->unsignedBigInteger($pivotPermission); // FK ke permissions
            $table->unsignedBigInteger($pivotRole); // FK ke roles

            // Foreign key constraint
            $table->foreign($pivotPermission)
                ->references('id')
                ->on($tableNames['permissions'])
                ->onDelete('cascade');

            $table->foreign($pivotRole)
                ->references('id')
                ->on($tableNames['roles'])
                ->onDelete('cascade');

            // Primary key gabungan
            $table->primary([$pivotPermission, $pivotRole], 'role_has_permissions_permission_id_role_id_primary');
        });

        // Menghapus cache permission untuk menghindari konflik data lama
        app('cache')
            ->store(config('permission.cache.store') != 'default' ? config('permission.cache.store') : null)
            ->forget(config('permission.cache.key'));
    }

    /**
     * Membatalkan migrasi (rollback).
     */
    public function down(): void
    {
        $tableNames = config('permission.table_names');

        if (empty($tableNames)) {
            throw new \Exception('Error: config/permission.php not found and defaults could not be merged. Please publish the package configuration before proceeding, or drop the tables manually.');
        }

        // Menghapus semua tabel yang dibuat saat migrasi
        Schema::drop($tableNames['role_has_permissions']);
        Schema::drop($tableNames['model_has_roles']);
        Schema::drop($tableNames['model_has_permissions']);
        Schema::drop($tableNames['roles']);
        Schema::drop($tableNames['permissions']);
    }
};