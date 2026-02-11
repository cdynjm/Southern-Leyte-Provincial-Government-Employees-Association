import FormattedDate from '@/components/formatted-date';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Employees, type LoanAmortization, type Paginated } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { CircleMinus, EraserIcon, EyeIcon, KeyboardIcon, LoaderCircle, SearchIcon, Send } from 'lucide-react';
interface LoanEncoderProps {
    employees: Paginated<Employees>;
    search: string;
    borrowers: LoanAmortization[];
}

export default function LoanEncoder({ employees, search, borrowers }: LoanEncoderProps) {
    const searchEmployeeForm = useForm({
        search: search || '',
    });

    const clearEmployeeForm = useForm({
        search: '',
    });

    const searchEmployee = () => {
        searchEmployeeForm.post(route('employee.employees.search'));
    };

    const clearSearch = () => {
        clearEmployeeForm.post(route('employee.employees.clear-search'), {
            onSuccess: () => {
                searchEmployeeForm.setData('search', '');
            },
        });
    };

    return (
        <>
            <div className="mb-4 grid grid-cols-1 items-center gap-3">
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={clearSearch}
                        disabled={searchEmployeeForm.processing}
                        className={!search ? 'hidden' : 'text-red-600'}
                    >
                        {clearEmployeeForm.processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <EraserIcon className="h-4 w-4" />}
                    </Button>
                    <Input
                        type="text"
                        placeholder="Search employees..."
                        onChange={(e) => searchEmployeeForm.setData('search', e.target.value)}
                        value={searchEmployeeForm.data.search}
                        className="flex-1"
                    />

                    <Button size="icon" onClick={searchEmployee} disabled={searchEmployeeForm.processing} className="">
                        {searchEmployeeForm.processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="w-[50px] text-center">#</TableHead>
                        <TableHead className="text-start text-nowrap">Name</TableHead>
                        <TableHead className="text-center text-nowrap">Office</TableHead>
                        <TableHead className="text-center text-nowrap">Age</TableHead>
                        <TableHead className="text-center text-nowrap">Start & End</TableHead>
                        <TableHead className="text-center text-nowrap">Type</TableHead>
                        <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {search === null ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                Type in the search box to find employees.
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {employees.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {employees.data.map((emp, index) => (
                                        <TableRow key={emp.encrypted_id}>
                                            <TableCell className="py-[6px] text-center">
                                                {index + 1 + (employees.current_page - 1) * employees.per_page}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-nowrap">
                                                <div className="font-bold">{emp.name}</div>
                                                <small>
                                                    {emp.employeeID} | <span className="text-gray-500">{emp.position}</span>
                                                </small>
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">{emp.office?.officeName}</TableCell>

                                            <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                                {emp.birthDate ? <FormattedDate date={emp.birthDate} variant="age" /> : '-'}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">
                                                <FormattedDate date={emp.startDate} variant="date" /> <span className="mx-2">|</span>
                                                {emp.endDate ? <FormattedDate date={emp.endDate} variant="date" /> : '-'}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">
                                                {emp.employmentType === 'regular' ? 'Regular' : 'Job Order'}
                                            </TableCell>

                                            <TableCell className="py-[6px]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={route('employee.encode-employee-loan', { encrypted_id: emp.encrypted_id })}>
                                                        <Button variant="secondary" size="sm" className="text-[13px]">
                                                            <KeyboardIcon className="text-blue-600" /> Encode Loan
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </TableBody>
            </Table>
            {search != null ? <Pagination links={employees.links} /> : ''}

            <hr className="my-6 border border-2" />

            <Label className="text-uppercase mb-2 flex items-center gap-2 text-sm font-bold text-gray-500">
                <CircleMinus className="text-red-500" />
                <span>Loans to be forwarded</span> |{' '}
                <span className="text-[12px] font-normal">(Loans you have encoded that are pending to be forwarded to the loan officer.)</span>
            </Label>

            <Table>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="w-[50px] text-center">#</TableHead>
                        <TableHead className="text-start text-nowrap">Name</TableHead>
                        <TableHead className="text-center text-nowrap">Amount Borrowed</TableHead>
                        <TableHead className="text-center text-nowrap">Net Proceeds</TableHead>
                        <TableHead className="text-center text-nowrap">Monthly Installment</TableHead>
                        <TableHead className="text-center text-nowrap">Date</TableHead>
                        <TableHead className="text-center text-nowrap">Status</TableHead>
                        <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {borrowers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                No encoded loans found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {borrowers.map((bor, index) => (
                                <TableRow key={bor.encrypted_id}>
                                    <TableCell className="py-[6px] text-center">{index + 1}</TableCell>

                                    <TableCell className="py-[6px] text-nowrap">
                                        <div className="font-bold">{bor.user?.name}</div>
                                        <small>
                                            {bor.user?.employeeID} | <span className="text-gray-500">{bor.user?.position}</span>
                                        </small>
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

                                    <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                        ₱
                                        {Number(bor.monthlyInstallment).toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </TableCell>

                                    <TableCell className="py-[6px] text-center font-normal text-[13px] text-nowrap">
                                        <FormattedDate date={bor.date} variant="date" />
                                    </TableCell>

                                    <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                        <Badge variant="destructive">{bor.status}</Badge>
                                    </TableCell>

                                    <TableCell className="py-[6px]">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={route('employee.view-employee-loan', { encrypted_id: bor.encrypted_id })}>
                                                <Button variant="secondary" size="sm" className="text-[13px]">
                                                    <EyeIcon />
                                                </Button>
                                            </Link>

                                            <Button variant="secondary" size="sm" className="text-[13px]">
                                                <Send />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
