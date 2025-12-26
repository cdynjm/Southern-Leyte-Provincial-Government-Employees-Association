interface MonthLabelProps {
    month: number | string;
    short?: boolean; // Jan vs January
}

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export function MonthLabel({ month, short = false }: MonthLabelProps) {
    const index = Number(month) - 1;

    if (isNaN(index) || index < 0 || index > 11) {
        return;
    }

    const label = MONTHS[index];

    return (
        <span>
            {short ? label.slice(0, 3) : label}
        </span>
    );
}
