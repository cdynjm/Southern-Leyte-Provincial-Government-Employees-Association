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
import { toast } from 'sonner';
interface EncodeEmployeeLoanProps {
    auth: {
        user: User;
    };
    encrypted_id: string;
    employee: Employees;
    today: string;
}

export default function EncodeEmployeeLoan({ auth, encrypted_id, employee, today }: EncodeEmployeeLoanProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Encode Employee Loan',
            href: route('employee.encode-employee-loan', { encrypted_id }),
        },
    ];

    function toLocalDateString(iso: string) {
        const d = new Date(iso);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISO = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
        return localISO;
    }

    const formattedToday = toLocalDateString(today);

    const createForm = useForm({
        encrypted_id: encrypted_id,
        borrowed: '',
        rateInMonth: '',
        date: formattedToday,
    });

    const preventNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === '-') {
            e.preventDefault();
            toast.error('Negative values are not allowed.');
        }
    };

    const addLoan = () => {
        const { borrowed, rateInMonth, date } = createForm.data;

        if (!borrowed || !rateInMonth || !date) {
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

    // const currentDate = new Date();
    //  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];

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
                            <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
                                <div>
                                    <Label className="text-[13px] text-gray-500">Borrowed Amount</Label>
                                    <Input
                                        value={createForm.data.borrowed}
                                        onChange={(e) => createForm.setData('borrowed', e.target.value)}
                                        type="number"
                                        min={0}
                                        onKeyDown={preventNegative}
                                        placeholder="Enter loan amount"
                                        className="mt-1"
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
                                    <Label className="text-[13px] text-gray-500">Date of Application</Label>
                                    <Input
                                        type="date"
                                        value={formattedToday}
                                        min={formattedToday}
                                        max={formattedToday}
                                        readOnly
                                        onKeyDown={(e) => e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                        className="mt-1"
                                    />
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
