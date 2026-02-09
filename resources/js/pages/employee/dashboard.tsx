
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employees, type User, type Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import LoanEncoder from './special-account/loan-encoder';
import LoanOfficer from './special-account/loan-officer';
import { FolderPen } from 'lucide-react';

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
                <div className="flex flex-col">
                    

                    {auth.user.specialAccount == 'Loan Encoder' && (
                        <>
                            <Label className='font-bold text-sm text-uppercase text-gray-500 flex items-center gap-2 mb-2'>
                                <FolderPen className='mb-1 text-blue-500 w-5'/>
                                <span>{auth.user.specialAccount}</span>
                                </Label>
                           
                            <LoanEncoder 
                            employees={employees}
                            search={search}
                             />
                        </>
                    )}

                    {auth.user.specialAccount == 'Loan Officer' && (
                        <>
                             <Label className='font-bold text-sm text-uppercase text-gray-500 flex items-center gap-2'>
                                <FolderPen className='mb-1 text-blue-500 w-5'/>
                                <span>{auth.user.specialAccount}</span>
                                </Label>
                            <hr />
                            <LoanOfficer auth={auth} />
                        </>
                    )}
                </div>
                <div></div>
            </div>
        </AppLayout>
    );
}
