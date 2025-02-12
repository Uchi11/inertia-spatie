// Mengimpor React dan komponen yang diperlukan
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Layout untuk halaman dengan autentikasi
import Container from "@/Components/Container"; // Komponen pembungkus konten
import { Head, useForm, usePage } from "@inertiajs/react"; // Inertia.js hooks untuk mengelola data dan halaman
import Input from "@/Components/Input"; // Komponen input untuk form
import Button from "@/Components/Button"; // Komponen tombol
import Card from "@/Components/Card"; // Komponen kartu untuk membungkus form
import Checkbox from "@/Components/Checkbox"; // Komponen checkbox untuk permissions
import Swal from "sweetalert2"; // Library untuk alert notifikasi

// Komponen utama untuk mengedit role
export default function Edit({ auth }) {
    // Mengambil permissions dan data role dari props halaman Inertia
    const { permissions, role } = usePage().props;

    // Mengelola state form menggunakan useForm dari Inertia
    const { data, setData, post, errors } = useForm({
        name: role.name, // Nama role diisi dengan data dari role yang sedang diedit
        selectedPermissions: role.permissions.map( // Mengisi selectedPermissions dengan permission yang sudah dimiliki role
            (permission) => permission.name
        ),
        _method: "put", // Menentukan metode HTTP PUT untuk update data
    });

    // Fungsi untuk menangani pemilihan/deseleksi permissions
    const handleSelectedPermissions = (e) => {
        let items = data.selectedPermissions;

        // Jika permission sudah dipilih, hapus dari array; jika belum, tambahkan
        if (items.includes(e.target.value)) 
            items.splice(items.indexOf(e.target.value), 1); 
        else 
            items.push(e.target.value);
        
        setData("selectedPermissions", items); // Perbarui state form
    };

    // Fungsi untuk mengirim data yang sudah diedit ke server
    const handleUpdatedata = async (e) => {
        e.preventDefault(); // Mencegah reload halaman saat submit form

        post(route("roles.update", role.id), { // Mengirim data ke route roles.update dengan ID role
            onSuccess: () => {
                // Menampilkan alert sukses jika data berhasil diperbarui
                Swal.fire({
                    title: "Success!",
                    text: "Data updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    return (
        // Menggunakan layout untuk halaman yang memerlukan autentikasi
        <AuthenticatedLayout
            user={auth.user} // Mengirim data user yang sedang login
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Role
                </h2>
            }
        >
            {/* Menentukan judul halaman di tab browser */}
            <Head title={"Edit Roles"} />

            {/* Kontainer utama halaman */}
            <Container>
                {/* Kartu berisi form untuk mengedit role */}
                <Card title={"Edit role"}>
                    <form onSubmit={handleUpdatedata}>
                        {/* Input untuk nama role */}
                        <div className="mb-4">
                            <Input
                                label={"Role Name"}
                                type={"text"}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                errors={errors.name} // Menampilkan error jika ada
                                placeholder="Input role name.."
                            />
                        </div>

                        {/* Section untuk memilih permissions */}
                        <div className="mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Loop untuk menampilkan setiap grup permissions */}
                                {Object.entries(permissions).map(
                                    ([group, permissionItems], i) => (
                                        <div
                                            key={i}
                                            className="p-4 bg-white rounded-lg shadow-md"
                                        >
                                            {/* Judul grup permission */}
                                            <h3 className="font-bold text-lg mb-2">
                                                {group}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {/* Checkbox untuk setiap permission */}
                                                {permissionItems.map(
                                                    (permission) => (
                                                        <Checkbox
                                                            label={permission}
                                                            value={permission}
                                                            onChange={
                                                                handleSelectedPermissions
                                                            }
                                                            defaultChecked={data.selectedPermissions.includes(
                                                                permission
                                                            )} // Centang jika permission sudah dimiliki
                                                            key={permission}
                                                        />
                                                    )
                                                )}
                                            </div>
                                            {/* Menampilkan error jika ada */}
                                            {errors?.selectedPermissions && (
                                                <div className="text-xs text-red-500 mt-4">
                                                    {errors.selectedPermissions}
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Tombol untuk submit dan cancel */}
                        <div className="flex items-center gap-2">
                            <Button type={"submit"} />
                            <Button
                                type={"cancel"}
                                url={route("roles.index")}
                            />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
