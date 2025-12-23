import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

function cleanPath(path: string): string {
    try {
        const u = new URL(path, 'http://dummy.test');
        return u.pathname.replace(/\/+$/, '') || '/';
    } catch {
        return path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
    }
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const currentPath = cleanPath(page.url);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const itemPath = item.href ? cleanPath(item.href) : '';
                    const isActive = item.href && (currentPath === itemPath || currentPath.startsWith(itemPath + '/'));

                    // 🔹 PARENT WITH SUB MENUS (NOW COLLAPSIBLE)
                    if (item.children && item.children.length > 0) {
                        const isChildActive = item.children.some((child) => {
                            const childPath = cleanPath(child.href);
                            return currentPath === childPath || currentPath.startsWith(childPath + '/');
                        });

                        return (
                            <Collapsible key={item.title} defaultOpen={true} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton isActive={isChildActive} tooltip={{ children: item.title }}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                </SidebarMenuItem>

                                <CollapsibleContent>
                                    <div className="mt-1 ml-6 space-y-1">
                                        {item.children.map((child) => {
                                            const childPath = cleanPath(child.href);
                                            const isChildItemActive = currentPath === childPath || currentPath.startsWith(childPath + '/');

                                            return (
                                                <SidebarMenuItem key={child.title}>
                                                    <SidebarMenuButton asChild size="sm" isActive={isChildItemActive}>
                                                        <Link href={child.href} prefetch className="flex items-center gap-2">
                                                            {child.icon && <child.icon className="h-4 w-4 text-gray-500" />}
                                                            <span>{child.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    }

                    // 🔹 NORMAL MENU ITEM (UNCHANGED BEHAVIOR)
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isActive || false} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
