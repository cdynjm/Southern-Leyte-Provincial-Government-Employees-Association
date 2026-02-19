import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    CreditCard,
    FileText,
    FolderIcon,
    HandCoins,
    LayoutGrid,
    UsersIcon,
    Wallet2Icon,
    BriefcaseBusiness,
    Landmark,
    PhilippinePeso,
    Navigation,
    BanknoteIcon,
    UserCog,
} from 'lucide-react';
import AppLogo from './app-logo';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'employee';
}

interface PageProps {
    auth: {
        user: AuthUser;
    };
    [key: string]: unknown;
}

// admin nav
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Employees',
        href: route('admin.employees'),
        icon: UsersIcon,
    },
    {
        title: 'Offices',
        href: route('admin.offices'),
        icon: BriefcaseBusiness,
    },
    {
        title: 'Admins',
        href: route('admin.admins'),
        icon: UserCog,
    },
    {
        title: 'Financial Account',
        href: route('admin.financial-account'),
        icon: Landmark,
    },
    {
        title: 'Contributions',
        icon: Wallet2Icon,
        href: '',
        children: [
            {
                title: 'Employee Contributions',
                icon: Wallet2Icon,
                href: route('admin.contributions'),
            },
            {
                title: 'Contribution Types',
                icon: HandCoins,
                href: route('admin.contribution-types'),
            },
        ],
    },
    {
        title: 'Loans',
        icon: PhilippinePeso,
        href: '',
        children: [
            {
                title: 'Loans',
                icon: BanknoteIcon,
                href: route('admin.loans'),
            },
            {
                title: 'Loan Tracker',
                icon: Navigation,
                href: route('admin.loan-tracker'),
            },
        ],
    },
    {
        title: 'Reports',
        icon: FolderIcon,
        href: '',
        children: [
            {
                title: 'Generate Report',
                icon: FileText,
                href: '',
            },
        ],
    },
    {
        title: 'Withdrawals',
        icon: CreditCard,
        href: ''
    }
];

// employee nav
const employeeNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('employee.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Your Loans',
        icon: PhilippinePeso,
        href: route('employee.loans'),
    },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;

    const navItems: NavItem[] =
        auth.user.role === 'admin'
            ? adminNavItems
            : employeeNavItems;

    const dashboardRoute =
        auth.user.role === 'admin'
            ? route('admin.dashboard')
            : route('employee.dashboard');

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-r-gray-100">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardRoute} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
