import FormattedDate from '@/components/formatted-date';
import { MonthLabel } from '@/components/month-label';
import Pagination from '@/components/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Contributions, type Employees, type Paginated, type User } from '@/types';
import { Head } from '@inertiajs/react';

interface ViewContributionsProps {
    auth: {
        user: User;
    };
    employee: Employees;
    contributions: Paginated<Contributions>;
    encrypted_id: string;
}

export default function ViewContributions({ auth, encrypted_id, employee, contributions }: ViewContributionsProps) {
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'View Contributions',
            href: route('admin.contributions.view', { encrypted_id }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="View Contributions" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="rounded-md shadow-none">
                    <CardContent className="flex flex-col md:flex-row justify-center items-center gap-4">
                        {/* Avatar */}
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                            {employee.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-start">
                            <h2 className="text-lg leading-tight font-semibold">{employee.name}</h2>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                        </div>

                        {/* Total Contribution */}
                        <div className="text-center md:text-right">
                            <p className="text-xs text-muted-foreground">Total Contributions</p>
                            <p className="text-xl font-bold text-green-600">₱{employee.totalContribution}</p>
                        </div>
                    </CardContent>
                </Card>
                <Table>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[50px] text-center">#</TableHead>
                            <TableHead className="text-center text-nowrap">Month</TableHead>
                            <TableHead className="text-center text-nowrap">Year</TableHead>
                            <TableHead className="text-center text-nowrap">Amount</TableHead>
                            <TableHead className="text-center text-nowrap">Updated on</TableHead>
                            <TableHead className="w-[100px] text-center text-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!contributions.data || contributions.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            contributions?.data.map((con, index) => (
                                <TableRow key={con.encrypted_id}>
                                    <TableCell className="py-[6px] text-center">
                                        {index + 1 + (contributions.current_page - 1) * contributions.per_page}
                                    </TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap">
                                        <MonthLabel month={con.month} />
                                    </TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap">{con.year}</TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap font-bold">₱{con.amount}</TableCell>
                                    <TableCell className="py-[6px] text-center text-[13px] text-nowrap text-blue-600">
                                        <FormattedDate date={con.updated_at} />
                                    </TableCell>
                                    <TableCell className="py-[6px] text-center text-[13px] text-nowrap text-blue-600"></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Pagination links={contributions.links} />
            </div>
        </AppLayout>
    );
}
