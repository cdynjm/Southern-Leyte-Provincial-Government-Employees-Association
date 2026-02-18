import FormattedDate from '@/components/formatted-date';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type LoanAmortization, type Paginated, type User } from '@/types';
import { Link } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';

interface LoanComponentProps {
    auth: {
        user: User;
    };
    borrowers: Paginated<LoanAmortization>;
}

export default function LoansComponent({ borrowers }: LoanComponentProps) {
    return (
        <>
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
                                        <Link href={route('employee.view-employee-loan', { encrypted_id: bor.encrypted_id })}>
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
                                        <Badge variant={bor.paymentStatus === 'unpaid' ? 'destructive' : 'default'}>{bor.paymentStatus}</Badge>
                                    </TableCell>

                                    <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                        <Badge variant={bor.status === 'pending' ? 'destructive' : 'default'}>{bor.status}</Badge>
                                    </TableCell>

                                    <TableCell className="py-[6px]">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={route('employee.view-employee-loan', { encrypted_id: bor.encrypted_id })}>
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
        </>
    );
}
