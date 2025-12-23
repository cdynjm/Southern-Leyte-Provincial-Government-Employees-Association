import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
    contributions: Contributions[];
}

export interface Employees {
    id: number;
    encrypted_id: string;
    name: string;
    position: string;
    email: string;
    totalContribution: number;
    created_at: string;
    contributions?: Contributions[];
}

export interface Contributions {
    id: number;
    encrypted_id: string;
    user_id: number;
    year: number;
    month: number;
    amount: number;
    created_at: string;
    updated_at: string;
    employee?: Employees;
}

export interface ContributionRow {
    year?: string;
    month?: string;
    amount?: number;
}

