<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller implements HasMiddleware
{
    /**
     * Mendefinisikan middleware untuk otorisasi berdasarkan permission.
     * 
     * Middleware ini menggunakan package Spatie Permission untuk 
     * mengatur hak akses pengguna terhadap fungsi-fungsi tertentu di controller ini.
     */
    public static function middleware()
    {
        return [
            // Hanya pengguna dengan izin 'permissions index' yang bisa mengakses fungsi index.
            new Middleware('permission:permissions index', only: ['index']),
            // Hanya pengguna dengan izin 'permissions create' yang bisa mengakses fungsi create dan store.
            new Middleware('permission:permissions create', only: ['create', 'store']),
            // Hanya pengguna dengan izin 'permissions edit' yang bisa mengakses fungsi edit dan update.
            new Middleware('permission:permissions edit', only: ['edit', 'update']),
            // Hanya pengguna dengan izin 'permissions delete' yang bisa mengakses fungsi destroy.
            new Middleware('permission:permissions delete', only: ['destroy']),
        ];
    }

    /**
     * Menampilkan daftar permission.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Mengambil data permission dari database dengan filter pencarian jika ada.
        $permissions = Permission::select('id', 'name')
            ->when($request->search, fn($query) => 
                $query->where('name', 'like', '%' . $request->search . '%'))
            ->latest()
            ->paginate(6)  // Pagination dengan 6 item per halaman
            ->withQueryString(); // Menyertakan query string pada pagination links

        // Mengembalikan tampilan dengan data permissions dan filter pencarian.
        return inertia('Permissions/Index', [
            'permissions' => $permissions,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Menampilkan form untuk membuat permission baru.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Mengembalikan tampilan form create.
        return inertia('Permissions/Create');
    }

    /**
     * Menyimpan permission baru ke dalam database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validasi input dari request.
        $request->validate([
            'name' => 'required|min:3|max:255|unique:permissions'
        ]);

        // Menyimpan data permission baru ke database.
        Permission::create(['name' => $request->name]);

        // Redirect ke halaman index permissions setelah berhasil menyimpan.
        return to_route('permissions.index');
    }

    /**
     * Menampilkan form untuk mengedit permission yang ada.
     *
     * @param  \Spatie\Permission\Models\Permission  $permission
     * @return \Inertia\Response
     */
    public function edit(Permission $permission)
    {
        // Mengembalikan tampilan form edit dengan data permission yang akan diedit.
        return inertia('Permissions/Edit', ['permission' => $permission]);
    }

    /**
     * Memperbarui data permission di database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Spatie\Permission\Models\Permission  $permission
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Permission $permission)
    {
        // Validasi input untuk update, mengecualikan permission yang sedang diupdate dari aturan unique.
        $request->validate([
            'name' => 'required|min:3|max:255|unique:permissions,name,' . $permission->id
        ]);

        // Memperbarui data permission di database.
        $permission->update(['name' => $request->name]);

        // Redirect ke halaman index setelah berhasil update.
        return to_route('permissions.index');
    }

    /**
     * Menghapus permission dari database.
     *
     * @param  \Spatie\Permission\Models\Permission  $permission
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Permission $permission)
    {
        // Menghapus data permission dari database.
        $permission->delete();

        // Kembali ke halaman sebelumnya setelah berhasil menghapus.
        return back();
    }
}