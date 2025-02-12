// Import React dan berbagai komponen yang dibutuhkan
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Layout untuk halaman yang membutuhkan autentikasi
import Container from '@/Components/Container'; // Komponen pembungkus untuk konsistensi layout
import { Head, useForm, usePage } from '@inertiajs/react'; // Head untuk mengatur title halaman, useForm untuk form handling, dan usePage untuk mengakses props halaman
import Input from '@/Components/Input'; // Komponen input custom
import Button from '@/Components/Button'; // Komponen button custom
import Card from '@/Components/Card'; // Komponen card untuk membungkus konten form
import Swal from 'sweetalert2'; // Library untuk menampilkan notifikasi/alert

export default function Edit({ auth }) {
    // Mengambil data 'permission' yang dikirim dari server melalui props Inertia
    const { permission } = usePage().props;

    // Mengelola data form menggunakan useForm dari Inertia
    const { data, setData, post, errors } = useForm({
        name: permission.name, // Inisialisasi field 'name' dengan data permission yang sudah ada
        _method: 'put' // Menentukan method PUT untuk update data (karena HTML form hanya mendukung GET dan POST)
    });

    // Fungsi untuk menangani submit form update data permission
    const handleUpdateData = async (e) => {
        e.preventDefault(); // Mencegah reload halaman saat form disubmit

        // Mengirim data update ke route 'permissions.update' menggunakan metode POST dengan _method: 'put'
        post(route('permissions.update', permission.id), {
            onSuccess: () => {
                // Menampilkan notifikasi sukses menggunakan SweetAlert2 setelah data berhasil diperbarui
                Swal.fire({
                    title: 'Success!',
                    text: 'Data updated successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500 // Notifikasi akan otomatis tertutup setelah 1.5 detik
                });
            }
        });
    };

    return (
        // Menggunakan layout autentikasi dengan data pengguna yang sedang login
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Permission</h2>}
        >
            {/* Mengatur title halaman di browser */}
            <Head title="Edit Permissions" />

            {/* Container untuk membungkus form edit */}
            <Container>
                {/* Card untuk membungkus form dengan judul */}
                <Card title="Edit permission">
                    {/* Form untuk mengedit permission */}
                    <form onSubmit={handleUpdateData}>
                        <div className="mb-4">
                            {/* Komponen input dengan label dan handling error */}
                            <Input
                                label="Permission Name"
                                type="text"
                                value={data.name} // Menghubungkan input dengan state data.name
                                onChange={e => setData('name', e.target.value)} // Mengubah state saat input berubah
                                errors={errors.name} // Menampilkan error validasi jika ada
                                placeholder="Input permission name..."
                            />
                            {/* Menampilkan pesan error jika field 'name' tidak valid */}
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Tombol untuk menyimpan perubahan atau membatalkan */}
                        <div className="flex items-center gap-2">
                            {/* Tombol submit untuk menyimpan perubahan */}
                            <Button type="submit" label="Update" />
                            {/* Tombol cancel yang mengarahkan ke halaman index permissions */}
                            <Button type="cancel" label="Cancel" url={route('permissions.index')} />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
