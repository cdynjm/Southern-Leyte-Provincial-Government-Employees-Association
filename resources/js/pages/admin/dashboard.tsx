import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard')
    },
];
interface DashboardProps {
    auth: {
        user: User;
    }
}

export default function Dashboard({ auth }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 xl:grid-cols-4">
                    {/* Total Sales (Yearly) */}
                    <Card className="rounded-xl border bg-white shadow-none border-b-3 border-b-primary">
                        <CardHeader>
                            <CardTitle className="text-md font-semibold text-primary">Employees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                0 
                            </div>
                            <p className="mt-1 text-gray-500 text-[13px]"> Total Employees</p>
                        </CardContent>
                    </Card>

                    {/* Total Items Sold (Yearly) */}
                    <Card className="rounded-xl border bg-white shadow-none border-b-3 border-b-green-600">
                        <CardHeader>
                            <CardTitle className="text-md font-semibold text-primary">Current Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₱0</div>
                            <p className="mt-1 text-gray-500 text-[13px]">Total Current Balance</p>
                        </CardContent>
                    </Card>

                    {/* Monthly Sales */}
                    <Card className="rounded-xl border bg-white shadow-none border-b-3 border-b-orange-400">
                        <CardHeader>
                            <CardTitle className="text-md font-semibold text-primary">Monthly Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₱ </div>
                            <p className="mt-1 text-gray-500 text-[13px]">
                                
                            </p>
                        </CardContent>
                    </Card>

                    {/* Monthly Items Sold */}
                    <Card className="rounded-xl border bg-white shadow-none border-b-3 border-b-blue-500">
                        <CardHeader>
                            <CardTitle className="text-md font-semibold text-primary">Monthly Items Sold</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"></div>
                            <p className="mt-1 text-gray-500 text-[13px]">
                                Items sold in 
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
