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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ContributionTypes, type FinancialAccount, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contribution Types',
        href: route('admin.contribution-types'),
    },
];
interface ContributionTypesProps {
    auth: {
        user: User;
    };
    contributionTypes: ContributionTypes[];
    financialAccount: FinancialAccount[];
}

export default function ContributionTypes({ auth, contributionTypes, financialAccount }: ContributionTypesProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const createForm = useForm({
        description: '',
        financialAccount: '',
    });

    const addContributionType = () => {
        createForm.post(route('admin.contribution-type.store'), {
            onSuccess: () => {
                toast('Created', {
                    description: 'Contribution type has been added successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                createForm.reset();
                setOpenDialog(false);
            },
        });
    };

    const updateForm = useForm({
        encrypted_id: '',
        financialAccount: '',
        description: '',
    });

    const editContributionType = (contributionType: ContributionTypes) => {
        updateForm.setData('encrypted_id', contributionType.encrypted_id);
        updateForm.setData('description', contributionType.description);
        updateForm.setData('financialAccount', contributionType.financialAccountEncrypted_id);
        setOpenEditDialog(true);
    };

    const updateContributionType = () => {
        updateForm.put(route('admin.contribution-type.update'), {
            onSuccess: () => {
                toast('Updated', {
                    description: 'Contribution type has been updated successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                updateForm.reset();
                setOpenEditDialog(false);
            },
        });
    };

    const deleteForm = useForm({
        encrypted_id: '',
    });

    const deleteContributionType = (encrypted_id: string) => {
        deleteForm.setData('encrypted_id', encrypted_id);
        setOpenDeleteDialog(true);
    };

    const removeContributionType = () => {
        deleteForm.delete(route('admin.contribution-type.destroy'), {
            onSuccess: () => {
                toast('Deleted', {
                    description: 'Contribution type has been deleted successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                deleteForm.reset();
                setOpenDeleteDialog(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Contribution Types" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <Label className="text-sm font-bold text-gray-500">List of Contribution Types</Label>
                    </div>

                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="text-[12px]">
                                + Add
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add New Contribution Type</DialogTitle>
                                <DialogDescription>Fill in the details below to add a new contribution type.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2">
                                <Label>Description</Label>
                                <Input
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    placeholder="Enter Description"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <Label>Financial Account</Label>

                                <Select value={createForm.data.financialAccount} onValueChange={(value) => createForm.setData('financialAccount', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Financial Account" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {financialAccount.map((fa) => (
                                            <SelectItem key={fa.encrypted_id} value={fa.encrypted_id}>
                                                {fa.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button disabled={createForm.processing} onClick={addContributionType}>
                                    {createForm.processing ? 'Saving...' : 'Save'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Edit Contribution Type</DialogTitle>
                                <DialogDescription>Update contribution type details below.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-2">
                                <Label>Description</Label>
                                <Input
                                    value={updateForm.data.description}
                                    onChange={(e) => updateForm.setData('description', e.target.value)}
                                    placeholder="Enter Description"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <Label>Financial Account</Label>

                                <Select value={updateForm.data.financialAccount} onValueChange={(value) => updateForm.setData('financialAccount', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Financial Account" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {financialAccount.map((fa) => (
                                            <SelectItem key={fa.encrypted_id} value={fa.encrypted_id}>
                                                {fa.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button disabled={updateForm.processing} onClick={updateContributionType}>
                                    {updateForm.processing ? 'Saving...' : 'Save'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Delete Contribution Type</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this contribution type? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button variant="destructive" onClick={removeContributionType} disabled={deleteForm.processing}>
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
                            <TableHead className="text-start text-nowrap">Description</TableHead>
                            <TableHead className="text-start text-nowrap">Financial Account</TableHead>
                            <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contributionTypes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-[13px] text-gray-500">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            contributionTypes.map((ct, index) => (
                                <TableRow key={ct.encrypted_id}>
                                    <TableCell className="py-[6px] text-center">{index + 1}</TableCell>
                                    <TableCell className="py-[6px] text-nowrap">{ct.description}</TableCell>
                                    <TableCell className="py-[6px] text-nowrap">{ct.financialaccount?.name}</TableCell>

                                    <TableCell className="py-[6px]">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button variant="secondary" className="text-[11px]" size="icon" onClick={() => editContributionType(ct)}>
                                                <PencilIcon className="text-gray-600" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="text-[11px]"
                                                size="icon"
                                                onClick={() => deleteContributionType(ct.encrypted_id)}
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
            </div>
        </AppLayout>
    );
}
