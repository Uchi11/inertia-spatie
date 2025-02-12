import { Link, useForm } from '@inertiajs/react';
import { IconArrowBack, IconCheck, IconPencilCog, IconPlus, IconTrash } from '@tabler/icons-react';
import React from 'react';
import Swal from 'sweetalert2';

export default function Button({ type, url, className, children, ...props }) {

    // Menggunakan hook useForm dari Inertia.js untuk memanipulasi data form, khususnya method delete
    const { delete : destroy } = useForm();

    /**
     * Fungsi untuk menampilkan konfirmasi sebelum menghapus data.
     * Jika pengguna mengonfirmasi, data akan dihapus menggunakan method delete dari Inertia.
     */
    const handleDeleteData = async (url) => {
        Swal.fire({
            title: 'Are you sure you want to delete this?',   // Judul pop-up konfirmasi
            text: 'Data is unrecoverable!',                   // Peringatan bahwa data tidak dapat dikembalikan
            icon: 'warning',                                  // Icon peringatan
            showCancelButton: true,                           // Menampilkan tombol batal
            confirmButtonColor: '#3085d6',                    // Warna tombol konfirmasi
            cancelButtonColor: '#d33',                        // Warna tombol batal
            confirmButtonText: 'Yes, delete it!',            // Teks pada tombol konfirmasi
            cancelButtonText: 'Cancel'                        // Teks pada tombol batal
        }).then((result) => {
            if (result.isConfirmed) {                         // Jika pengguna menekan "Yes, delete it!"
                destroy(url);                                 // Memanggil fungsi delete dengan URL yang diberikan

                // Menampilkan notifikasi bahwa data berhasil dihapus
                Swal.fire({
                    title: 'Success!',
                    text: 'Data deleted successfully!',
                    icon: 'success',
                    showConfirmButton: false,                 // Tidak menampilkan tombol konfirmasi
                    timer: 1500                               // Menutup otomatis setelah 1.5 detik
                });
            }
        });
    };

    return (
        <>
            {/* Tombol untuk menambahkan data baru */}
            {type === 'add' &&
                <Link href={url} className='px-4 py-2 text-sm border rounded-lg bg-white text-gray-700 flex items-center gap-2 hover:bg-gray-100'>
                    <IconPlus size={18} strokeWidth={1.5}/> <span className='hidden lg:flex'>Create New Data</span>
                </Link>
            }

            {/* Tombol untuk membuka modal */}
            {type === 'modal' &&
                <button {...props} type='button' className={`${className} px-4 py-2 text-sm border rounded-lg flex items-center gap-2`}>
                    {children}
                </button>
            }

            {/* Tombol untuk submit form */}
            {type === 'submit' &&
                <button type='submit' className='px-4 py-2 text-sm rounded-lg border border-teal-100 bg-teal-50 text-teal-500 flex items-center gap-2 hover:bg-teal-100'>
                    <IconCheck size={16} strokeWidth={1.5}/> Save Data
                </button>
            }

            {/* Tombol untuk membatalkan dan kembali ke halaman sebelumnya */}
            {type === 'cancel' &&
                <Link href={url} className='px-4 py-2 text-sm rounded-lg border border-rose-100 bg-rose-50 text-rose-500 flex items-center gap-2 hover:bg-rose-100'>
                    <IconArrowBack size={16} strokeWidth={1.5}/> Go Back
                </Link>
            }

            {/* Tombol untuk mengedit data */}
            {type === 'edit' &&
                <Link href={url} className='px-4 py-2 rounded-lg bg-orange-50 text-orange-500 flex items-center gap-2 hover:bg-orange-100'>
                    <IconPencilCog size={16} strokeWidth={1.5}/>
                </Link>
            }

            {/* Tombol untuk menghapus data */}
            {type === 'delete' &&
                <button onClick={() => handleDeleteData(url)} className='px-4 py-2 rounded-lg bg-rose-50 text-rose-500 flex items-center gap-2 hover:bg-rose-100'>
                    <IconTrash size={18} strokeWidth={1.5}/>
                </button>
            }
        </>
    );
}
