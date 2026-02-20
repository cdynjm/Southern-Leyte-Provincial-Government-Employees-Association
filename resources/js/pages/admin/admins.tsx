import { SkeletonCard } from '@/components/skeleton-card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type Admins, type BreadcrumbItem, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: route('admin.admins'),
    },
];
interface AdminsProps {
    auth: {
        user: User;
    };
    admins: Admins[];
}

export default function Admins({ auth, admins }: AdminsProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
    });

    const addAdmin = () => {
        const { name, email, password } = createForm.data;

        if (!name || !email || !password) {
            toast('Opss, Error', {
                description: 'Please fill in required fields before submitting.',
            });
            return;
        }

        createForm.post(route('admin.admin.store'), {
            onSuccess: () => {
                toast('Created', {
                    description: 'Admin has been added successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                createForm.reset();
                setOpenDialog(false);
            },
            onError: () => {
                toast('Opss, sorry but ...', {
                    description: 'Username is already taken',
                });
            },
        });
    };

    const updateForm = useForm({
        encrypted_id: '',
        name: '',
        email: '',
        password: '',
    });

    const editAdmin = (admin: Admins) => {
        updateForm.setData({
            encrypted_id: String(admin.encrypted_id),
            name: String(admin.name),
            email: String(admin.email),
            password: '',
        });
        setOpenEditDialog(true);
    };

    const updateAdmin = () => {
        const { name, email } = updateForm.data;

        if (!name || !email) {
            toast('Opss, Error', {
                description: 'Please fill in required fields before submitting.',
            });
            return;
        }

        updateForm.put(route('admin.admin.update'), {
            onSuccess: () => {
                toast('Updated', {
                    description: 'Admin has been updated successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                updateForm.reset();
                setOpenEditDialog(false);
            },
            onError: () => {
                toast('Opss, sorry but ...', {
                    description: 'Username is already taken',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Admins" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-bold text-gray-500">List of Admins</Label>
                        </div>

                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="text-[12px]">
                                    + Add
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Admin</DialogTitle>
                                    <DialogDescription>Fill in the details below to add a new admin.</DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-col gap-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Enter Name"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Username</Label>
                                    <Input
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        placeholder="Enter Username"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Password</Label>
                                    <div className="relative">
                                        <Input
                                            value={createForm.data.password}
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={(e) => createForm.setData('password', e.target.value)}
                                            placeholder="Create Password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button onClick={addAdmin} disabled={createForm.processing}>
                                        {createForm.processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Admin</DialogTitle>
                                    <DialogDescription>Update the admin details below.</DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-col gap-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={updateForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Enter Name"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Username</Label>
                                    <Input
                                        value={updateForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        placeholder="Enter Username"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>Password</Label>
                                    <div className="relative">
                                        <Input
                                            value={updateForm.data.password}
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={(e) => updateForm.setData('password', e.target.value)}
                                            placeholder="Create Password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button onClick={updateAdmin} disabled={updateForm.processing}>
                                        {updateForm.processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="">
                                <TableHead className="w-[50px] text-center">#</TableHead>
                                <TableHead className="text-start text-nowrap">Name</TableHead>
                                <TableHead className="text-start text-nowrap">Role</TableHead>
                                <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                admins.map((ad, index) => (
                                    <TableRow key={ad.encrypted_id}>
                                        <TableCell className="py-[6px] text-center">{index + 1}</TableCell>

                                        <TableCell className="py-[6px] text-start text-nowrap">
                                            <div className="font-bold">{ad.name}</div>
                                            <small>{ad.email}</small>
                                        </TableCell>
                                        <TableCell className="py-[6px] text-start text-nowrap">{ad.role}</TableCell>
                                        <TableCell className="py-[6px]">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button variant="secondary" className="text-[11px]" size="icon" onClick={() => editAdmin(ad)}>
                                                    <PencilIcon className="text-gray-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
