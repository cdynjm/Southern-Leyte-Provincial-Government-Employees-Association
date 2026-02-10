import { useEffect, useState } from 'react';

interface SkeletonDelayProps {
    delay?: number;
    skeleton: React.ReactNode;
    children: React.ReactNode;
}

export function SkeletonDelay({
    delay = 1000,
    skeleton,
    children,
}: SkeletonDelayProps) {
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return <>{showSkeleton ? skeleton : children}</>;
}
