import FormattedDate from '@/components/formatted-date';
import Pagination from '@/components/pagination';
import { SkeletonCard } from '@/components/skeleton-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type LoanAmortization, type Paginated, type User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { EraserIcon, EyeIcon, LoaderCircle, SearchIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Loans',
        href: route('admin.loans'),
    },
];
interface LoanProps {
    auth: {
        user: User;
    };
    search: string;
    status: string;
    borrowers: Paginated<LoanAmortization>;
}

export default function Loans({ search, borrowers, auth, status }: LoanProps) {
    const searchEmployeeForm = useForm({
        search: search || '',
        status: status || ''
    });

    const clearEmployeeForm = useForm({
        search: '',
        status: ''
    });

    const searchEmployee = () => {
        searchEmployeeForm.post(route('admin.borrowers.search'));
    };

    const clearSearch = () => {
        clearEmployeeForm.post(route('admin.borrowers.clear-search'), {
            onSuccess: () => {
                searchEmployeeForm.setData('search', '');
                searchEmployeeForm.setData('status', 'unpaid');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Loans" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div>
                                <Label className="text-sm font-bold text-gray-500">List of Employees Loan</Label>
                            </div>
                    <div className="flex flex-col">
                        <div className="mb-4 grid grid-cols-1 items-center gap-3 lg:grid-cols-2">
                            <div className='flex items-center gap-2'>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    onClick={clearSearch}
                                    disabled={searchEmployeeForm.processing}
                                    className={!search && !status ? 'hidden' : 'text-red-600'}
                                >
                                    {clearEmployeeForm.processing ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <EraserIcon className="h-4 w-4" />
                                    )}
                                </Button>
                                <Select value={searchEmployeeForm.data.status} onValueChange={(value) => searchEmployeeForm.setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="unpaid">Unpaid</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                
                                <Input
                                    type="text"
                                    placeholder="Search borrowers..."
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
                                    <TableHead className="text-start text-nowrap">Name</TableHead>
                                    <TableHead className="text-center text-nowrap">Amount Borrowed</TableHead>
                                    <TableHead className="text-center text-nowrap">Net Proceeds</TableHead>
                                    <TableHead className="text-center text-nowrap">Date Applied</TableHead>
                                    <TableHead className="text-center text-nowrap">Payment Status</TableHead>
                                    <TableHead className="text-center text-nowrap">Status</TableHead>
                                    <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {borrowers.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                            No borrowers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {borrowers.data.map((bor, index) => (
                                            <TableRow key={bor.encrypted_id}>
                                                <TableCell className="py-[6px] text-center">
                                                    {index + 1 + (borrowers.current_page - 1) * borrowers.per_page}
                                                </TableCell>

                                                <TableCell className="py-[6px] text-nowrap">
                                                    <Link href={route('admin.view-employee-loan', { encrypted_id: bor.encrypted_id })}>
                                                        <div className="font-bold">{bor.user?.name}</div>
                                                        <small>
                                                            {bor.user?.employeeID} | <span className="text-gray-500">{bor.user?.position}</span>
                                                        </small>
                                                    </Link>
                                                </TableCell>

                                                <TableCell className="py-[6px] text-center text-nowrap">
                                                    <div className="font-bold">
                                                        ₱
                                                        {Number(bor.borrowed).toLocaleString('en-PH', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </div>{' '}
                                                    <small>
                                                        with a{' '}
                                                        <span className="font-bold text-green-600">
                                                            {Number(bor.rateInMonth) % 1 === 0 ? Number(bor.rateInMonth) : Number(bor.rateInMonth)}%
                                                        </span>{' '}
                                                        rate in month for <span className="font-bold">{bor.periodInMonths}</span> month/s
                                                    </small>
                                                </TableCell>

                                                <TableCell className="py-[6px] text-center font-bold text-nowrap text-blue-600">
                                                    ₱
                                                    {Number(bor.netProceeds).toLocaleString('en-PH', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </TableCell>

                                                <TableCell className="py-[6px] text-center text-[13px] font-normal text-nowrap">
                                                    <FormattedDate date={bor.dateApplied} variant="date" />
                                                </TableCell>

                                                <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                                    <Badge variant={bor.paymentStatus === 'unpaid' ? 'destructive' : 'default'}>
                                                        {bor.paymentStatus}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                                    <Badge variant={bor.status === 'pending' ? 'destructive' : 'default'}>{bor.status}</Badge>
                                                </TableCell>

                                                <TableCell className="py-[6px]">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link href={route('admin.view-employee-loan', { encrypted_id: bor.encrypted_id })}>
                                                            <Button variant="secondary" size="sm" className="text-[13px]">
                                                                <EyeIcon />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                        <Pagination links={borrowers.links} />
                    </div>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
