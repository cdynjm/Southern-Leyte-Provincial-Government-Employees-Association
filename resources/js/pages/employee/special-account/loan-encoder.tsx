import FormattedDate from '@/components/formatted-date';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Employees, type Paginated } from '@/types';
import { useForm } from '@inertiajs/react';
import { EraserIcon, LoaderCircle, SearchIcon } from 'lucide-react';

interface LoanEncoderProps {
    employees: Paginated<Employees>;
    search: string;
}

export default function LoanEncoder({ employees, search }: LoanEncoderProps) {
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
            <div className="grid grid-cols-1 items-center gap-3 mb-4">
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
                                                <div>{emp.name}</div>
                                                <small>{emp.employeeID}</small>
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
            <Pagination links={employees.links} />
        </>
    );
}
