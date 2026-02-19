import FormattedDate from '@/components/formatted-date';
import { SkeletonCard } from '@/components/skeleton-card';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type LoanAmortization, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';
interface ViewEmployeeLoanProps {
    auth: {
        user: User;
    };
    encrypted_id: string;
    borrower: LoanAmortization;
    today: string;
}

export default function Dashboard({ auth, encrypted_id, borrower, today }: ViewEmployeeLoanProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'View Employee Loan',
            href: route('employee.view-employee-loan', { encrypted_id }),
        },
    ];

    function toLocalDateString(iso: string) {
        const d = new Date(iso);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISO = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
        return localISO;
    }

    const formattedToday = toLocalDateString(today);

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="View Employee Loan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <Card className="relative mb-4 overflow-hidden rounded-md border-none shadow-none">
                        {/* Overlay background logo */}
                        {/* Left overlay logo */}
                        <div className="pointer-events-none absolute top-1/2 left-[-120px] -translate-y-1/2 opacity-[0.07]">
                            <img src="/img/province-logo-official.png" alt="SOLEPGEA" className="w-[600px] max-w-none select-none" />
                        </div>

                        {/* Right overlay logo */}
                        <div className="pointer-events-none absolute top-1/2 right-[-120px] -translate-y-1/2 opacity-[0.07]">
                            <img src="/img/solepgea-logo.png" alt="SOLEPGEA" className="w-[600px] max-w-none select-none" />
                        </div>

                        <CardContent className="flex flex-col items-center gap-4">
                            {/* Left avatar */}
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                                {borrower.user?.name.charAt(0)}
                            </div>

                            {/* Middle info */}
                            <div className="flex-1 text-center">
                                <h2 className="text-lg leading-tight font-semibold">{borrower.user?.name}</h2>
                                <p className="text-sm text-muted-foreground">{borrower.user?.position}</p>
                                <p className="text-sm font-bold text-muted-foreground">
                                    {borrower.user?.employmentType === 'regular' ? 'Regular' : 'Job Order'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none">
                        <CardContent>
                            <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
                                <Label className="font-bold">Loan Amortization Schedule</Label>
                                <div className="flex items-center gap-2">
                                    <small className="text-[12px]">Current Date: </small>
                                    <small className="font-bold text-blue-600">
                                        <FormattedDate date={today} variant="date" />
                                    </small>
                                </div>
                            </div>
                            <hr className="my-4" />
                            <div className="grid grid-cols-1 justify-center gap-4 lg:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-gray-600">
                                        Borrowed:{' '}
                                        <b>
                                            ₱{' '}
                                            {Number(borrower.borrowed).toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </b>
                                    </Label>
                                    <Label className="text-gray-600">
                                        Processing Fee:{' '}
                                        <b>
                                            ₱{' '}
                                            {Number(borrower.processingFee).toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </b>
                                    </Label>
                                    <Label className="text-gray-600">
                                        Net Proceeds:{' '}
                                        <b className="text-green-600">
                                            ₱{' '}
                                            {Number(borrower.netProceeds).toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </b>
                                    </Label>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-gray-600">
                                        Period in Months: <b>{borrower.periodInMonths}</b>
                                    </Label>
                                    <Label className="text-gray-600">
                                        Rate in Month:{' '}
                                        <b>{Number(borrower.rateInMonth) % 1 === 0 ? Number(borrower.rateInMonth) : Number(borrower.rateInMonth)}%</b>
                                    </Label>
                                    <Label className="text-gray-600">
                                        Monthly Installment:{' '}
                                        <b className="text-green-600">
                                            ₱{' '}
                                            {Number(borrower.monthlyInstallment).toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </b>
                                    </Label>
                                </div>
                            </div>

                            <hr className="my-4" />
                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-600">
                                    <small>Encoded by: </small><b className="">{borrower.encodedBy ? borrower.encodedBy : ''}</b>
                                </Label>

                                <Label className="text-gray-600">
                                    <small>Validated by:</small> <b className="">{borrower.validatedBy ? borrower.validatedBy : ''}</b>
                                </Label>

                                <Label className="text-gray-600">
                                    <small>Approved by:</small> <b className="">{borrower.approvedBy ? borrower.approvedBy : ''}</b>
                                </Label>
                            </div>

                            {borrower.status === 'approved' ? (
                                <>
                                    <hr className="my-4" />
                                    
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px] text-center">Month</TableHead>
                                                <TableHead className="text-start text-nowrap">Due Date</TableHead>
                                                <TableHead className="text-start text-nowrap">Payment Date</TableHead>
                                                <TableHead className="text-start text-nowrap">Installment</TableHead>
                                                <TableHead className="text-start text-nowrap">Interest</TableHead>
                                                <TableHead className="text-start text-nowrap">Principal</TableHead>
                                                <TableHead className="text-start text-nowrap">Outstanding Balance</TableHead>
                                                <TableHead className="text-start text-nowrap">Processed</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {borrower.duedates?.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center text-[13px] text-gray-500">
                                                        No data to be shown.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                borrower.duedates.map((month, monthIndex) => {
                                                    const startDate = monthIndex === 0 ? borrower.date : borrower.duedates[monthIndex - 1].date;
                                                    const endDate = month.date;

                                                    return month.loaninstallment?.map((ln, lnIndex) => (
                                                        <TableRow
                                                            key={lnIndex}
                                                            className={
                                                                new Date(startDate) <= new Date(formattedToday) &&
                                                                new Date(formattedToday) <= new Date(endDate) &&
                                                                borrower.paymentStatus === 'unpaid'
                                                                    ? 'bg-yellow-100'
                                                                    : ''
                                                            }
                                                        >
                                                            {/* Month only on first installment of that month */}
                                                            <TableCell className="py-[6px] text-center">
                                                                {lnIndex === 0 ? monthIndex + 1 : ''}
                                                            </TableCell>

                                                            {/* Due Date / Date Range */}
                                                            <TableCell className="py-[6px] text-nowrap">
                                                                {lnIndex === 0 ? (
                                                                    <FormattedDate date={startDate} endDate={endDate} variant="date-range" />
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </TableCell>

                                                            {/* Payment Date */}
                                                            <TableCell className="py-[6px] text-nowrap">
                                                                {ln.paymentDate ? <FormattedDate date={ln.paymentDate} variant="date" /> : '-'}
                                                            </TableCell>

                                                            {/* Installment */}
                                                            <TableCell className="py-[6px] text-nowrap">
                                                                {ln.installment ? (
                                                                    <>
                                                                        <div className="flex items-center gap-2">
                                                                            {ln.status === 'paid' ? <CheckIcon className="w-4 text-green-600" /> : ''}
                                                                            ₱
                                                                            {Number(ln.installment).toLocaleString('en-PH', {
                                                                                minimumFractionDigits: 2,
                                                                                maximumFractionDigits: 2,
                                                                            })}
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <small className={ln.status === 'paid' ? 'text-green-600' : 'text-red-600'}>
                                                                        {ln.status}
                                                                    </small>
                                                                )}
                                                            </TableCell>

                                                            {/* Interest */}
                                                            <TableCell className="py-[6px] text-nowrap">
                                                                ₱
                                                                {Number(ln.interest).toLocaleString('en-PH', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })}
                                                            </TableCell>

                                                            {/* Principal */}
                                                            <TableCell className="py-[6px] text-nowrap">
                                                                {ln.principal ? (
                                                                    <>
                                                                        ₱
                                                                        {Number(ln.principal).toLocaleString('en-PH', {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        })}
                                                                    </>
                                                                ) : (
                                                                    <small>-</small>
                                                                )}
                                                            </TableCell>

                                                            {/* Outstanding Balance */}
                                                            <TableCell className="py-[6px] font-bold text-nowrap">
                                                                <div className={ln.status === 'paid' ? 'text-green-700' : 'text-red-700'}>
                                                                    ₱
                                                                    {Number(ln.outstandingBalance).toLocaleString('en-PH', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    })}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-[6px] font-normal text-nowrap">
                                                                <small>{ln.processedBy ? ln.processedBy : '-'}</small>
                                                            </TableCell>
                                                        </TableRow>
                                                    ));
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </>
                            ) : (
                                ''
                            )}
                        </CardContent>
                    </Card>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
