import { SkeletonCard } from '@/components/skeleton-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type FinancialAccount, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { Landmark, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: route('admin.dashboard') }];

interface DashboardProps {
    auth: { user: User };
    regulars: number;
    joborders: number;
    balance: number;
    financialAccount: FinancialAccount[];
}

export default function Dashboard({ auth, regulars, joborders, financialAccount }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    {/* Other dashboard cards */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
                        {/* Regulars */}
                        <Card className="relative border bg-white shadow-sm hover:shadow-md">
                            <CardContent className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Regulars</p>
                                    <h2 className="mt-1 text-2xl font-bold text-gray-900">{regulars}</h2>
                                    <p className="mt-1 text-[13px] text-gray-500">Total Employees</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Job Orders */}
                        <Card className="relative border bg-white shadow-sm hover:shadow-md">
                            <CardContent className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Job Orders</p>
                                    <h2 className="mt-1 text-2xl font-bold text-gray-900">{joborders}</h2>
                                    <p className="mt-1 text-[13px] text-gray-500">Total Employees</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/10">
                                    <Users className="h-6 w-6 text-red-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="relative overflow-hidden rounded-md border-none shadow-none">
                        <div className="pointer-events-none absolute top-1/2 left-[-100px] -translate-y-1/2 opacity-[0.05]">
                            <img src="/img/province-logo-official.png" alt="SOLEPGEA" className="w-[450px] max-w-none select-none" />
                        </div>

                        {/* Right overlay logo */}
                        <div className="pointer-events-none absolute top-1/2 right-[-100px] -translate-y-1/2 opacity-[0.05]">
                            <img src="/img/solepgea-logo.png" alt="SOLEPGEA" className="w-[450px] max-w-none select-none" />
                        </div>

                        {financialAccount.length === 0 ? (
                            <div className="py-10 text-center text-sm text-muted-foreground">No Data Found</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {financialAccount.map((fa, index) => (
                                    <Card key={fa.encrypted_id} className="rounded-2xl shadow-sm transition-all hover:shadow-md">
                                        <CardHeader className="flex flex-row items-start justify-between">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-2">Account #{index + 1}</p>
                                                <CardTitle className="text-lg font-semibold">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <Landmark className="shrink-0 text-green-600" />
                                                        <span className="flex-1 truncate text-sm">{fa.name}</span>
                                                    </div>
                                                </CardTitle>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="mt-0">
                                                <p className="text-xs text-muted-foreground">Available Balance</p>

                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="text-2xl font-bold tracking-tight">
                                                        ₱{' '}
                                                        {Number(fa.balance).toLocaleString('en-PH', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>

                                                    <Badge variant="secondary">SOLEPGEA</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
