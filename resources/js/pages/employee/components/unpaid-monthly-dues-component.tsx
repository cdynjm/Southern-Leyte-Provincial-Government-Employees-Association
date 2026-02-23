import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Contributions } from '@/types';

interface UnpaidMonthlyDuesComponentProps {
    pendingContributions: Contributions[];
    year: number;
}

export default function UnpaidMonthlyDuesComponent({ pendingContributions, year }: UnpaidMonthlyDuesComponentProps) {
    const currentYear = new Date().getFullYear();
    const startYear = Number(year);

    const contributionSet = new Set(pendingContributions.map((c) => `${c.year}-${String(c.month).padStart(2, '0')}`));

    const unpaidMonths: { year: number; month: string }[] = [];

    for (let year = startYear; year <= currentYear; year++) {
        for (let month = 1; month <= 12; month++) {
            const formattedMonth = String(month).padStart(2, '0');
            const key = `${year}-${formattedMonth}`;

            if (!contributionSet.has(key)) {
                unpaidMonths.push({
                    year,
                    month: formattedMonth,
                });
            }
        }
    }

    const groupedUnpaidMonths = unpaidMonths.reduce<Record<number, typeof unpaidMonths>>((acc, item) => {
        if (!acc[item.year]) {
            acc[item.year] = [];
        }
        acc[item.year].push(item);
        return acc;
    }, {});

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-start">Month</TableHead>
                        <TableHead className="text-start">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {unpaidMonths.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="py-[6px] text-start text-muted-foreground">
                                No unpaid months
                            </TableCell>
                        </TableRow>
                    ) : (
                        Object.entries(groupedUnpaidMonths).map(([year, months]) => (
                            <>
                                {/* Year Group Header */}
                                <TableRow key={`year-${year}`} className="bg-muted">
                                    <TableCell colSpan={3} className="py-[6px] text-start font-semibold">
                                        Year {year}
                                    </TableCell>
                                </TableRow>

                                {/* Months under the year */}
                                {months.map((item) => (
                                    <TableRow key={`${item.year}-${item.month}`}>
                                        <TableCell className="py-[6px] text-start">
                                            {new Date(item.year, Number(item.month) - 1).toLocaleString('en-PH', {
                                                month: 'long',
                                            })}
                                        </TableCell>

                                        <TableCell className="py-[6px] text-start">
                                            <Badge variant="destructive" className="text-[11px]">
                                                Unpaid
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    );
}
