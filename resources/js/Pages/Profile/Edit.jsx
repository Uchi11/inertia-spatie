// Mengimpor layout yang digunakan untuk halaman yang hanya dapat diakses oleh pengguna yang sudah diautentikasi
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// Mengimpor komponen Head dari Inertia.js untuk mengatur judul halaman
import { Head } from '@inertiajs/react';
// Mengimpor komponen untuk menghapus akun pengguna
import DeleteUserForm from './Partials/DeleteUserForm';
// Mengimpor komponen untuk memperbarui password pengguna
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
// Mengimpor komponen untuk memperbarui informasi profil pengguna
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// Komponen utama untuk halaman Edit Profile
export default function Edit({ mustVerifyEmail, status }) {
    return (
        // Menggunakan layout AuthenticatedLayout untuk memastikan hanya pengguna yang login yang dapat mengakses halaman ini
        <AuthenticatedLayout
            header={
                // Header untuk halaman profil dengan styling untuk teks berukuran besar dan tebal
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            {/* Mengatur judul halaman di tab browser */}
            <Head title="Profile" />

            {/* Kontainer utama dengan padding di atas dan bawah */}
            <div className="py-12">
                {/* Membuat layout dengan lebar maksimum 7xl dan spacing antar elemen */}
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                    {/* Bagian untuk memperbarui informasi profil */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail} // Prop untuk memeriksa apakah email perlu diverifikasi
                            status={status} // Prop untuk status update (misalnya sukses atau gagal)
                            className="max-w-xl" // Memberikan batas maksimum lebar komponen
                        />
                    </div>

                    {/* Bagian untuk memperbarui password */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Bagian untuk menghapus akun pengguna */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
