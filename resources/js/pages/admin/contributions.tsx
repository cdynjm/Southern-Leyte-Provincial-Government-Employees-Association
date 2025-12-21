import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employees, type Paginated, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckIcon, SearchIcon } from 'lucide-react';

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
}

export default function Contributions({ auth, employees }: ContributionsProps) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <Label className="text-sm font-bold text-gray-500">Employees Contributions</Label>
                    </div>
                    <div className="flex w-full max-w-sm items-center gap-2">
                        <Input id="search" type="text" placeholder="Search employees..." className="flex-1" />
                        <Button className="whitespace-nowrap" size="icon">
                            <SearchIcon />
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
                                        <div>{emp.name}</div>
                                        <small>{emp.position}</small>
                                    </TableCell>
                                    <TableCell className="py-[6px] text-center font-bold text-nowrap">0</TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap">
                                        <Select>
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
                                        <Select>
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
                                            <Input type="number" placeholder="₱0" className="max-w-[200px] min-w-[120px]" min={0} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-[6px]">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" variant="secondary" className="text-[12px]">
                                                <CheckIcon className="font-bold text-green-600" />
                                            </Button>
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
