// Mengimpor React dan komponen yang diperlukan dari proyek dan pustaka pihak ketiga
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Container from "@/Components/Container";
import { Head, useForm, usePage } from "@inertiajs/react";  // Menggunakan Inertia.js untuk manajemen form dan page props
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Checkbox from "@/Components/Checkbox";
import Swal from "sweetalert2";  // Library untuk alert modals

// Komponen utama untuk membuat role baru
export default function Create({ auth }) {
    // Mendapatkan daftar permissions dari props yang dikirim Inertia
    const { permissions } = usePage().props;

    // Mendefinisikan state form menggunakan useForm dari Inertia
    const { data, setData, post, errors, processing } = useForm({
        name: "",                    // Nama role yang akan dibuat
        selectedPermissions: [],     // Permissions yang dipilih untuk role tersebut
    });

    // Fungsi untuk menangani pemilihan permissions
    const handleSelectedPermissions = (e) => {
        let items = data.selectedPermissions;
        items.push(e.target.value);  // Menambahkan permission yang dipilih ke array
        setData("selectedPermissions", items);  // Memperbarui state form
    };

    // Fungsi untuk menangani submit form
    const handleStoreData = async (e) => {
        e.preventDefault();  // Mencegah reload halaman saat form disubmit

        post(route("roles.store"), {  // Mengirim data ke route `roles.store` di backend
            onSuccess: () => {
                // Menampilkan alert sukses jika data berhasil dikirim
                Swal.fire({
                    title: "Success!",
                    text: "Data created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    return (
        // Menggunakan layout untuk halaman yang membutuhkan autentikasi
        <AuthenticatedLayout
            user={auth.user}  // Mengirim data user yang login
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Role
                </h2>
            }
        >
            {/* Mengatur judul halaman di tab browser */}
            <Head title={"Create Roles"} />

            {/* Kontainer utama */}
            <Container>
                {/* Kartu untuk form pembuatan role baru */}
                <Card title={"Create new role"}>
                    <form onSubmit={handleStoreData}>
                        {/* Input untuk nama role */}
                        <div className="mb-4">
                            <Input
                                label={"Role Name"}
                                type={"text"}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                errors={errors.name}
                                placeholder="Input role name.."
                            />
                        </div>

                        {/* Input untuk memilih permissions */}
                        <div className="mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(permissions).map(
                                    ([group, permissionItems], i) => (
                                        <div
                                            key={i}
                                            className="p-4 bg-white rounded-lg shadow-md"
                                        >
                                            {/* Menampilkan nama grup permission */}
                                            <h3 className="font-bold text-lg mb-2">
                                                {group}
                                            </h3>

                                            {/* Menampilkan daftar checkbox untuk setiap permission */}
                                            <div className="flex flex-wrap gap-2">
                                                {permissionItems.map(
                                                    (permission) => (
                                                        <Checkbox
                                                            label={permission}
                                                            value={permission}
                                                            onChange={
                                                                handleSelectedPermissions
                                                            }
                                                            key={permission}
                                                        />
                                                    )
                                                )}
                                            </div>

                                            {/* Menampilkan pesan error jika ada */}
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

                        {/* Tombol submit dan cancel */}
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
