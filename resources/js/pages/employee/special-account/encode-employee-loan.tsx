import { SkeletonCard } from '@/components/skeleton-card';
import { Card, CardContent } from '@/components/ui/card';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employees, type User } from '@/types';
import { Head } from '@inertiajs/react';
interface DashboardProps {
    auth: {
        user: User;
    };
    encrypted_id: string;
    employee: Employees;
}

export default function Dashboard({ auth, encrypted_id, employee }: DashboardProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Encode Employee Loan',
            href: route('employee.encode-employee-loan', { encrypted_id }),
        },
    ];

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
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
