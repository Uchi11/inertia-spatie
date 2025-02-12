// Mengimpor layout yang memerlukan autentikasi untuk menampilkan konten
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Mengimpor komponen Head dari Inertia untuk mengatur judul halaman di browser
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        // Menggunakan layout untuk halaman yang sudah terautentikasi
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            {/* Mengatur judul halaman di tab browser */}
            <Head title="Dashboard" />

            <div className="flex h-screen bg-sky-100">
                {/* Sidebar Navigasi */}
                <aside className="w-64 bg-blue-800 text-white flex flex-col">
                    <div className="p-4 text-center">
                        <h1 className="text-2xl font-bold">Perpustakaan Digital</h1>
                    </div>
                    <nav className="flex-1 px-4">
                        <ul className="space-y-2">
                            {/* Link Navigasi */}
                            <li>
                                <a href="#" className="flex items-center p-3 rounded-md hover:bg-green-700">
                                    <span>🏠</span>
                                    <span className="ml-3">Dashboard</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-3 rounded-md hover:bg-green-700">
                                    <span>📚</span>
                                    <span className="ml-3">Koleksi Buku</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-3 rounded-md hover:bg-green-700">
                                    <span>📄</span>
                                    <span className="ml-3">Pinjaman</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center p-3 rounded-md hover:bg-green-700">
                                    <span>⚙️</span>
                                    <span className="ml-3">Pengaturan</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    {/* Tombol Logout */}
                    <div className="p-4 text-sm text-center">
                        <button className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-500">
                            Keluar
                        </button>
                    </div>
                </aside>

                {/* Konten Utama */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Selamat Datang, Uching!</h2>
                        {/* Input Pencarian */}
                        <div>
                            <input
                                type="text"
                                placeholder="Cari buku atau pengguna..."
                                className="border rounded-md p-2 w-64"
                            />
                        </div>
                    </header>

                    {/* Konten Dashboard */}
                    <main className="flex-1 p-6 overflow-auto">
                        {/* Ringkasan Statistik */}
                        <h3 className="text-lg font-semibold mb-4">Ringkasan Perpustakaan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Total Buku */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h4 className="text-xl font-semibold">Total Buku</h4>
                                <p className="text-gray-600">3,670 Buku</p>
                            </div>

                            {/* Buku Dipinjam */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h4 className="text-xl font-semibold">Buku Dipinjam</h4>
                                <p className="text-gray-600">704 Buku</p>
                            </div>

                            {/* Total Anggota */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h4 className="text-xl font-semibold">Anggota</h4>
                                <p className="text-gray-600">1,240 Anggota</p>
                            </div>
                        </div>

                        {/* Koleksi Buku Terbaru */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Koleksi Buku Terbaru</h3>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="border-b py-2">Judul Buku</th>
                                            <th className="border-b py-2">Penulis</th>
                                            <th className="border-b py-2">Kategori</th>
                                            <th className="border-b py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Data Buku */}
                                        <tr>
                                            <td className="py-2">Pemrograman Laravel</td>
                                            <td className="py-2">Uchi</td>
                                            <td className="py-2">Teknologi</td>
                                            <td className="py-2 text-green-600">Tersedia</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">Belajar React</td>
                                            <td className="py-2">Agus</td>
                                            <td className="py-2">Teknologi</td>
                                            <td className="py-2 text-red-600">Dipinjam</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2">Sejarah Dunia</td>
                                            <td className="py-2">Asep</td>
                                            <td className="py-2">Sejarah</td>
                                            <td className="py-2 text-green-600">Tersedia</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Aktivitas Terbaru */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <ul className="divide-y divide-gray-200">
                                    <li className="py-2">
                                        <strong>Anggota A</strong> meminjam buku <strong>Pemrograman Laravel</strong>.
                                    </li>
                                    <li className="py-2">
                                        <strong>Anggota B</strong> mengembalikan buku <strong>Belajar React</strong>.
                                    </li>
                                    <li className="py-2">
                                        <strong>Anggota C</strong> mendaftar sebagai anggota baru.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
