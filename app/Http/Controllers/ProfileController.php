<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Menampilkan form profil pengguna.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function edit(Request $request): Response
    {
        // Mengembalikan tampilan form edit profil dengan data:
        // - mustVerifyEmail: apakah pengguna harus memverifikasi email.
        // - status: status sesi untuk menampilkan notifikasi atau pesan.
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Memperbarui informasi profil pengguna.
     *
     * @param  \App\Http\Requests\ProfileUpdateRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // Mengisi data pengguna dengan data yang telah divalidasi dari request.
        $request->user()->fill($request->validated());

        // Jika email diubah, maka status verifikasi email di-reset.
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        // Menyimpan perubahan ke database.
        $request->user()->save();

        // Redirect kembali ke halaman edit profil.
        return Redirect::route('profile.edit');
    }

    /**
     * Menghapus akun pengguna.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Validasi password untuk memastikan bahwa pengguna benar-benar ingin menghapus akun.
        $request->validate([
            'password' => ['required', 'current_password'], // 'current_password' memastikan password benar
        ]);

        $user = $request->user();

        // Logout dari sesi saat ini.
        Auth::logout();

        // Menghapus akun pengguna dari database.
        $user->delete();

        // Menginvalidasi sesi dan meregenerasi token untuk keamanan.
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect ke halaman utama setelah akun dihapus.
        return Redirect::to('/');
    }
}