import Pagination from '@/components/pagination';
import { SkeletonCard } from '@/components/skeleton-card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ContributionRow, type ContributionTypes, type Employees, type Offices, type Paginated, type User } from '@/types';
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
    office: string;
    type: string;
    contributionTypes: ContributionTypes[];
    offices: Offices[];
}

export default function Contributions({ auth, employees, search, office, contributionTypes, offices, type }: ContributionsProps) {
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
        office: office || '',
        search: search || '',
        type: type || '',
    });

    const clearEmployeeForm = useForm({
        search: '',
        office: '',
        type: '',
    });

    const searchEmployee = () => {
        searchEmployeeForm.post(route('admin.contributions.search'));
    };

    const clearSearch = () => {
        clearEmployeeForm.post(route('admin.contributions.clear-search'), {
            onSuccess: () => {
                searchEmployeeForm.setData('search', '');
                searchEmployeeForm.setData('office', '');
                searchEmployeeForm.setData('type', '');
            },
        });
    };

    const [rowValues, setRowValues] = useState<Record<string, ContributionRow>>({});
    const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});

    const submitContribution = () => {
        const entries = Object.entries(rowValues);

        const rowsToSubmit = entries.filter(([, row]) => row.year || (row.month?.length ?? 0) > 0 || row.contributionTypes || row.amount);

        if (rowsToSubmit.length === 0) {
            toast('Opss, Error', {
                description: 'No contribution data to submit.',
                action: { label: 'Close', onClick: () => console.log('') },
            });
            return;
        }

        for (const [, row] of rowsToSubmit) {
            if (!row.year || !row.month?.length || !row.contributionTypes || !row.amount) {
                toast('Opss, Error', {
                    description: 'Please fill in all required fields for the rows you entered.',
                    action: { label: 'Close', onClick: () => console.log('') },
                });
                return;
            }
        }

        const loadingState: Record<string, boolean> = {};
        rowsToSubmit.forEach(([id]) => (loadingState[id] = true));
        setRowLoading(loadingState);

        Promise.all(
            rowsToSubmit.map(([encrypted_id, row]) =>
                router.post(
                    route('admin.contribution.store'),
                    {
                        encrypted_id,
                        contribution_type_id: row.contributionTypes,
                        year: row.year,
                        month: row.month,
                        amount: row.amount === undefined ? 0 : row.amount,
                    },
                    { preserveScroll: true },
                ),
            ),
        )
            .then(() => {
                toast('Contributions Submitted', {
                    description: 'All filled contributions have been successfully submitted. Please wait...',
                    action: { label: 'Close', onClick: () => console.log('') },
                });

                // Clear only submitted rows
                setRowValues((prev) => {
                    const copy = { ...prev };
                    rowsToSubmit.forEach(([id]) => delete copy[id]);
                    return copy;
                });

                setRowLoading({});
            })
            .catch(() => {
                toast('Error', { description: 'Failed to submit some contributions.' });
                setRowLoading({});
            });
    };

    // This can go inside your component
    const totalAmount = Object.values(rowValues).reduce((sum, row) => sum + (row.amount || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div className="grid grid-cols-1">
                        <div>
                            <Label className="text-sm font-bold text-gray-500">Employee Contributions</Label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={clearSearch}
                                disabled={searchEmployeeForm.processing}
                                className={!search && !office && !type ? 'hidden' : 'text-red-600'}
                            >
                                {clearEmployeeForm.processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <EraserIcon className="h-4 w-4" />
                                )}
                            </Button>
                            <Select value={searchEmployeeForm.data.office} onValueChange={(value) => searchEmployeeForm.setData('office', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Offices" />
                                </SelectTrigger>

                                <SelectContent>
                                    {offices.map((office) => (
                                        <SelectItem key={office.encrypted_id} value={office.encrypted_id}>
                                            {office.officeName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select value={searchEmployeeForm.data.type} onValueChange={(value) => searchEmployeeForm.setData('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="job order">Job Order</SelectItem>
                                    <SelectItem value="regular">Regular</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search employees..."
                                onChange={(e) => searchEmployeeForm.setData('search', e.target.value)}
                                value={searchEmployeeForm.data.search}
                                className="flex-1"
                            />

                            <Button size="icon" onClick={searchEmployee} disabled={searchEmployeeForm.processing} className="">
                                {searchEmployeeForm.processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <SearchIcon className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="">
                                <TableHead className="w-[50px] text-center">#</TableHead>
                                <TableHead className="w-[450px] text-start text-nowrap">Name</TableHead>
                                <TableHead className="w-[300px] text-center text-nowrap">Type</TableHead>
                                <TableHead className="w-[300px] text-center text-nowrap">Year</TableHead>
                                <TableHead className="w-[300px] text-center text-nowrap">Month</TableHead>
                                <TableHead className="w-[300px] text-center text-nowrap">Amount</TableHead>
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
                                                <div className='font-bold'>{emp.name}</div>
                                                <small>
                                                    {emp.office?.officeName} | <span className='text-gray-500'>{emp.position}</span>
                                                </small>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="py-[6px] text-center text-nowrap">
                                            <Select
                                                key={
                                                    rowValues[emp.encrypted_id]?.contributionTypes
                                                        ? rowValues[emp.encrypted_id]?.contributionTypes
                                                        : emp.encrypted_id + '-type'
                                                }
                                                value={rowValues[emp.encrypted_id]?.contributionTypes ?? undefined}
                                                onValueChange={(value) =>
                                                    setRowValues((prev) => ({
                                                        ...prev,
                                                        [emp.encrypted_id]: {
                                                            ...prev[emp.encrypted_id],
                                                            contributionTypes: value,
                                                        },
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {contributionTypes.map((ct) => (
                                                        <SelectItem key={ct.encrypted_id} value={ct.encrypted_id}>
                                                            {ct.description}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="py-[6px] text-center text-nowrap">
                                            <Select
                                                key={
                                                    rowValues[emp.encrypted_id]?.year ? rowValues[emp.encrypted_id]?.year : emp.encrypted_id + '-year'
                                                }
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-between">
                                                        {(rowValues[emp.encrypted_id]?.month ?? []).length
                                                            ? `${(rowValues[emp.encrypted_id]?.month ?? []).length} month(s) selected`
                                                            : 'Select month(s)'}
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="start" className="max-h-60 w-full overflow-auto">
                                                    <div className="grid grid-cols-1 gap-2 p-2">
                                                        {/* Select / Deselect All */}
                                                        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                                                            <input
                                                                type="checkbox"
                                                                checked={rowValues[emp.encrypted_id]?.month?.length === months.length}
                                                                onChange={(e) => {
                                                                    setRowValues((prev) => ({
                                                                        ...prev,
                                                                        [emp.encrypted_id]: {
                                                                            ...prev[emp.encrypted_id],
                                                                            month: e.target.checked
                                                                                ? months.map((m) => m.value) // Select all
                                                                                : [], // Deselect all
                                                                        },
                                                                    }));
                                                                }}
                                                            />
                                                            Select All
                                                        </label>

                                                        {/* Individual month checkboxes */}
                                                        {months.map((month) => {
                                                            const selectedMonths = rowValues[emp.encrypted_id]?.month ?? [];

                                                            return (
                                                                <label key={month.value} className="flex cursor-pointer items-center gap-2 text-sm">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedMonths.includes(month.value)}
                                                                        onChange={(e) => {
                                                                            setRowValues((prev) => {
                                                                                const current = prev[emp.encrypted_id]?.month ?? [];

                                                                                return {
                                                                                    ...prev,
                                                                                    [emp.encrypted_id]: {
                                                                                        ...prev[emp.encrypted_id],
                                                                                        month: e.target.checked
                                                                                            ? [...current, month.value]
                                                                                            : current.filter((m) => m !== month.value),
                                                                                    },
                                                                                };
                                                                            });
                                                                        }}
                                                                    />
                                                                    {month.label}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="py-[6px] text-center text-nowrap">
                                            <div className="flex justify-center">
                                                <Input
                                                    type="number"
                                                    placeholder="₱0"
                                                    className="min-w-[200px] text-start"
                                                    min={0}
                                                    value={rowValues[emp.encrypted_id]?.amount ?? ''}
                                                    onChange={(e) =>
                                                        setRowValues((prev) => ({
                                                            ...prev,
                                                            [emp.encrypted_id]: {
                                                                ...prev[emp.encrypted_id],
                                                                amount: e.target.value === '' ? undefined : Number(e.target.value),
                                                            },
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-[6px]">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* <Button
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
                                            </Button> */}
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

                    <div className="mt-2 mr-4 flex items-center justify-end text-[14px] font-medium">
                        <span className="text-[12px]">Total Amount: </span>
                        <span className="ml-2 text-[18px]">₱{totalAmount.toLocaleString()}</span>
                    </div>
                    <Button
                        variant="default"
                        className="mt-2 flex w-fit items-center gap-2 self-end text-[13px]"
                        size="sm"
                        onClick={submitContribution}
                        disabled={Object.keys(rowValues).length === 0 || Object.values(rowLoading).some(Boolean)}
                    >
                        {Object.values(rowLoading).some(Boolean) ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckIcon className="h-4 w-4" />
                        )}
                        Submit Contributions
                    </Button>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
