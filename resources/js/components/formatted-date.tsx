export interface FormattedDateProps {
    date: string | Date;
    endDate?: string | Date; // optional, used for date-range variant
    variant?: 'datetime' | 'date' | 'age' | 'month-year' | 'date-range';
}

export default function FormattedDate({ date, endDate, variant = 'datetime' }: FormattedDateProps) {
    const d = new Date(date);

    // AGE CALCULATION
    if (variant === 'age') {
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();

        const hasHadBirthdayThisYear =
            today.getMonth() > d.getMonth() ||
            (today.getMonth() === d.getMonth() && today.getDate() >= d.getDate());

        if (!hasHadBirthdayThisYear) age--;

        return (
            <>
                {age >= 58 ? (
                    <div className="text-red-600">{age}</div>
                ) : (
                    <div>{age}</div>
                )}
            </>
        );
    }

    // MONTH-YEAR
    if (variant === 'month-year') {
        const month = d.toLocaleString(undefined, { month: 'short' });
        const year = d.toLocaleString(undefined, { year: 'numeric' });

        return <>{`${month} - ${year}`}</>;
    }

    // DATE RANGE
    if (variant === 'date-range' && endDate) {
        const d2 = new Date(endDate);

        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        };

        return <>{`${d.toLocaleDateString(undefined, options)} - ${d2.toLocaleDateString(undefined, options)}`}</>;
    }

    // DEFAULT OPTIONS
    const options: Intl.DateTimeFormatOptions =
        variant === 'date'
            ? {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
              }
            : {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
              };

    return <>{d.toLocaleString(undefined, options)}</>;
}
