import { SkeletonCard } from '@/components/skeleton-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type FinancialAccount, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Landmark, PencilIcon } from 'lucide-react';
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

        deposit_enabled?: boolean;
        deposit_amount?: number | '';

        withdraw_enabled?: boolean;
        withdraw_amount?: number | '';
        withdraw_purpose?: string;
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

        deposit_enabled: false,
        deposit_amount: '',

        withdraw_enabled: false,
        withdraw_amount: '',
        withdraw_purpose: '',

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

    const handleExclusiveToggle = (
        field: 'deduct_enabled' | 'deposit_enabled' | 'withdraw_enabled',
        checked: boolean
        ) => {
        updateForm.setData({
            ...updateForm.data,

            deduct_enabled: false,
            deposit_enabled: false,
            withdraw_enabled: false,

            // enable only the selected one if checked = true
            [field]: checked,
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
                            <DialogContent className="sm:max-w-xl">
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
                                        readOnly
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
                                        onCheckedChange={(checked) => handleExclusiveToggle('deduct_enabled', checked)}
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
                                                    {Number(financialAccount.find((fa) => fa.encrypted_id === updateForm.data.deduct_from_account)?.balance ?? 0).toLocaleString('en-PH', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
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

                                {/* Deposit Toggle */}
                                <div className="flex items-center justify-start gap-2 pt-2">
                                    <Switch
                                        id="deposit-switch"
                                        checked={!!updateForm.data.deposit_enabled}
                                        onCheckedChange={(checked) => handleExclusiveToggle('deposit_enabled', checked)}
                                    />
                                    <Label htmlFor="deposit-switch" className="cursor-pointer">
                                        Deposit to this financial account
                                    </Label>
                                </div>

                                {/* Deposit Fields */}
                                {updateForm.data.deposit_enabled && (
                                    <div className="flex flex-col gap-3 rounded-md border p-3">

                                        {/* Deposit amount */}
                                        <div className="flex flex-col gap-2">
                                            <Label>Deposit Amount</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="Enter amount to deposit"
                                                value={updateForm.data.deposit_amount}
                                                onChange={(e) =>
                                                    updateForm.setData('deposit_amount', e.target.value === '' ? '' : Number(e.target.value))
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Withdraw Toggle */}
                                <div className="flex items-center justify-start gap-2 pt-2">
                                    <Switch
                                        id="withdraw-switch"
                                        checked={!!updateForm.data.withdraw_enabled}
                                        onCheckedChange={(checked) => handleExclusiveToggle('withdraw_enabled', checked)}
                                    />
                                    <Label htmlFor="withdraw-switch" className="cursor-pointer">
                                        Withdraw from this financial account
                                    </Label>
                                </div>

                                {/* Withdrawal Fields */}
                                {updateForm.data.withdraw_enabled && (
                                    <div className="flex flex-col gap-3 rounded-md border p-3">

                                        {/* Withdrawal amount */}
                                        <div className="flex flex-col gap-2">
                                            <Label>Withdrawal Amount</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="Enter amount to withdraw"
                                                value={updateForm.data.withdraw_amount}
                                                onChange={(e) =>
                                                    updateForm.setData('withdraw_amount', e.target.value === '' ? '' : Number(e.target.value))
                                                }
                                            />
                                        </div>

                                        {/* Withdrawal purpose */}
                                        <div className="flex flex-col gap-2">
                                            <Label>Withdrawal Purpose</Label>
                                            <Input
                                               
                                                placeholder="Enter description/purpose for withdrawal"
                                                value={updateForm.data.withdraw_purpose}
                                                onChange={(e) =>
                                                    updateForm.setData('withdraw_purpose', e.target.value)
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

                    {financialAccount.length === 0 ? (
                        <div className="py-10 text-center text-sm text-muted-foreground">No Data Found</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {financialAccount.map((fa, index) => (
                                <Card key={fa.encrypted_id} className="rounded-2xl shadow-sm transition-all hover:shadow-md">
                                    <CardHeader className="flex flex-row items-start justify-between">
                                        <div>
                                            <p className="mb-2 text-xs text-muted-foreground">Account #{index + 1}</p>
                                            <CardTitle className="text-lg font-semibold">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <Landmark className="shrink-0 text-green-600" />
                                                    <span className="flex-1 truncate text-sm">{fa.name}</span>
                                                </div>
                                            </CardTitle>
                                        </div>
                                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => editFinancialAccount(fa)}>
                                            <PencilIcon className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="mt-0">
                                            <p className="text-xs text-muted-foreground">Available Balance</p>

                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-2xl font-bold tracking-tight">
                                                    ₱{' '}
                                                    {Number(fa.balance).toLocaleString('en-PH', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </span>

                                                <Badge variant="secondary">SOLEPGEA</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
