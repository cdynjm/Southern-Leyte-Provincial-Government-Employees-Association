import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BanknoteIcon,
    BriefcaseBusiness,
    FileText,
    FolderIcon,
    HandCoins,
    Landmark,
    LayoutGrid,
    LogsIcon,
    Navigation,
    PhilippinePeso,
    UserCog,
    UsersIcon,
    Wallet2Icon,
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
        permissions: string[];
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
        permission: 'employees',
    },
    {
        title: 'Offices',
        href: route('admin.offices'),
        icon: BriefcaseBusiness,
        permission: 'offices',
    },
    {
        title: 'Admins',
        href: route('admin.admins'),
        icon: UserCog,
        permission: 'admins',
    },
    {
        title: 'Financial Account',
        href: route('admin.financial-account'),
        icon: Landmark,
        permission: 'financial-accounts',
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
                permission: 'contributions',
            },
            {
                title: 'Contribution Types',
                icon: HandCoins,
                href: route('admin.contribution-types'),
                permission: 'contributions-types',
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
                permission: 'loans',
            },
            {
                title: 'Loan Tracker',
                icon: Navigation,
                href: route('admin.loan-tracker'),
                permission: 'loans',
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
        title: 'Logs',
        icon: LogsIcon,
        href: route('admin.logs'),
        permission: 'logs',
    },
];

// employee nav (UNCHANGED)
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
    {
        title: 'Unpaid Contribution',
        icon: Wallet2Icon,
        href: route('employee.unpaid'),
    },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;

    const permissions = auth.permissions || [];

    // filter admin sidebar based on permissions
    const filteredAdminNavItems: NavItem[] = adminNavItems
        .map((item) => {
            if (!item.children) return item;

            const children = item.children.filter((child: NavItem) =>
                child.permission && permissions.includes(child.permission)
            );

            return { ...item, children };
        })
        .filter((item: NavItem) => {
            if (item.permission) {
                return permissions.includes(item.permission);
            }

            if (item.children) {
                return item.children.length > 0;
            }

            return true;
        });

    const navItems: NavItem[] =
        auth.user.role === 'admin'
            ? filteredAdminNavItems
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