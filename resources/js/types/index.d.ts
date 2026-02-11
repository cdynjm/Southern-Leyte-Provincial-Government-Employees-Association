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
    offices?: Offices;
    name: string;
    position: string;
    contactNumber: string;
    startDate: string;
    endDate: string;
    employeeID: string;
    birthDate: string;
    employmentType: string;
    email: string;
    totalContribution: number;
    role: string;
    specialAccount: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
    contributions: Contributions[];
    loantracker:? LoanTracker;
} 

export interface Employees {
    id: number;
    office?: Offices;
    encrypted_id: string;
    officeEncrypted_id: string;
    name: string;
    position: string;
    contactNumber: string;
    startDate: string;
    endDate: string;
    employeeID: string;
    birthDate: string;
    employmentType: string;
    email: string;
    totalContribution: number;
    role: string;
    specialAccount: string;
    created_at: string;
    contributions?: Contributions[];
    loantracker:? LoanTracker;
}

export interface Contributions {
    id: number;
    encrypted_id: string;
    users_id: number;
    contribution_types_id: number;
    year: number;
    month: number;
    amount: number;
    created_at: string;
    updated_at: string;
    employee?: Employees;
    contributiontype?: ContributionTypes;
}

export interface ContributionTypes {
    id: number;
    encrypted_id: string;
    financialAccountEncrypted_id: string;
    financialaccount?: FinancialAccount;
    description: string;
    contributions?: Contributions[];
}

export interface Offices {
    id: number;
    user?: User[];
    encrypted_id: string;
    officeName: string;
    created_at: string;
    updated_at: string;
}

export interface FinancialAccount {
    id: number;
    encrypted_id: string;
    name: string;
    balance: number;
    created_at: string;
    updated_at: string;
}

export interface LoanTracker {
    id: number;
    encrypted_id: string;
    users_id: number;
    tracker: string;
    description: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface LoanAmortization {
    id: number;
    encrypted_id: string;
    user?: User;
    loaninstallment?: LoanInstallment[];
    tracker: string;
    borrowed: number;
    processingFee: number;
    netProceeds: number;
    periodInMonths: number;
    rateInMonth: number;
    monthlyInstallment: number;
    date: string;
    status: string;
}

export interface LoanInstallment {
    id: number;
    encrypted_id: string;
    user?: User;
    loanamortization?: LoanAmortization;
    date: string;
    installment: number;
    interest: number;
    principal: number;
    endingBalance: number;
    status: string;
}
export interface ContributionGroup {
    type: ContributionTypes;
    contributions: Paginated<Contributions>;
}
export interface ContributionRow {
    contributionTypes?: string;
    year?: string;
    month?: string[];
    amount?: number;
}

