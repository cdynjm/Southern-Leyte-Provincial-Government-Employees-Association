interface FormattedDateProps {
    date: string | Date;
    variant?: 'datetime' | 'date';
}

export default function FormattedDate({
    date,
    variant = 'datetime',
}: FormattedDateProps) {
    const d = new Date(date);

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
