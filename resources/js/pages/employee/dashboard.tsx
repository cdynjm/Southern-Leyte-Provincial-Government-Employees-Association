import { SkeletonCard } from '@/components/skeleton-card';
import { Label } from '@/components/ui/label';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employees, type Paginated, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { FolderPen } from 'lucide-react';
import LoanEncoder from './special-account/loan-encoder';
import LoanOfficer from './special-account/loan-officer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('employee.dashboard'),
    },
];
interface DashboardProps {
    auth: {
        user: User;
    };
    employees: Paginated<Employees>;
    search: string;
}

export default function Dashboard({ auth, employees, search }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div className="flex flex-col">
                        {auth.user.specialAccount == 'Loan Encoder' && (
                            <>
                                <Label className="text-uppercase mb-2 flex items-center gap-2 text-sm font-bold text-gray-500">
                                    <FolderPen className="mb-[3px] w-5 text-red-500" />
                                    <span>{auth.user.specialAccount}</span> |{' '}
                                    <span className="font-normal">
                                        Tracker # {auth.user.loantracker?.tracker}{' '}
                                        <span className="ms-1 font-bold text-blue-600">{auth.user.loantracker?.description}</span>
                                    </span>
                                </Label>

                                <LoanEncoder employees={employees} search={search} />
                            </>
                        )}

                        {auth.user.specialAccount == 'Loan Officer' && (
                            <>
                                <Label className="text-uppercase flex items-center gap-2 text-sm font-bold text-gray-500">
                                    <FolderPen className="mb-[3px] w-5 text-green-500" />
                                    <span>{auth.user.specialAccount}</span> |{' '}
                                    <span className="font-normal">
                                        Tracker # {auth.user.loantracker?.tracker}{' '}
                                        <span className="ms-1 font-bold text-blue-600">{auth.user.loantracker?.description}</span>
                                    </span>
                                </Label>
                                <hr />
                                <LoanOfficer auth={auth} />
                            </>
                        )}
                    </div>
                    <div></div>
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
