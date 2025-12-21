import Pagination from '@/components/pagination';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employees, type Paginated, type User } from '@/types';
import { Head } from '@inertiajs/react';

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
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <Label className="text-sm font-bold text-gray-500">List of Employees</Label>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[50px] text-center">#</TableHead>
                            <TableHead className="text-start text-nowrap">Name</TableHead>
                            <TableHead className="text-center text-nowrap">Position</TableHead>
                            <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-[13px] text-gray-500">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.data.map((emp, index) => (
                                <TableRow key={emp.encrypted_id}>
                                    <TableCell className="py-[6px] text-center">
                                        {index + 1 + (employees.current_page - 1) * employees.per_page}
                                    </TableCell>
                                    <TableCell className="py-[6px] text-nowrap">{emp.name}</TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap">{emp.position}</TableCell>
                                    <TableCell className="py-[6px]"></TableCell>
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
