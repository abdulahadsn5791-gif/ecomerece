import { Loader2 } from 'lucide-react';

interface InlineSpinnerProps {
    size?: number;
    className?: string;
}

export function InlineSpinner({ size = 16, className = '' }: InlineSpinnerProps) {
    return (
        <Loader2
            style={{ width: size, height: size }}
            className={`animate-spin text-slate-400 ${className}`}
        />
    );
}