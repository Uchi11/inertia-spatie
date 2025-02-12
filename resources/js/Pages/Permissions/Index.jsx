// Import React dan komponen yang diperlukan untuk halaman index permissions
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Layout untuk halaman yang membutuhkan autentikasi
import Container from '@/Components/Container'; // Komponen pembungkus untuk menjaga konsistensi layout
import Table from '@/Components/Table'; // Komponen untuk membuat tabel
import Button from '@/Components/Button'; // Komponen tombol dengan berbagai tipe aksi (add, edit, delete)
import Pagination from '@/Components/Pagination'; // Komponen untuk navigasi halaman (pagination)
import { Head, usePage } from '@inertiajs/react'; // Head untuk mengatur title halaman, usePage untuk mengambil props halaman
import Search from '@/Components/Search'; // Komponen pencarian
import hasAnyPermission from '@/Utils/Permissions'; // Utility untuk mengecek hak akses pengguna berdasarkan permission

export default function Index({ auth }) {
    // Mengambil data permissions dan filters dari props halaman (dikirim dari backend Laravel)
    const { permissions, filters } = usePage().props;

    return (
        // Menggunakan layout dengan data user yang terautentikasi
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-blue-800 leading-tight">Permissions</h2>}
        >
            {/* Mengatur title halaman di browser */}
            <Head title="Permissions" />

            {/* Container untuk membungkus seluruh konten halaman */}
            <Container>
                {/* Bagian atas halaman: tombol tambah permission dan form pencarian */}
                <div className="mb-4 flex items-center justify-between gap-4">
                    {/* Cek apakah user memiliki permission untuk membuat data baru */}
                    {hasAnyPermission(['permissions create']) && (
                        <Button type="add" url={route('permissions.create')} />
                    )}

                    {/* Form pencarian dengan filter */}
                    <div className="w-full md:w-4/6">
                        <Search
                            url={route('permissions.index')}
                            placeholder="Search permissions data by name..."
                            filter={filters}
                        />
                    </div>
                </div>

                {/* Tabel yang menampilkan daftar permissions */}
                <Table.Card title="Permissions">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th> {/* Kolom nomor urut */}
                                <Table.Th>Permissions Name</Table.Th> {/* Kolom nama permission */}
                                <Table.Th>Action</Table.Th> {/* Kolom untuk aksi (edit/delete) */}
                            </tr>
                        </Table.Thead>

                        <Table.Tbody>
                            {/* Mapping data permissions untuk ditampilkan dalam tabel */}
                            {permissions.data.map((permission, i) => (
                                <tr key={i}>
                                    {/* Nomor urut yang disesuaikan dengan pagination */}
                                    <Table.Td>
                                        {++i + (permissions.current_page - 1) * permissions.per_page}
                                    </Table.Td>

                                    {/* Menampilkan nama permission */}
                                    <Table.Td>{permission.name}</Table.Td>

                                    {/* Kolom aksi untuk edit dan delete */}
                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {/* Tampilkan tombol edit jika user memiliki permission edit */}
                                            {hasAnyPermission(['permissions edit']) && (
                                                <Button
                                                    type="edit"
                                                    url={route('permissions.edit', permission.id)}
                                                />
                                            )}

                                            {/* Tampilkan tombol delete jika user memiliki permission delete */}
                                            {hasAnyPermission(['permissions delete']) && (
                                                <Button
                                                    type="delete"
                                                    url={route('permissions.destroy', permission.id)}
                                                />
                                            )}
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>

                {/* Pagination ditampilkan jika jumlah halaman lebih dari satu */}
                <div className="flex items-center justify-center">
                    {permissions.last_page !== 1 && <Pagination links={permissions.links} />}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}
