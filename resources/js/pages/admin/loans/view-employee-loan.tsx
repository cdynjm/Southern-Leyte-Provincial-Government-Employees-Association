import FormattedDate from '@/components/formatted-date';
import { SkeletonCard } from '@/components/skeleton-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type LoanAmortization, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircleIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
interface ViewEmployeeLoanProps {
    auth: {
        user: User;
    };
    encrypted_id: string;
    borrower: LoanAmortization;
    today: string;
}

export default function ViewEmployeeLoan({ auth, encrypted_id, borrower, today }: ViewEmployeeLoanProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'View Employee Loan',
            href: route('admin.view-employee-loan', { encrypted_id }),
        },
    ];

    function toLocalDateString(iso: string) {
        const d = new Date(iso);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISO = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
        return localISO;
    }

    const formattedToday = toLocalDateString(today);

    type ViewEmployeeLoanFormData = {
        encrypted_id?: string;
        installment: number | '';
        paymentDate: string;
    };

    const createForm = useForm<ViewEmployeeLoanFormData>({
        encrypted_id: encrypted_id,
        installment: '',
        paymentDate: formattedToday,
    });

    const repayLoan = () => {
        const { encrypted_id, installment, paymentDate } = createForm.data;

        if (!encrypted_id || !installment || !paymentDate) {
            toast('Opss, Error', {
                description: 'Please fill in required fields before submitting.',
            });
            return;
        }

        createForm.post(route('admin.repay-loan.store'), {
            onSuccess: () => {
                toast('Created', {
                    description: 'Payment has been recorded and saved successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                createForm.reset();
            },
            onError: (errors) => {
                toast('Opss, sorry but ...', {
                    description: errors?.installment || 'Something went wrong.',
                });
            },
        });
    };

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
                            
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
                                <Label className="font-bold">Loan Amortization Schedule</Label>
                                <div className='flex items-center gap-2'>
                                    <small className='text-[12px]'>Current Date: </small>
                                    <small className='font-bold text-blue-600'><FormattedDate date={today} variant='date' /></small>
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
                            {borrower.status === 'approved' ? (
                                <>
                                    <hr className="my-4" />
                                    <p className="mb-2">
                                        <small className="text-gray-500">Note: Daily Interest is computed in real-time</small>
                                    </p>
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
                                                        </TableRow>
                                                    ));
                                                })
                                            )}
                                        </TableBody>
                                    </Table>

                                    {borrower.paymentStatus === 'unpaid' ? (
                                        <>
                                            <hr className="my-6 border border-2" />
                                            <div>
                                                <p className="mb-4 text-[14px] font-bold text-gray-600">REPAY LOAN</p>
                                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-[13px] text-gray-600">Amount to be Paid</Label>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            value={createForm.data.installment}
                                                            onChange={(e) =>
                                                                createForm.setData('installment', e.target.value === '' ? '' : Number(e.target.value))
                                                            }
                                                            placeholder="Enter Amount"
                                                        />
                                                    </div>

                                                    <div className="flex w-full items-end gap-2">
                                                        <div className="flex flex-1 flex-col gap-2">
                                                            <Label className="text-[13px] text-gray-600">
                                                                Date of Payment <span className="text-green-600">(Current Date)</span>
                                                            </Label>
                                                            <Input
                                                                type="date"
                                                                className="w-full"
                                                                value={formattedToday}
                                                                min={formattedToday}
                                                                max={formattedToday}
                                                                readOnly
                                                                onKeyDown={(e) => e.preventDefault()}
                                                                onPaste={(e) => e.preventDefault()}
                                                            />
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 text-[13px] hover:bg-green-500"
                                                            onClick={repayLoan}
                                                            disabled={createForm.processing}
                                                        >
                                                            {createForm.processing ? (
                                                                'Procesing...'
                                                            ) : (
                                                                <>
                                                                    {' '}
                                                                    <CheckCircleIcon /> Pay
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        ''
                                    )}
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
