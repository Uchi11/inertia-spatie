<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class UserController extends Controller implements HasMiddleware
{
    /**
     * Middleware untuk memastikan pengguna memiliki permission yang sesuai 
     * sebelum mengakses metode tertentu.
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:users index', only: ['index']),   // Hanya pengguna dengan permission 'users index' yang bisa mengakses index
            new Middleware('permission:users create', only: ['create', 'store']), // Untuk create dan store
            new Middleware('permission:users edit', only: ['edit', 'update']),    // Untuk edit dan update
            new Middleware('permission:users delete', only: ['destroy']),         // Untuk delete
        ];
    }

    /**
     * Menampilkan daftar user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Mengambil semua user beserta role mereka
        $users = User::with('roles')
            ->when($request->search, fn($query) => 
                $query->where('name', 'like', '%' . $request->search . '%')) // Filter pencarian berdasarkan nama
            ->latest()  // Mengurutkan berdasarkan data terbaru
            ->paginate(6);  // Membatasi hasil per halaman

        // Mengembalikan data user dan filter pencarian ke tampilan Inertia
        return inertia('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Menampilkan form untuk membuat user baru.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Mengambil semua role dari database
        $roles = Role::latest()->get();

        // Mengembalikan tampilan form create dengan data roles
        return inertia('Users/Create', ['roles' => $roles]);
    }

    /**
     * Menyimpan user baru ke dalam database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Validasi input request
        $request->validate([
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|unique:users',  // Email harus unik
            'password' => 'required|confirmed|min:4',  // Password harus dikonfirmasi dan minimal 4 karakter
            'selectedRoles' => 'required|array|min:1', // Minimal satu role harus dipilih
        ]);

        // Membuat user baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password), // Mengenkripsi password
        ]);

        // Menambahkan role ke user
        $user->assignRole($request->selectedRoles);

        // Redirect ke halaman index user setelah berhasil menyimpan
        return to_route('users.index');
    }

    /**
     * Menampilkan form untuk mengedit user.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function edit(User $user)
    {
        // Mengambil semua roles kecuali super-admin
        $roles = Role::where('name', '!=', 'super-admin')->get();

        // Memuat data role yang dimiliki user
        $user->load('roles');

        // Mengembalikan tampilan form edit dengan data user dan roles
        return inertia('Users/Edit', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    /**
     * Memperbarui data user di database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, User $user)
    {
        // Validasi input request
        $request->validate([
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,  // Email harus unik kecuali untuk user ini
            'selectedRoles' => 'required|array|min:1',  // Minimal satu role harus dipilih
        ]);

        // Memperbarui data user
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Menyinkronkan role user (menghapus role lama dan menambahkan yang baru)
        $user->syncRoles($request->selectedRoles);

        // Redirect ke halaman index user setelah berhasil update
        return to_route('users.index');
    }

    /**
     * Menghapus user dari database.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user)
    {
        // Menghapus data user
        $user->delete();

        // Kembali ke halaman sebelumnya setelah berhasil menghapus
        return back();
    }
}