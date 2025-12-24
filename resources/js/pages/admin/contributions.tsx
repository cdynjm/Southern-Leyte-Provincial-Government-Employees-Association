import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ContributionRow, type Employees, type Paginated, type User } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { CheckIcon, EraserIcon, EyeIcon, LoaderCircle, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contributions',
        href: route('admin.contributions'),
    },
];
interface ContributionsProps {
    auth: {
        user: User;
    };
    employees: Paginated<Employees>;
    search: string;
}

export default function Contributions({ auth, employees, search }: ContributionsProps) {
    const generateYears = () => {
        const startYear = 2023;
        const currentYear = new Date().getFullYear();
        const years = [];

        for (let year = startYear; year <= currentYear; year++) {
            years.push(year);
        }

        return years;
    };

    const years = generateYears();

    const generateMonths = () => {
        const months = [
            { value: '01', label: 'January' },
            { value: '02', label: 'February' },
            { value: '03', label: 'March' },
            { value: '04', label: 'April' },
            { value: '05', label: 'May' },
            { value: '06', label: 'June' },
            { value: '07', label: 'July' },
            { value: '08', label: 'August' },
            { value: '09', label: 'September' },
            { value: '10', label: 'October' },
            { value: '11', label: 'November' },
            { value: '12', label: 'December' },
        ];

        return months;
    };

    const months = generateMonths();

    const searchEmployeeForm = useForm({
        search: search || '',
    });

    const searchEmployee = () => {
        searchEmployeeForm.post(route('admin.contributions.search'));
    };

    const clearSearch = () => {
        searchEmployeeForm.post(route('admin.contributions.clear-search'), {
            onSuccess: () => {
                searchEmployeeForm.setData('search', '');
            },
        });
    };

    const [rowValues, setRowValues] = useState<Record<string, ContributionRow>>({});
    const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});

    const submitContribution = (emp: Employees) => {
        const row = rowValues[emp.encrypted_id];

        if (!row?.year || !row?.month || !row?.amount) {
            toast('Opss, Error', {
                description: 'Please fill in all fields before submitting.',
                action: {
                    label: 'Close',
                    onClick: () => console.log(''),
                },
            });
            return;
        }

        setRowLoading((prev) => ({ ...prev, [emp.encrypted_id]: true }));

        router.post(
            route('admin.contribution.store'),
            {
                encrypted_id: emp.encrypted_id,
                year: row.year,
                month: row.month,
                amount: row.amount,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast('Contribution Added', {
                        description: 'The contribution has been successfully added.',
                        action: {
                            label: 'Close',
                            onClick: () => console.log(''),
                        },
                    });

                    setRowValues((prev) => {
                        const copy = { ...prev };
                        delete copy[emp.encrypted_id];
                        return copy;
                    });

                    setRowLoading((prev) => {
                        const copy = { ...prev };
                        delete copy[emp.encrypted_id];
                        return copy;
                    });
                },
                onError: () => {
                    setRowLoading((prev) => {
                        const copy = { ...prev };
                        delete copy[emp.encrypted_id];
                        return copy;
                    });
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
                    <div className="">
                        <Label className="text-sm font-bold text-gray-500">Employees Contributions</Label>
                    </div>
                    <div className="flex w-full max-w-sm items-center gap-2">
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={clearSearch}
                            disabled={searchEmployeeForm.processing}
                            className={search === null ? 'hidden' : 'text-red-600'}
                        >
                            {searchEmployeeForm.processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <EraserIcon className="h-4 w-4" />}
                        </Button>
                        <Input
                            type="text"
                            placeholder="Search employees..."
                            onChange={(e) => searchEmployeeForm.setData('search', e.target.value)}
                            value={searchEmployeeForm.data.search}
                            className="flex-1"
                        />
                        <Button size="icon" onClick={searchEmployee} disabled={searchEmployeeForm.processing}>
                            {searchEmployeeForm.processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[50px] text-center">#</TableHead>
                            <TableHead className="w-[450px] text-start text-nowrap">Name</TableHead>
                            <TableHead className="w-[50px] text-center">
                                <div className="flex flex-col">
                                    <small>Total</small>
                                    <small>Contribution</small>
                                </div>
                            </TableHead>
                            <TableHead className="text-center text-nowrap">Year</TableHead>
                            <TableHead className="text-center text-nowrap">Month</TableHead>
                            <TableHead className="text-center text-nowrap">Amount</TableHead>
                            <TableHead className="w-[100px] text-center text-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.data.map((emp, index) => (
                                <TableRow key={emp.encrypted_id}>
                                    <TableCell className="py-[6px] text-center">
                                        {index + 1 + (employees.current_page - 1) * employees.per_page}
                                    </TableCell>
                                    <TableCell className="py-[6px] text-nowrap">
                                        <Link href={route('admin.contributions.view', { encrypted_id: emp.encrypted_id })}>
                                            <div>{emp.name}</div>
                                            <small>{emp.position}</small>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="py-[6px] text-center font-bold text-nowrap">₱{emp.totalContribution}</TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap">
                                        <Select
                                            key={rowValues[emp.encrypted_id]?.year ? rowValues[emp.encrypted_id]?.year : emp.encrypted_id + '-year'}
                                            value={rowValues[emp.encrypted_id]?.year ?? undefined}
                                            onValueChange={(value) =>
                                                setRowValues((prev) => ({
                                                    ...prev,
                                                    [emp.encrypted_id]: {
                                                        ...prev[emp.encrypted_id],
                                                        year: value,
                                                    },
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map((year) => (
                                                    <SelectItem key={year} value={year.toString()}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap">
                                        <Select
                                            key={
                                                rowValues[emp.encrypted_id]?.month ? rowValues[emp.encrypted_id]?.month : emp.encrypted_id + '-month'
                                            }
                                            value={rowValues[emp.encrypted_id]?.month ?? undefined}
                                            onValueChange={(value) =>
                                                setRowValues((prev) => ({
                                                    ...prev,
                                                    [emp.encrypted_id]: {
                                                        ...prev[emp.encrypted_id],
                                                        month: value,
                                                    },
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((month) => (
                                                    <SelectItem key={month.value} value={month.value}>
                                                        {month.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap">
                                        <div className="flex justify-center">
                                            <Input
                                                type="number"
                                                placeholder="₱0"
                                                className="max-w-[100px] min-w-[100px] text-center"
                                                min={0}
                                                value={rowValues[emp.encrypted_id]?.amount ?? ''}
                                                onChange={(e) =>
                                                    setRowValues((prev) => ({
                                                        ...prev,
                                                        [emp.encrypted_id]: {
                                                            ...prev[emp.encrypted_id],
                                                            amount: Number(e.target.value),
                                                        },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-[6px]">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="text-[12px]"
                                                onClick={() => submitContribution(emp)}
                                                disabled={!!rowLoading[emp.encrypted_id]}
                                            >
                                                {rowLoading[emp.encrypted_id] ? (
                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                                )}
                                            </Button>
                                            <Link href={route('admin.contributions.view', { encrypted_id: emp.encrypted_id })}>
                                                <Button variant="secondary" size="sm" className="text-[12px]">
                                                    <EyeIcon className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Pagination links={employees.links} />
            </div>
        </AppLayout>
    );
}
