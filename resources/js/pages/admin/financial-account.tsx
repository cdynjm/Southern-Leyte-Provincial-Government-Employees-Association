import { SkeletonCard } from '@/components/skeleton-card';
import { Badge } from '@/components/ui/badge';
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
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type FinancialAccount, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Financial Account',
        href: route('admin.financial-account'),
    },
];
interface FinancialAccountProps {
    auth: {
        user: User;
    };
    financialAccount: FinancialAccount[];
}

export default function FinancialAccount({ auth, financialAccount }: FinancialAccountProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    type FinancialAccountFormData = {
        encrypted_id?: string;
        name: string;
        balance: number | '';
        deduct_enabled?: boolean;
        deduct_from_account?: string;
        deduct_amount?: number | '';
    };

    const createForm = useForm<FinancialAccountFormData>({
        name: '',
        balance: '',
    });

    const addFinancialAccount = () => {
        createForm.post(route('admin.financial-account.store'), {
            onSuccess: () => {
                toast('Created', {
                    description: 'Financial account has been added successfully.',
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

    const updateForm = useForm<FinancialAccountFormData>({
        encrypted_id: '',
        name: '',
        balance: '',
        deduct_enabled: false,
        deduct_from_account: '',
        deduct_amount: '',
    });

    const editFinancialAccount = (financialAccount: FinancialAccount) => {
        updateForm.setData('encrypted_id', financialAccount.encrypted_id);
        updateForm.setData('name', financialAccount.name);
        updateForm.setData('balance', financialAccount.balance);
        setOpenEditDialog(true);
    };

    const updateFinancialAccount = () => {
        updateForm.put(route('admin.financial-account.update'), {
            onSuccess: () => {
                toast('Updated', {
                    description: 'Financial account has been updated successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                updateForm.reset();
                setOpenEditDialog(false);
            },
            onError: (errors) => {
                toast('Opss, sorry but ...', {
                    description: errors?.deduct || 'Something went wrong.',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Financial Account" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-bold text-gray-500">List of Financial Accounts</Label>
                        </div>

                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="text-[12px]">
                                    + Add
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Add New Financial Account</DialogTitle>
                                    <DialogDescription>Fill in the details below to add a new financial account.</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Enter Description"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Current Balance</Label>
                                    <Input
                                        type="number"
                                        value={createForm.data.balance}
                                        placeholder="Enter Current Balance"
                                        required
                                        onChange={(e) => createForm.setData('balance', e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button disabled={createForm.processing} onClick={addFinancialAccount}>
                                        {createForm.processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Edit Financial Account</DialogTitle>
                                    <DialogDescription>Update financial account details below.</DialogDescription>
                                </DialogHeader>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={updateForm.data.name}
                                        onChange={(e) => updateForm.setData('name', e.target.value)}
                                        placeholder="Enter Description"
                                        required
                                    />
                                </div>

                                {/* Balance */}
                                <div className="flex flex-col gap-2">
                                    <Label>Current Balance</Label>
                                    <Input
                                        type="number"
                                        value={updateForm.data.balance}
                                        placeholder="Enter Current Balance"
                                        onChange={(e) => updateForm.setData('balance', e.target.value === '' ? '' : Number(e.target.value))}
                                        required
                                    />
                                </div>

                                {/* Deduction Toggle */}
                                <div className="flex items-center justify-start gap-2 pt-2">
                                    <Switch
                                        id="deduct-switch"
                                        checked={!!updateForm.data.deduct_enabled}
                                        onCheckedChange={(checked) => updateForm.setData('deduct_enabled', checked)}
                                    />
                                    <Label htmlFor="deduct-switch" className="cursor-pointer">
                                        Deduct from another financial account
                                    </Label>
                                </div>

                                {/* Deduction Fields */}
                                {updateForm.data.deduct_enabled && (
                                    <div className="flex flex-col gap-3 rounded-md border p-3">
                                        {/* Select account */}
                                        <div className="flex flex-col gap-2">
                                            <Label>Deduct From</Label>
                                            <Select
                                                value={updateForm.data.deduct_from_account}
                                                onValueChange={(value) => updateForm.setData('deduct_from_account', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select financial account" />
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

                                        {/* Display balance if an account is selected */}
                                        {updateForm.data.deduct_from_account && (
                                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                                <small>Available Balance:</small>
                                                <span className="text-[16px] font-bold text-green-600">
                                                    ₱{' '}
                                                    {financialAccount.find((fa) => fa.encrypted_id === updateForm.data.deduct_from_account)
                                                        ?.balance ?? 0}
                                                </span>
                                            </p>
                                        )}

                                        {/* Deduction amount */}
                                        <div className="flex flex-col gap-2">
                                            <Label>Deduction Amount</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="Enter amount to deduct"
                                                value={updateForm.data.deduct_amount}
                                                onChange={(e) =>
                                                    updateForm.setData('deduct_amount', e.target.value === '' ? '' : Number(e.target.value))
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button disabled={updateForm.processing} onClick={updateFinancialAccount}>
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
                                <TableHead className="text-start text-nowrap">Account</TableHead>
                                <TableHead className="text-center text-nowrap">Balance</TableHead>
                                <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {financialAccount.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-[13px] text-gray-500">
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                financialAccount.map((fa, index) => (
                                    <TableRow key={fa.encrypted_id}>
                                        <TableCell className="py-[6px] text-center">{index + 1}</TableCell>
                                        <TableCell className="py-[6px] text-nowrap">{fa.name}</TableCell>
                                        <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                            <Badge variant="secondary" className="text-[15px] font-bold">
                                                ₱{' '}
                                                {Number(fa.balance).toLocaleString('en-PH', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-[6px]">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="secondary"
                                                    className="text-[11px]"
                                                    size="icon"
                                                    onClick={() => editFinancialAccount(fa)}
                                                >
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
