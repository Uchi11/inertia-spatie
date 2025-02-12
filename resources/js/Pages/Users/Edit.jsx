// Import React dan beberapa hooks yang dibutuhkan
import React, { useEffect, useState } from 'react';

// Import layout yang digunakan untuk tampilan setelah user login
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Import komponen Container untuk membungkus isi halaman agar lebih rapi
import Container from '@/Components/Container';

// Import komponen dari Inertia.js untuk manajemen form dan page props
import { Head, useForm, usePage } from '@inertiajs/react';

// Import komponen input, button, dan card untuk membangun form UI
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import Card from '@/Components/Card';

// Import SweetAlert2 untuk menampilkan notifikasi popup setelah data berhasil diperbarui
import Swal from 'sweetalert2';

// Import Select2 untuk dropdown multi-select pada pilihan roles
import Select2 from '@/Components/Select2';

export default function Edit({ auth }) {

    // Mendapatkan props user dan roles dari Inertia.js (biasanya dikirim dari controller di Laravel)
    const { user, roles } = usePage().props;

    // Inisialisasi state form dengan bantuan useForm dari Inertia.js
    // Nilai awal diambil dari data user yang akan diedit
    const { data, setData, post, errors } = useForm({
        name: user.name,  // Nama user
        email: user.email,  // Email user
        selectedRoles: user.roles.map(role => role.name),  // Role yang sudah dipilih user
        filterRole: user.roles.map(role => ({  // Format role untuk Select2 (label dan value)
            value: role.name,
            label: role.name
        })),
        _method: 'put'  // Method spoofing agar request menjadi PUT
    });

    // Memformat semua role yang tersedia untuk dropdown Select2
    const formattedRoles = roles.map(role => ({
        value: role.name,
        label: role.name
    }));

    // Fungsi untuk menangani perubahan pilihan role di Select2
    const handleSelectedRoles = (selected) => {
        const selectedValues = selected.map(option => option.value);  // Mengambil hanya nilai role yang dipilih
        setData('selectedRoles', selectedValues);  // Update state form dengan role yang dipilih
    };

    // Fungsi untuk submit form dan mengupdate data user
    const handleUpdateData = async (e) => {
        e.preventDefault();  // Mencegah reload halaman saat form disubmit

        // Mengirim data ke route users.update dengan method PUT
        post(route('users.update', user.id), {
            onSuccess: () => {  // Jika berhasil, tampilkan notifikasi sukses
                Swal.fire({
                    title: 'Success!',
                    text: 'Data updated successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}  // Mengirim data user yang login untuk ditampilkan di layout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit User</h2>}  // Judul halaman
        >
            {/* Title halaman, sebaiknya diganti jadi 'Edit User' */}
            <Head title={'Create Users'} />

            {/* Container untuk membungkus form agar lebih rapi */}
            <Container>
                {/* Card untuk membuat tampilan form lebih tertata, sebaiknya judulnya 'Edit User' */}
                <Card title={'Create new user'}>
                    <form onSubmit={handleUpdateData}>  {/* Form untuk mengedit user */}
                        
                        {/* Input field untuk nama */}
                        <div className='mb-4'>
                            <Input 
                                label={'Name'}  // Label input
                                type={'text'}  // Tipe input text
                                value={data.name}  // Value diambil dari state form
                                onChange={e => setData('name', e.target.value)}  // Update state saat input berubah
                                errors={errors.name}  // Menampilkan error jika ada
                                placeholder="Input name user.."  // Placeholder teks
                            />
                        </div>

                        {/* Input field untuk email */}
                        <div className='mb-4'>
                            <Input 
                                label={'Email'} 
                                type={'email'} 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                errors={errors.email} 
                                placeholder="Input email user.." 
                            />
                        </div>

                        {/* Select2 untuk memilih role */}
                        <div className='mb-4'>
                            <div className='flex items-center gap-2 text-sm text-gray-700'>
                                Roles  {/* Label untuk role */}
                            </div>
                            <Select2 
                                onChange={handleSelectedRoles}  // Fungsi yang dijalankan saat role dipilih
                                defaultOptions={data.filterRole}  // Role yang sudah dipilih sebelumnya
                                options={formattedRoles}  // Semua role yang tersedia
                                placeholder="Pilih Role..."  // Placeholder Select2
                            />
                        </div>

                        {/* Tombol untuk submit dan cancel */}
                        <div className='flex items-center gap-2'>
                            <Button type={'submit'} />  {/* Tombol untuk submit form */}
                            <Button type={'cancel'} url={route('users.index')} />  {/* Tombol untuk membatalkan dan kembali ke daftar user */}
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
