// Mengimpor React dan komponen yang dibutuhkan
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/Container';
import { Head, useForm, usePage } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import Select2 from '@/Components/Select2';
import Swal from 'sweetalert2';

export default function Create({ auth }) {
    // Destruktur roles dari props yang dikirim oleh Inertia
    const { roles } = usePage().props;

    // Inisialisasi state form menggunakan helper useForm dari Inertia
    const { data, setData, post, errors } = useForm({
        name: '',
        email: '',
        selectedRoles: [],
        password: '',
        password_confirmation: ''
    });

    // Memformat data roles menjadi {value, label} untuk Select2
    const formattedRoles = roles.map(role => ({
        value: role.name,
        label: role.name
    }));

    // Handler untuk update state ketika role dipilih
    const handleSelectedRoles = (selected) => {
        const selectedValues = selected.map(option => option.value);
        setData('selectedRoles', selectedValues);
    };

    // Handler untuk submit form
    const handleStoreData = async (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Data created successfully!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create User</h2>}
        >
            <Head title={'Create Users'} />
            <Container>
                <Card title={'Create new user'}>
                    <form onSubmit={handleStoreData}>
                        <div className='mb-4'>
                            <Input 
                                label={'Name'} 
                                type={'text'} 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                errors={errors.name} 
                                placeholder="Input name user.." 
                            />
                        </div>
                        <div className='mb-4'>
                            <Input 
                                label={'Email'} 
                                type={'email'} 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                errors={errors.email} 
                                placeholder="Input email user.." 
                            />
                        </div>
                        <div className='mb-4'>
                            <div className='flex items-center gap-2 text-sm text-gray-700'>Roles</div>
                            <Select2 
                                onChange={handleSelectedRoles} 
                                options={formattedRoles} 
                                placeholder="Pilih Role..." 
                            />
                        </div>
                        <div className='mb-4'>
                            <Input 
                                label={'Password'} 
                                type={'password'} 
                                value={data.password} 
                                onChange={e => setData('password', e.target.value)} 
                                errors={errors.password} 
                                placeholder="Input password user.." 
                            />
                        </div>
                        <div className='mb-4'>
                            <Input 
                                label={'Password Confirmation'} 
                                type={'password'} 
                                value={data.password_confirmation} 
                                onChange={e => setData('password_confirmation', e.target.value)} 
                                errors={errors.password_confirmation} 
                                placeholder="Input password confirmation..." 
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button type={'submit'} />
                            <Button type={'cancel'} url={route('users.index')} />
                        </div>
                    </form>
                </Card>
            </Container>
        </AuthenticatedLayout>
    );
}
