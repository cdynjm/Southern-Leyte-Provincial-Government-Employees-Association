import { SkeletonCard } from '@/components/skeleton-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type FinancialAccount, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { CreditCardIcon, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: route('admin.dashboard') }];

interface DashboardProps {
    auth: { user: User };
    regulars: number;
    joborders: number;
    balance: number;
    financialAccount: FinancialAccount[];
}

export default function Dashboard({ auth, regulars, joborders, financialAccount }: DashboardProps) {
    const [flipped, setFlipped] = useState(false);

    const handleCardClick = () => {
        setFlipped(true);
        setTimeout(() => setFlipped(false), 1000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    {/* Other dashboard cards */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
                        {/* Regulars */}
                        <Card className="relative border bg-white shadow-none">
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
                        <Card className="relative border bg-white shadow-none">
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
                        <div className="pointer-events-none absolute top-1/2 left-[-100px] -translate-y-1/2 opacity-[0.07]">
                            <img src="/img/province-logo-official.png" alt="SOLEPGEA" className="w-[450px] max-w-none select-none" />
                        </div>

                        {/* Right overlay logo */}
                        <div className="pointer-events-none absolute top-1/2 right-[-100px] -translate-y-1/2 opacity-[0.07]">
                            <img src="/img/solepgea-logo.png" alt="SOLEPGEA" className="w-[450px] max-w-none select-none" />
                        </div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                            {financialAccount.map((account) => (
                                <CardContent>
                                    <div className="perspective flex justify-center" onClick={handleCardClick}>
                                        <Card
                                            className={`relative w-full max-w-[450px] overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 p-3 text-white shadow-none transition-transform duration-1000 ${flipped ? 'rotate-y-180' : ''}`}
                                        >
                                            {/* Right-side overlayed SOLEPGEA Logo */}
                                            <div className="pointer-events-none absolute top-1/2 right-[-50px] -translate-y-1/2 overflow-hidden">
                                                <img
                                                    src="/img/solepgea-logo.png"
                                                    alt="SOLEPGEA Logo"
                                                    className="max-w-[350px] object-contain opacity-10 select-none"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_45%)]" />

                                            {/* Premium glossy diagonal sweep */}
                                            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                                <div className="glossy-sweep absolute inset-[-60%]" />
                                            </div>

                                            <CardContent className="relative flex flex-col gap-6 p-6">
                                                <div className="flex items-center justify-between gap-4">
                                                    <p className="text-sm text-gray-300 uppercase">{account.name}</p>

                                                    <div className="relative h-9 w-14 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-500 to-amber-500 shadow-inner">
                                                        {/* Inner border */}
                                                        <div className="absolute inset-[2px] rounded-[4px] border border-yellow-200/70" />

                                                        {/* Horizontal lines */}
                                                        <div className="absolute top-[30%] right-2 left-2 h-[2px] bg-yellow-100/50" />
                                                        <div className="absolute top-[50%] right-3 left-2 h-[2px] bg-yellow-100/50" />
                                                        <div className="absolute top-[70%] right-2 left-2 h-[2px] bg-yellow-100/50" />

                                                        {/* Vertical line */}
                                                        <div className="absolute top-2 bottom-2 left-[45%] w-[2px] bg-yellow-100/50" />

                                                        {/* Subtle shine */}
                                                        <div className="absolute inset-0 rounded-md bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_55%)]" />
                                                    </div>
                                                </div>

                                                {/* Balance */}
                                                <h2 className="text-3xl font-bold tracking-tight">
                                                    ₱
                                                    {Number(account.balance).toLocaleString('en-PH', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </h2>

                                                {/* Bottom row */}
                                                <div className="flex items-center justify-between pt-4">
                                                    <div>
                                                        <p className="text-xs text-gray-400">Available Funds</p>
                                                        <p className="text-sm font-medium">Financial Account</p>
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        className="text-[12px]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <CreditCardIcon /> SOLEPGEA
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            ))}
                        </div>
                    </Card>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
