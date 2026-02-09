
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head } from '@inertiajs/react';


interface DashboardProps {
    auth: {
        user: User;
    };
    encrypted_id: string;
}

export default function Dashboard({ auth, encrypted_id }: DashboardProps) {

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
                <div className="flex flex-col">
            
                </div>
            </div>
        </AppLayout>
    );
}
