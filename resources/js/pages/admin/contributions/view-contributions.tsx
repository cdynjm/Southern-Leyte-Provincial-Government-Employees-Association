import FormattedDate from '@/components/formatted-date';
import { MonthLabel } from '@/components/month-label';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ContributionGroup, type Employees, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CreditCardIcon, HandCoins, Trash2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ViewContributionsProps {
    auth: {
        user: User;
    };
    employee: Employees;
    contributionsByType: ContributionGroup[];
    encrypted_id: string;
}

export default function ViewContributions({ auth, encrypted_id, employee, contributionsByType }: ViewContributionsProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'View Contributions',
            href: route('admin.contributions.view', { encrypted_id }),
        },
    ];

    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        setFlipped(true);
        const timeout = setTimeout(() => setFlipped(false), 500);
        return () => clearTimeout(timeout);
    }, []);

    const handleCardClick = () => {
        setFlipped(true);
        setTimeout(() => setFlipped(false), 500);
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const deleteContributionForm = useForm({
        encrypted_id: '',
    });

    const deleteContribution = (encrypted_id: string) => {
        deleteContributionForm.setData('encrypted_id', encrypted_id);
        setOpenDeleteDialog(true);
    };

    const removeContribution = () => {
        deleteContributionForm.delete(route('admin.contribution.destroy'), {
            onSuccess: () => {
                toast('Deleted', {
                    description: 'Contribution was removed successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                setOpenDeleteDialog(false);
            },
            onError: () => {
                toast('Failed', {
                    description: 'Unable to remove contribution. Please try again.',
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
            <Head title="View Contributions" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Remove Contribution</DialogTitle>
                            <DialogDescription>Are you sure you want to remove this contribution? This action cannot be undone.</DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button variant="destructive" onClick={removeContribution} disabled={deleteContributionForm.processing}>
                                {deleteContributionForm.processing ? 'Removing...' : 'Remove'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Card className="mb-4 rounded-md shadow-none">
                    <CardContent className="flex flex-col items-center gap-4">
                        {/* Left avatar */}
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                            {employee.name.charAt(0)}
                        </div>

                        {/* Middle info */}
                        <div className="flex-1 text-center">
                            <h2 className="text-lg leading-tight font-semibold">{employee.name}</h2>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                            <p className="text-sm font-bold text-muted-foreground">
                                {employee.employmentType === 'regular' ? 'Regular' : 'Job Order'}
                            </p>
                        </div>

                        {/* Right card */}
                        <div className="perspective w-full flex-shrink-0 cursor-pointer md:mt-0 md:ml-4 md:w-[400px]" onClick={handleCardClick}>
                            <Card
                                className={`relative w-full overflow-hidden rounded-xl p-3 bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 text-white shadow-none transition-transform duration-1000 ${
                                    flipped ? 'rotate-y-180' : ''
                                }`}
                            >
                                {/* Right-side overlayed logo */}
                                <div className="pointer-events-none absolute top-1/2 right-[-50px] -translate-y-1/2 overflow-hidden">
                                    <img
                                        src="/img/solepgea-logo.png"
                                        alt="SOLEPGEA Logo"
                                        className="max-w-[350px] object-contain opacity-10 select-none"
                                    />
                                </div>

                                {/* Light shine */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_40%)]" />
                                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                    <div className="animate-card-glow absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.15),transparent)]" />
                                </div>

                                <CardContent className="relative flex flex-col gap-6 p-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm tracking-widest text-gray-300 uppercase">Contributions</p>
                                        <div className="flex h-8 w-12 flex-col items-center justify-center gap-[2px] rounded-md bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-90">
                                            <span className="h-[2px] w-8 rounded bg-yellow-100" />
                                            <span className="h-[2px] w-6 rounded bg-yellow-100" />
                                            <span className="h-[2px] w-8 rounded bg-yellow-100" />
                                        </div>
                                    </div>

                                    {/* Balance */}
                                    <h2 className="text-3xl font-bold tracking-tight">
                                        ₱
                                        {Number(employee.totalContribution).toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </h2>

                                    {/* Bottom row */}
                                    <div className="flex items-center justify-between pt-4">
                                        <div>
                                            <p className="text-xs text-gray-400">{employee.contactNumber}</p>
                                            <p className="text-sm font-medium">{employee.name}</p>
                                        </div>
                                        <Button size="sm" className="text-[12px]">
                                            <CreditCardIcon /> SOLEPGEA
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                <Table>
                    {/* TABLE HEADER — ONLY ONCE */}
                    <TableHeader className="bg-green-50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[50px] text-center text-nowrap">#</TableHead>
                            <TableHead className="text-center text-nowrap">Month</TableHead>
                            <TableHead className="text-center text-nowrap">Year</TableHead>
                            <TableHead className="text-center text-nowrap">Amount</TableHead>
                            <TableHead className="text-center text-nowrap">Updated on</TableHead>
                            <TableHead className="w-[100px] text-center text-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {contributionsByType.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={6} className="text-center text-gray-500">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            contributionsByType.map((group) => (
                                <React.Fragment key={group.type.id}>
                                    {/* CONTRIBUTION TYPE TITLE ROW */}
                                    <TableRow>
                                        <TableCell colSpan={6} className="bg-gray-50 py-2 text-sm font-semibold text-gray-700 uppercase">
                                            <HandCoins className="mr-2 inline-block h-4 w-4 text-gray-500" />
                                            {group.type.description}
                                        </TableCell>
                                    </TableRow>

                                    {/* CONTRIBUTION ROWS */}
                                    {group.contributions.data.length === 0 ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={6} className="text-center text-gray-500">
                                                No Data Found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        group.contributions.data.map((con, index) => (
                                            <TableRow key={con.encrypted_id} className="hover:bg-transparent">
                                                <TableCell className="text-center text-nowrap">
                                                    {index + 1 + (group.contributions.current_page - 1) * group.contributions.per_page}
                                                </TableCell>

                                                <TableCell className="text-center text-nowrap">
                                                    <MonthLabel month={con.month} />
                                                </TableCell>

                                                <TableCell className="text-center text-nowrap">{con.year}</TableCell>

                                                <TableCell className="text-center font-bold text-nowrap">₱{con.amount}</TableCell>

                                                <TableCell className="text-center text-nowrap text-blue-600">
                                                    <FormattedDate date={con.updated_at} />
                                                </TableCell>

                                                <TableCell className="py-0 text-center text-nowrap">
                                                    <Button variant="secondary" size="icon" onClick={() => deleteContribution(con.encrypted_id)}>
                                                        <Trash2Icon className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                    {/* PAGINATION ROW */}
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={6} className="py-4">
                                            <Pagination links={group.contributions.links} />
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
