import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Contributions, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { CreditCardIcon, Users } from 'lucide-react';
import { useEffect } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('admin.dashboard') },
];

interface DashboardProps {
    auth: { user: User };
    regulars: number;
    joborders: number;
    contributions: Contributions[];
    balance: number;
}

export default function Dashboard({ auth, regulars, joborders, contributions, balance }: DashboardProps) {
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        setFlipped(true);
        const timeout = setTimeout(() => setFlipped(false), 500);
        return () => clearTimeout(timeout);
    }, []);

    const handleCardClick = () => {
        setFlipped(true);
        setTimeout(() => setFlipped(false), 500);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Flip card with shine */}
                <div className="flex justify-center perspective" onClick={handleCardClick}>
                    <Card
                        className={`relative w-full max-w-[400px] p-3 overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 text-white shadow-none
                        transition-transform duration-1000 ${flipped ? 'rotate-y-180' : ''}`}
                    >
                        {/* Right-side overlayed SOLEPGEA Logo */}
                        <div className="pointer-events-none absolute top-1/2 right-[-50px] -translate-y-1/2 overflow-hidden">
                            <img
                                src="/img/solepgea-logo.png"
                                alt="SOLEPGEA Logo"
                                className="max-w-[350px] object-contain opacity-10 select-none"
                            />
                        </div>

                        {/* Light shine */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_40%)]" />
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <div className="animate-card-glow absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.15),transparent)]" />
                        </div>

                        <CardContent className="relative flex flex-col gap-6 p-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm tracking-widest text-gray-300 uppercase">Savings</p>

                                <div className="flex h-8 w-12 flex-col items-center justify-center gap-[2px] rounded-md bg-gradient-to-br from-yellow-400 to-yellow-500 opacity-90">
                                    <span className="h-[2px] w-8 rounded bg-yellow-100" />
                                    <span className="h-[2px] w-6 rounded bg-yellow-100" />
                                    <span className="h-[2px] w-8 rounded bg-yellow-100" />
                                </div>
                            </div>

                            {/* Balance */}
                            <h2 className="text-3xl font-bold tracking-tight">
                                ₱
                                {Number(balance).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h2>

                            {/* Bottom row */}
                            <div className="flex items-center justify-between pt-4">
                                <div>
                                    <p className="text-xs text-gray-400">Available Funds</p>
                                    <p className="text-sm font-medium">SOLEPGEA</p>
                                </div>

                                <Button size="sm" className="text-[12px]">
                                    <CreditCardIcon /> Withdraw
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

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

                {/* Contributions */}
                <div className="grid grid-cols-1 gap-4">
                    {contributions.map((c) => (
                        <Item key={c.id} variant="outline">
                            <ItemContent>
                                <ItemTitle>{c.contributiontype?.description}</ItemTitle>
                                <ItemDescription className="text-[13px]">Contribution Type</ItemDescription>
                            </ItemContent>
                            <ItemActions className="flex flex-col items-end">
                                <h5 className="text-[13px] font-bold">
                                    ₱{' '}
                                    {Number(c.amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h5>
                                <ItemDescription className="text-[12px]">Total</ItemDescription>
                            </ItemActions>
                        </Item>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
