import { SkeletonCard } from '@/components/skeleton-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employees, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CheckCheck } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
interface EncodeEmployeeLoanProps {
    auth: {
        user: User;
    };
    encrypted_id: string;
    employee: Employees;
}

export default function EncodeEmployeeLoan({ auth, encrypted_id, employee }: EncodeEmployeeLoanProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Encode Employee Loan',
            href: route('employee.encode-employee-loan', { encrypted_id }),
        },
    ];

    const createForm = useForm({
        encrypted_id: encrypted_id,
        borrowed: '',
        processingFee: '',
        rateInMonth: '',
        date: '',
    });

    const computation = useMemo(() => {
        const borrowed = parseFloat(createForm.data.borrowed) || 0;
        const processingFee = parseFloat(createForm.data.processingFee) || 0;
        const rateInMonth = (parseFloat(createForm.data.rateInMonth) || 0) / 100;
        const date = createForm.data.date;

        // Net Proceeds
        const netProceeds = borrowed - processingFee;

        // Period in months (same logic as backend)
        let periodInMonths = 0;

        if (date) {
            const loanDate = new Date(date);
            const loanMonth = loanDate.getMonth() + 1; // JS months are 0-based

            if (loanMonth === 12) {
                periodInMonths = 1;
            } else {
                periodInMonths = 12 - loanMonth;
            }
        }

        // Monthly Installment (PMT formula)
        let monthlyInstallment = 0;

        if (rateInMonth > 0 && periodInMonths > 0) {
            monthlyInstallment = (rateInMonth * borrowed) / (1 - Math.pow(1 + rateInMonth, -periodInMonths));
        } else if (periodInMonths > 0) {
            monthlyInstallment = borrowed / periodInMonths;
        }

        return {
            netProceeds: netProceeds.toFixed(2),
            periodInMonths,
            monthlyInstallment: monthlyInstallment.toFixed(2),
        };
    }, [createForm.data.borrowed, createForm.data.processingFee, createForm.data.rateInMonth, createForm.data.date]);

    const preventNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '-') {
            e.preventDefault();
            toast.error('Negative values are not allowed.');
        }
    };

    const addLoan = () => {
        const { borrowed, processingFee, rateInMonth, date } = createForm.data;

        if (!borrowed || !processingFee || !rateInMonth || !date) {
            toast('Opss, sorry but ...', {
                description: 'Please fill in all fields.',
            });
            return;
        }

        createForm.post(route('employee.encode-employee-loan.store'), {
            onSuccess: () => {
                toast('Created', {
                    description: 'Employee loan has been created successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                createForm.reset();
            },
            onError: (errors) => {
                toast('Opss, sorry but ...', {
                    description: errors?.balance || 'Something went wrong.',
                });
            },
        });
    };

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Encode Employee Loan" />
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
                                {employee.name.charAt(0)}
                            </div>

                            {/* Middle info */}
                            <div className="flex-1 text-center">
                                <h2 className="text-lg leading-tight font-semibold">{employee.name}</h2>
                                <p className="text-sm text-muted-foreground">{employee.position}</p>
                                <p className="text-sm font-bold text-muted-foreground">
                                    {employee.employmentType === 'regular' ? 'Regular' : 'Job Order'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardContent>
                            <Label className="font-bold text-gray-600">Employee Loan Information</Label>
                            <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-4">
                                <div>
                                    <Label className="text-[13px] text-gray-500">Borrowed Amount</Label>
                                    <Input
                                        value={createForm.data.borrowed}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);

                                            createForm.setData('borrowed', e.target.value);

                                            if (!value || value <= 0) {
                                                createForm.setData('processingFee', '');
                                            }

                                            if (Number(createForm.data.processingFee) >= value) {
                                                createForm.setData('processingFee', '');
                                            }
                                        }}
                                        type="number"
                                        min={0}
                                        onKeyDown={preventNegative}
                                        placeholder="Enter loan amount"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[13px] text-gray-500">Processing Fee</Label>
                                    <Input
                                        value={createForm.data.processingFee}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            const borrowed = Number(createForm.data.borrowed);

                                            if (!borrowed || borrowed <= 0) {
                                                toast.error('Enter borrowed amount first.');
                                                return;
                                            }

                                            if (value >= borrowed) {
                                                toast.error('Processing fee must be less than borrowed amount.');
                                                return;
                                            }

                                            createForm.setData('processingFee', e.target.value);
                                        }}
                                        type="number"
                                        min={0}
                                        onKeyDown={preventNegative}
                                        disabled={!createForm.data.borrowed || Number(createForm.data.borrowed) <= 0}
                                        placeholder="Enter processing fee"
                                        className="mt-1 disabled:cursor-not-allowed disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <Label className="text-[13px] text-gray-500">Rate in Month (%)</Label>
                                    <Input
                                        value={createForm.data.rateInMonth}
                                        onChange={(e) => createForm.setData('rateInMonth', e.target.value)}
                                        type="number"
                                        min={0}
                                        onKeyDown={preventNegative}
                                        placeholder="Enter rate in month"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[13px] text-gray-500">Date of Loan</Label>
                                    <Input
                                        value={createForm.data.date}
                                        min={firstDayOfMonth}
                                        onChange={(e) => createForm.setData('date', e.target.value)}
                                        type="date"
                                        placeholder="Select date of loan"
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 rounded-lg border bg-gray-50 p-4">
                                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                                    <div>
                                        <p className="text-gray-500">Net Proceeds</p>
                                        <p className="text-base font-semibold">
                                            ₱{' '}
                                            {Number(computation.netProceeds).toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Period in Months</p>
                                        <p className="text-base font-semibold">{computation.periodInMonths}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Monthly Installment</p>
                                        <p className="text-base font-semibold">
                                            ₱{' '}
                                            {Number(computation.monthlyInstallment).toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button className="mt-4 text-[13px]" variant="default" size="sm" onClick={addLoan} disabled={createForm.processing}>
                                <CheckCheck />
                                {createForm.processing ? 'Processing...' : 'Create Loan'}
                            </Button>
                        </CardContent>
                    </Card>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
