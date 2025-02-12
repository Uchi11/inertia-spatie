<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller implements HasMiddleware
{
    /**
     * Mendefinisikan middleware untuk otorisasi berdasarkan permission.
     * 
     * Middleware ini memastikan bahwa hanya pengguna dengan izin tertentu 
     * yang dapat mengakses metode-metode di controller ini.
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:roles index', only: ['index']),
            new Middleware('permission:roles create', only: ['create', 'store']),
            new Middleware('permission:roles edit', only: ['edit', 'update']),
            new Middleware('permission:roles delete', only: ['destroy']),
        ];
    }

    /**
     * Menampilkan daftar role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Mengambil data roles dengan relasi permissions
        $roles = Role::select('id', 'name')
            ->with('permissions:id,name')  // Memuat data permissions terkait untuk setiap role
            ->when($request->search, fn($query) => 
                $query->where('name', 'like', '%' . $request->search . '%'))  // Filter pencarian berdasarkan nama role
            ->latest()  // Mengurutkan dari yang terbaru
            ->paginate(6);  // Pagination dengan 6 item per halaman

        // Mengembalikan tampilan dengan data roles dan filter pencarian
        return inertia('Roles/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Menampilkan form untuk membuat role baru.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Mengambil semua permissions dan mengelompokkan berdasarkan kata pertama dari nama permission
        $data = Permission::orderBy('name')->pluck('name', 'id');  // Mengambil data permission (id sebagai key, name sebagai value)
        $collection = collect($data);

        $permissions = $collection->groupBy(function ($item) {
            $words = explode(' ', $item);  // Memecah nama permission menjadi array kata
            return $words[0];  // Mengelompokkan berdasarkan kata pertama
        });

        // Mengembalikan tampilan form create dengan data permissions yang sudah dikelompokkan
        return inertia('Roles/Create', ['permissions' => $permissions]);
    }

    /**
     * Menyimpan role baru ke dalam database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validasi input request
        $request->validate([
            'name' => 'required|min:3|max:255|unique:roles',  // Nama role harus unik
            'selectedPermissions' => 'required|array|min:1',  // Harus memilih minimal satu permission
        ]);

        // Membuat role baru
        $role = Role::create(['name' => $request->name]);

        // Memberikan permissions ke role yang baru dibuat
        $role->givePermissionTo($request->selectedPermissions);

        // Redirect ke halaman index roles setelah berhasil menyimpan
        return to_route('roles.index');
    }

    /**
     * Menampilkan form untuk mengedit role.
     *
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Inertia\Response
     */
    public function edit(Role $role)
    {
        // Mengambil semua permissions dan mengelompokkan berdasarkan kata pertama
        $data = Permission::orderBy('name')->pluck('name', 'id');
        $collection = collect($data);
        $permissions = $collection->groupBy(function ($item) {
            $words = explode(' ', $item);
            return $words[0];
        });

        // Memuat relasi permissions untuk role yang sedang diedit
        $role->load('permissions');

        // Mengembalikan tampilan form edit dengan data role dan permissions
        return inertia('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions
        ]);
    }

    /**
     * Memperbarui data role di database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Role $role)
    {
        // Validasi input request untuk update
        $request->validate([
            'name' => 'required|min:3|max:255|unique:roles,name,' . $role->id,  // Memastikan nama unik kecuali untuk role yang sedang diedit
            'selectedPermissions' => 'required|array|min:1',  // Harus memilih minimal satu permission
        ]);

        // Memperbarui data role
        $role->update(['name' => $request->name]);

        // Menyinkronkan permissions untuk role ini (menghapus yang lama dan menambahkan yang baru)
        $role->syncPermissions($request->selectedPermissions);

        // Redirect ke halaman index setelah berhasil update
        return to_route('roles.index');
    }

    /**
     * Menghapus role dari database.
     *
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Role $role)
    {
        // Menghapus role dari database
        $role->delete();

        // Kembali ke halaman sebelumnya setelah berhasil menghapus
        return back();
    }
}