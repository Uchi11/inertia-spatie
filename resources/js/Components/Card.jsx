import React from 'react';

/**
 * Komponen Card
 * 
 * Komponen ini digunakan untuk membungkus konten dengan tampilan seperti kartu.
 * Terdiri dari header (judul) dan body (konten utama), dengan opsi tambahan untuk 
 * mengkustomisasi tampilan menggunakan prop `className`.
 * 
 * Props:
 * - title: Judul yang akan ditampilkan di bagian atas kartu.
 * - children: Konten yang akan ditempatkan di dalam body kartu.
 * - className: Kelas tambahan untuk mengkustomisasi gaya pada bagian header kartu.
 */
export default function Card({ title, children, className }) {
    return (
        <>
            {/* Header Card: Menampilkan judul dengan background putih dan border */}
            <div className={`p-4 rounded-t-lg border ${className} bg-white`}>
                <div className='flex items-center gap-2 font-semibold text-sm text-gray-700 capitalize'>
                    {title}
                </div>
            </div>

            {/* Body Card: Tempat untuk menampilkan konten utama */}
            <div className='bg-white p-4 border border-t-0 border-b rounded-b-lg'>
                {children}
            </div>
        </>
    );
}
