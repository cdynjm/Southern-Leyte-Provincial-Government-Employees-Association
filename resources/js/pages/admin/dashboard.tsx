import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
];
interface DashboardProps {
    auth: {
        user: User;
    };
    employees: number;
}

export default function Dashboard({ auth, employees }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
                    <Card className="relative border bg-white shadow-none">
                        <CardContent className="flex items-center justify-between">
                            {/* Left content */}
                            <div>
                                <p className="text-sm font-medium text-gray-500">Employees</p>
                                <h2 className="mt-1 text-2xl font-bold text-gray-900">{employees}</h2>
                                <p className="mt-1 text-[13px] text-gray-500">Total Employees</p>
                            </div>

                            {/* Right icon */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative border bg-white shadow-none">
                        <CardContent className="flex items-center justify-between">
                            {/* Left content */}
                            <div>
                                <p className="text-sm font-medium text-gray-500">Current Balance</p>
                                <h2 className="mt-1 text-2xl font-bold text-gray-900">₱0</h2>
                                <p className="mt-1 text-[13px] text-gray-500">Total Current Balance</p>
                            </div>

                            {/* Right icon */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600/10">
                                <Wallet className="h-6 w-6 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
