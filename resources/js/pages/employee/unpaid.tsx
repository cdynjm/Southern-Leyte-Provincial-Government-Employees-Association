import { SkeletonCard } from '@/components/skeleton-card';
import { Label } from '@/components/ui/label';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Contributions, type User } from '@/types';
import { Head } from '@inertiajs/react';
import UnpaidMonthlyDuesComponent from './components/unpaid-monthly-dues-component';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('employee.dashboard'),
    },
];
interface UnpaidProps {
    auth: {
        user: User;
    };
    pendingContributions: Contributions[];
    year: number;
}

export default function Unpaid({ auth, pendingContributions, year }: UnpaidProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Unpaid Dues" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div>
                        <div className="mb-2 flex flex-col gap-1">
                            <Label className="text-sm font-bold text-gray-500">List of Unpaid Monthly Dues</Label>
                        </div>
                        <UnpaidMonthlyDuesComponent pendingContributions={pendingContributions} year={year} />
                    </div>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
