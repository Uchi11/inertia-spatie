// Mengimpor fungsi untuk membuat aplikasi Inertia dengan React
import { createInertiaApp } from '@inertiajs/react';

// Mengimpor fungsi untuk membuat server Inertia (digunakan untuk SSR)
import createServer from '@inertiajs/react/server';

// Mengimpor helper untuk memetakan komponen halaman dari file Vite
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Mengimpor ReactDOMServer untuk merender komponen React ke string (dibutuhkan untuk SSR)
import ReactDOMServer from 'react-dom/server';

// Mengimpor helper route dari Ziggy untuk menangani rute Laravel di sisi frontend
import { route } from '../../vendor/tightenco/ziggy';

// Mendefinisikan nama aplikasi dari environment variable, atau default ke 'Laravel' jika tidak ada
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Membuat server untuk aplikasi Inertia.js (SSR)
createServer((page) =>
    createInertiaApp({
        page, // Menyediakan data halaman dari server ke aplikasi

        // Mengatur metode render untuk SSR menggunakan ReactDOMServer
        render: ReactDOMServer.renderToString,

        // Mengatur judul halaman dengan format: [title] - [appName]
        title: (title) => `${title} - ${appName}`,

        // Fungsi untuk memetakan nama halaman ke file komponen React yang sesuai
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`, // Path relatif ke folder Pages
                import.meta.glob('./Pages/**/*.jsx'), // Mencari semua file .jsx di dalam folder Pages secara rekursif
            ),

        // Fungsi setup untuk menginisialisasi aplikasi dengan konfigurasi tambahan
        setup: ({ App, props }) => {
            // Menyediakan helper global `route` dari Ziggy untuk digunakan di komponen React
            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...page.props.ziggy, // Menyebarkan properti Ziggy dari props halaman
                    location: new URL(page.props.ziggy.location), // Menetapkan lokasi URL saat ini
                });

            // Merender komponen utama aplikasi dengan properti yang diberikan
            return <App {...props} />;
        },
    }),
);
