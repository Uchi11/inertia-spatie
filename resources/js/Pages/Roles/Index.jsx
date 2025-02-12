// Mengimpor React dan komponen yang dibutuhkan
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Layout untuk halaman dengan autentikasi
import Container from "@/Components/Container"; // Komponen pembungkus utama
import Table from "@/Components/Table"; // Komponen untuk membuat tabel
import Button from "@/Components/Button"; // Komponen tombol (add, edit, delete)
import Pagination from "@/Components/Pagination"; // Komponen untuk navigasi halaman
import { Head, usePage } from "@inertiajs/react"; // Inertia.js hooks
import Search from "@/Components/Search"; // Komponen pencarian
import hasAnyPermission from "@/Utils/Permissions"; // Utility untuk mengecek izin akses

// Komponen utama untuk menampilkan daftar roles
export default function Index({ auth }) {
    // Mengambil data roles dan filter dari props yang dikirim oleh Inertia
    const { roles, filters } = usePage().props;

    return (
        // Menggunakan layout yang sudah diautentikasi
        <AuthenticatedLayout
            user={auth.user} // Data user yang sedang login
            header={
                <h2 className="font-semibold text-xl text-blue-800 leading-tight">
                    Roles
                </h2>
            }
        >
            {/* Menentukan judul halaman di tab browser */}
            <Head title={"Roles"} />

            <Container>
                {/* Bagian atas halaman: tombol tambah dan search bar */}
                <div className="mb-4 flex items-center justify-between gap-4">
                    {/* Menampilkan tombol 'Add' hanya jika user memiliki izin 'roles create' */}
                    {hasAnyPermission(["roles create"]) && (
                        <Button type={"add"} url={route("roles.create")} />
                    )}
                    
                    {/* Search bar untuk mencari roles berdasarkan nama */}
                    <div className="w-full md:w-4/6">
                        <Search
                            url={route("roles.index")}
                            placeholder={"Search roles data by name..."}
                            filter={filters}
                        />
                    </div>
                </div>

                {/* Tabel daftar roles */}
                <Table.Card title={"Roles"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>Role Name</Table.Th>
                                <Table.Th>Permissions</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {/* Menampilkan setiap role dalam bentuk baris tabel */}
                            {roles.data.map((role, i) => (
                                <tr key={i}>
                                    {/* Nomor urut dengan perhitungan berdasarkan halaman */}
                                    <Table.Td>
                                        {++i + (roles.current_page - 1) * roles.per_page}
                                    </Table.Td>

                                    {/* Nama role */}
                                    <Table.Td>{role.name}</Table.Td>

                                    {/* Daftar permissions untuk role tersebut */}
                                    <Table.Td>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {/* Jika role adalah 'super-admin', tampilkan semua permissions */}
                                            {role.name === "super-admin" ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-700">
                                                    all-permissions
                                                </span>
                                            ) : (
                                                role.permissions.map((permission, i) => (
                                                    <span
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sky-100 text-sky-700"
                                                        key={i}
                                                    >
                                                        {permission.name}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </Table.Td>

                                    {/* Aksi Edit dan Delete, hanya ditampilkan jika user punya izin */}
                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            {hasAnyPermission(["roles edit"]) && (
                                                <Button
                                                    type={"edit"}
                                                    url={route("roles.edit", role.id)}
                                                />
                                            )}
                                            {hasAnyPermission(["roles delete"]) && (
                                                <Button
                                                    type={"delete"}
                                                    url={route("roles.destroy", role.id)}
                                                />
                                            )}
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>

                {/* Navigasi halaman jika data lebih dari satu halaman */}
                <div className="flex items-center justify-center">
                    {roles.last_page !== 1 && (
                        <Pagination links={roles.links} />
                    )}
                </div>
            </Container>
        </AuthenticatedLayout>
    );
}
