import FormattedDate from '@/components/formatted-date';
import Pagination from '@/components/pagination';
import { SkeletonCard } from '@/components/skeleton-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Logs, type Paginated, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { EraserIcon, LoaderCircle, SearchIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Logs',
        href: route('admin.logs'),
    },
];
interface LogsProps {
    auth: {
        user: User;
    };
    logs: Paginated<Logs>;
    year: string;
}

export default function Employees({ auth, logs, year }: LogsProps) {
    const searchLogsForm = useForm({
        year: year || '',
    });

    const clearLogsForm = useForm({
        year: '',
    });

    const searchLogs = () => {
        searchLogsForm.post(route('admin.logs.search'));
    };

    const clearSearch = () => {
        clearLogsForm.post(route('admin.logs.clear-search'), {
            onSuccess: () => {
                searchLogsForm.setData('year', searchLogsForm.data.year);
            },
        });
    };

    const START_YEAR = 2025;
    const latestYear = new Date().getFullYear();
    const safeLatestYear = Math.max(latestYear, START_YEAR);
    const years = Array.from({ length: safeLatestYear - START_YEAR + 1 }, (_, i) => START_YEAR + i);

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div className="flex items-center justify-between gap-4">
                        {/* Left Title */}
                        <div>
                            <Label className="text-sm font-bold text-gray-500">List of Logs</Label>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-2">
                            {/* Clear Button */}
                            {searchLogsForm.data.year && (
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    onClick={clearSearch}
                                    disabled={searchLogsForm.processing}
                                    className="text-red-600"
                                >
                                    {clearLogsForm.processing ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <EraserIcon className="h-4 w-4" />
                                    )}
                                </Button>
                            )}

                            {/* Select */}
                            <Select value={searchLogsForm.data.year?.toString()} onValueChange={(value) => searchLogsForm.setData('year', value)}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>

                                <SelectContent>
                                    {years.map((yr) => (
                                        <SelectItem key={yr} value={String(yr)}>
                                            {yr}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Search Button */}
                            <Button size="icon" onClick={searchLogs} disabled={searchLogsForm.processing}>
                                {searchLogsForm.processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="">
                                <TableHead className="w-[50px] text-center">#</TableHead>
                                <TableHead className="text-start text-nowrap">Description</TableHead>
                                <TableHead className="text-center text-nowrap">Processed By</TableHead>
                                <TableHead className="text-center text-nowrap">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {/* 👥 Normal Accounts */}
                                    {logs.data.map((lg, index) => (
                                        <TableRow key={lg.encrypted_id}>
                                            <TableCell className="py-[6px] text-center">
                                                {index + 1 + (logs.current_page - 1) * logs.per_page}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-wrap">
                                                <p className="text-[13px]">{lg.description}</p>
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">
                                                <p className="text-[13px]">{lg.name}</p>
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                                <p className="text-[13px]">{lg.created_at ? <FormattedDate date={lg.created_at} /> : '-'}</p>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination links={logs.links} />
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
