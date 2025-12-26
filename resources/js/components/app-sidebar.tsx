import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FileText, FolderIcon, HandCoins, LayoutGrid, UsersIcon, Wallet2Icon } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
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
            }
        ]
       
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
        ]
    }
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className='border-r border-r-gray-100'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
