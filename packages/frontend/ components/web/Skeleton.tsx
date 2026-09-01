interface SkeletonProps {
    count?: number;
    className?: string;
}

export function Skeleton({ count = 1, className = '' }: SkeletonProps) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`h-4 animate-pulse rounded bg-neutral-500 dark:bg-slate-800 ${className}`}
                />
            ))}
        </div>
    );
}