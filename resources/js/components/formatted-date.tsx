interface FormattedDateProps {
    date: string | Date;
    variant?: 'datetime' | 'date' | 'age' | 'month-year';
}

export default function FormattedDate({ date, variant = 'datetime' }: FormattedDateProps) {
    const d = new Date(date);

    // AGE CALCULATION
    if (variant === 'age') {
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();

        const hasHadBirthdayThisYear =
            today.getMonth() > d.getMonth() ||
            (today.getMonth() === d.getMonth() && today.getDate() >= d.getDate());

        if (!hasHadBirthdayThisYear) {
            age--;
        }

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
    if (variant === 'month-year') {
        const month = d.toLocaleString(undefined, { month: 'short' });
        const year = d.toLocaleString(undefined, { year: 'numeric' });

        return <>{`${month} - ${year}`}</>;
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
