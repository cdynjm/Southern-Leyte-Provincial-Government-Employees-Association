import { SkeletonCard } from '@/components/skeleton-card';
import { Label } from '@/components/ui/label';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type LoanAmortization, type Paginated, type User } from '@/types';
import { Head } from '@inertiajs/react';
import LoansComponent from './components/loans-component';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Loans',
        href: route('employee.loans'),
    },
];
interface LoanProps {
    auth: {
        user: User;
    };
    search: string;
    borrowers: Paginated<LoanAmortization>;
}

export default function Loans({ borrowers, auth }: LoanProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div className="flex flex-col">
                        <div className="mb-4 grid grid-cols-1 items-center gap-3 lg:grid-cols-2">
                            <div>
                                <Label className="text-sm font-bold text-gray-500">List of Loans</Label>
                            </div>
                        </div>
                        <LoansComponent borrowers={borrowers} auth={auth} />
                    </div>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
