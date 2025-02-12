// Import React dan berbagai komponen yang digunakan di aplikasi ini
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Layout untuk halaman yang membutuhkan autentikasi
import Container from '@/Components/Container'; // Komponen pembungkus untuk konsistensi layout
import { Head, useForm } from '@inertiajs/react'; // Head untuk mengatur title halaman dan useForm untuk form handling
import Input from '@/Components/Input'; // Komponen input custom
import Button from '@/Components/Button'; // Komponen button custom
import Card from '@/Components/Card'; // Komponen card untuk membungkus konten form
import Swal from 'sweetalert2'; // Library untuk menampilkan alert notifikasi

export default function Create({ auth }) {
    // Menggunakan useForm dari Inertia untuk mengelola data form dan error validasi
    const { data, setData, post, errors } = useForm({
        name: '' // Inisialisasi form dengan field 'name' kosong
    });

    // State untuk mengelola status loading saat data sedang diproses
    const [loading, setLoading] = React.useState(false);

    // Fungsi untuk menangani submit form
    const handleStoreData = async (e) => {
        e.preventDefault(); // Mencegah reload halaman saat form disubmit
        setLoading(true); // Mengaktifkan state loading untuk memberi feedback ke user

        // Mengirim data form ke route 'permissions.store' menggunakan metode POST
        post(route('permissions.store'), {
            onSuccess: () => {
                // Jika berhasil, tampilkan notifikasi sukses menggunakan SweetAlert2
                Swal.fire({
                    title: 'Success!',
                    text: 'Data created successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500 // Notifikasi akan otomatis tertutup setelah 1.5 detik
                });
                setLoading(false); // Nonaktifkan loading setelah berhasil
            },
            onError: () => setLoading(false) // Nonaktifkan loading jika terjadi error
        });
    };

    return (
        // Layout halaman dengan autentikasi pengguna
        <AuthenticatedLayout
            user={auth.user} // Menyediakan data user yang sedang login
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Permission</h2>}
        >
            {/* Mengatur title halaman di browser */}
            <Head title="Create Permissions" />

            {/* Container untuk membungkus form */}
            <Container>
                {/* Card untuk membungkus form dengan judul */}
                <Card title="Create new permission">
                    {/* Form untuk membuat permission baru */}
                    <form onSubmit={handleStoreData}>
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

                        {/* Tombol untuk submit dan cancel */}
                        <div className="flex items-center gap-2">
                            {/* Tombol submit dengan indikator loading */}
                            <Button type="submit" label={loading ? 'Saving...' : 'Save'} disabled={loading} />
                            {/* Tombol cancel yang mengarahkan ke halaman index permissions */}
                            <Button type="cancel" label="Cancel" url={route('permissions.index')} />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
