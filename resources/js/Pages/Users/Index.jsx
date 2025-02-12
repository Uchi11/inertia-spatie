// Import React dan layout otentikasi untuk memastikan halaman hanya bisa diakses oleh user yang sudah login
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// Import komponen untuk membungkus layout dan menampilkan data dalam tabel
import Container from "@/Components/Container";
import Table from "@/Components/Table";
import Button from "@/Components/Button";
import Pagination from "@/Components/Pagination";

// Import fungsi dari Inertia.js untuk mendapatkan props dari server
import { Head, usePage } from "@inertiajs/react";

// Import komponen pencarian dan utilitas untuk memeriksa izin user
import Search from "@/Components/Search";
import hasAnyPermission from "@/Utils/Permissions";

// Komponen utama untuk halaman index user
export default function Index({ auth }) {
    // Mendapatkan data users dan filters dari props yang dikirim Inertia.js
    const { users, filters } = usePage().props;

    return (
        // Menggunakan layout otentikasi untuk halaman ini
        <AuthenticatedLayout
            user={auth.user}  // Mengirim data user yang sedang login untuk ditampilkan di layout
            header={
                <h2 className="font-semibold text-xl text-blue-800 leading-tight">
                    Users  {/* Judul halaman */}
                </h2>
            }
        >
            {/* Menentukan title halaman yang akan tampil di tab browser */}
            <Head title={"Users"} />
            
            {/* Container untuk membungkus konten utama halaman */}
            <Container>
                {/* Bagian atas halaman untuk tombol tambah user dan pencarian */}
                <div className="mb-4 flex items-center justify-between gap-4">
                    {/* Menampilkan tombol "Add User" jika user memiliki izin untuk membuat user baru */}
                    {hasAnyPermission(["users create"]) && (
                        <Button type={"add"} url={route("users.create")} />
                    )}
                    
                    {/* Komponen pencarian untuk memfilter data user berdasarkan nama */}
                    <div className="w-full md:w-4/6">
                        <Search
                            url={route("users.index")}  // Route untuk melakukan pencarian
                            placeholder={"Search users data by name..."}  // Placeholder teks pencarian
                            filter={filters}  // Filter yang diterapkan saat ini
                        />
                    </div>
                </div>

                {/* Card untuk membungkus tabel user */}
                <Table.Card title={"users"}>
                    <Table>
                        {/* Header tabel */}
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>  {/* Nomor urut */}
                                <Table.Th>User</Table.Th>  {/* Nama user */}
                                <Table.Th>Roles</Table.Th>  {/* Role yang dimiliki user */}
                                <Table.Th>Action</Table.Th>  {/* Aksi (edit, delete) */}
                            </tr>
                        </Table.Thead>

                        {/* Body tabel dengan data user */}
                        <Table.Tbody>
                            {users.data.map((user, i) => (
                                <tr key={i}>
                                    {/* Nomor urut dengan perhitungan pagination */}
                                    <Table.Td>
                                        {++i + (users.current_page - 1) * users.per_page}
                                    </Table.Td>

                                    {/* Menampilkan nama dan email user */}
                                    <Table.Td>
                                        {user.name}
                                        <div className="text-sm text-gray-400">
                                            {user.email}
                                        </div>
                                    </Table.Td>

                                    {/* Menampilkan roles yang dimiliki user */}
                                    <Table.Td>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {user.roles.map((role, i) => (
                                                <span
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-700"
                                                    key={i}
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </div>
                                    </Table.Td>

                                    {/* Aksi edit dan delete jika user memiliki izin */}
                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {/* Tombol edit hanya muncul jika user punya izin */}
                                            {hasAnyPermission(["users edit"]) && (
                                                <Button
                                                    type={"edit"}
                                                    url={route("users.edit", user.id)}  // Route untuk mengedit user
                                                />
                                            )}
                                            
                                            {/* Tombol delete hanya muncul jika user punya izin */}
                                            {hasAnyPermission(["users delete"]) && (
                                                <Button
                                                    type={"delete"}
                                                    url={route("users.destroy", user.id)}  // Route untuk menghapus user
                                                />
                                            )}
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>

                {/* Pagination hanya ditampilkan jika halaman lebih dari satu */}
                <div className="flex items-center justify-center">
                    {users.last_page !== 1 && (
                        <Pagination links={users.links} />  // Komponen pagination dari props users
                    )}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}
