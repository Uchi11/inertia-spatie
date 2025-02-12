// Mengimpor file CSS utama aplikasi
import '../css/app.css';

// Mengimpor konfigurasi bootstrap untuk Laravel (biasanya mencakup konfigurasi default seperti CSRF token)
import './bootstrap';

// Mengimpor fungsi untuk membuat aplikasi Inertia dengan React
import { createInertiaApp } from '@inertiajs/react';

// Mengimpor helper untuk memetakan komponen halaman dari file Vite
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Mengimpor fungsi untuk merender React DOM (hydrateRoot untuk SSR, createRoot untuk client-side)
import { createRoot, hydrateRoot } from 'react-dom/client';

// Mendefinisikan nama aplikasi dari environment variable, atau default ke 'Laravel' jika tidak ada
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Membuat aplikasi Inertia
createInertiaApp({
    // Mengatur judul halaman dengan format: [title] - [appName]
    title: (title) => `${title} - ${appName}`,

    // Fungsi untuk memetakan nama halaman ke file komponen React yang sesuai
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`, // Path relatif ke folder Pages
            import.meta.glob('./Pages/**/*.jsx'), // Mencari semua file .jsx di dalam folder Pages secara rekursif
        ),

    // Fungsi setup untuk merender aplikasi ke DOM
    setup({ el, App, props }) {
        if (import.meta.env.SSR) { 
            // Jika menggunakan Server-Side Rendering (SSR), gunakan hydrateRoot
            hydrateRoot(el, <App {...props} />);
            return;
        }

        // Jika client-side rendering, gunakan createRoot
        createRoot(el).render(<App {...props} />);
    },

    // Konfigurasi progress bar Inertia, dengan warna abu-abu gelap (#4B5563)
    progress: {
        color: '#4B5563',
    },
});
