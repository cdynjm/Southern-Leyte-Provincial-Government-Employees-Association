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
import { type BreadcrumbItem, type Offices, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Offices',
        href: route('admin.offices'),
    },
];
interface OfficesProps {
    auth: {
        user: User;
    };
    offices: Offices[];
}

export default function Offices({ auth, offices }: OfficesProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const createForm = useForm({
        officeName: '',
    });

    const addOffice = () => {
        createForm.post(route('admin.office.store'), {
            onSuccess: () => {
                toast('Created', {
                    description: 'Office has been added successfully.',
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
                    description: 'Office name is already taken',
                });
            },
        });
    };

    const updateForm = useForm({
        encrypted_id: '',
        officeName: '',
    });

    const editOffice = (office: Offices) => {
        updateForm.setData({
            encrypted_id: String(office.encrypted_id),
            officeName: String(office.officeName),
        });
        setOpenEditDialog(true);
    };

    const updateOffice = () => {
        updateForm.put(route('admin.office.update'), {
            onSuccess: () => {
                toast('Updated', {
                    description: 'Officce has been updated successfully.',
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
                    description: 'Office name is already taken',
                });
            },
        });
    };

    const deleteForm = useForm({
        encrypted_id: '',
    });

    const deleteOffice = (encrypted_id: string) => {
        deleteForm.setData({ encrypted_id: String(encrypted_id) });
        setOpenDeleteDialog(true);
    };

    const removeOffice = () => {
        deleteForm.delete(route('admin.office.destroy'), {
            onSuccess: () => {
                toast('Deleted', {
                    description: 'Office was deleted successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                setOpenDeleteDialog(false);
            },
            onError: () => {
                toast('Failed', {
                    description: 'Unable to delete office. Please try again.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Offices" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-bold text-gray-500">List of Offices</Label>
                        </div>

                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="text-[12px]">
                                    + Add
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Office</DialogTitle>
                                    <DialogDescription>Fill in the details below to add a new office.</DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-col gap-2">
                                    <Label>Office Name</Label>
                                    <Input
                                        value={createForm.data.officeName}
                                        onChange={(e) => createForm.setData('officeName', e.target.value)}
                                        placeholder="Enter Office Name"
                                        required
                                    />
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button onClick={addOffice} disabled={createForm.processing}>
                                        {createForm.processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Office</DialogTitle>
                                    <DialogDescription>Update the office details below.</DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-col gap-2">
                                    <Label>Office Name</Label>
                                    <Input
                                        value={updateForm.data.officeName}
                                        onChange={(e) => updateForm.setData('officeName', e.target.value)}
                                        placeholder="Update Office Name"
                                        required
                                    />
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button onClick={updateOffice} disabled={updateForm.processing}>
                                        {updateForm.processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Delete Office</DialogTitle>
                                    <DialogDescription>Are you sure you want to delete this office? This action cannot be undone.</DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button variant="destructive" onClick={removeOffice} disabled={deleteForm.processing}>
                                        {deleteForm.processing ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="">
                                <TableHead className="w-[50px] text-center">#</TableHead>
                                <TableHead className="text-start text-nowrap">Office Name</TableHead>
                                <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                offices.map((of, index) => (
                                    <TableRow key={of.encrypted_id}>
                                        <TableCell className="py-[6px] text-center">{index + 1}</TableCell>

                                        <TableCell className="py-[6px] text-start text-nowrap">{of.officeName}</TableCell>
                                        <TableCell className="py-[6px]">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button variant="secondary" className="text-[11px]" size="icon" onClick={() => editOffice(of)}>
                                                    <PencilIcon className="text-gray-600" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className="text-[11px]"
                                                    size="icon"
                                                    onClick={() => deleteOffice(of.encrypted_id)}
                                                >
                                                    <Trash2Icon className="text-red-600" />
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
