
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head } from '@inertiajs/react';;
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: route('admin.dashboard') }];

interface LoanTrackerProps {
    auth: { user: User }
}

export default function LoanTracker({ auth}: LoanTrackerProps) {
   

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Loan Tracker" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
            </div>
        </AppLayout>
    );
}
