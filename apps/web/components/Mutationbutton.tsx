import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from '@ecomerece/frontend';



export type ButtonVariant =
    | 'primary'
    | 'danger'
    | 'warning'
    | 'info'
    | 'success'
    | 'confirm'
    | 'neutral';

export type ButtonStyleType = 'solid' | 'outline' | 'ghost' | 'soft';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type LoaderVariant = 'spinner' | 'dots' | 'bars' | 'pulse';

// ─── Color config (mirrors VARIANT_STYLES in GenericConfirmModal) ───────────

interface VariantColorSet {
    solid: string;
    outline: string;
    ghost: string;
    soft: { light: string; dark: string };
    ring: string;
}

const VARIANT_COLORS: Record<ButtonVariant, VariantColorSet> = {
    primary: {
        solid: 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900',
        outline:
            'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white dark:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900',
        ghost: 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800',
        soft: {
            light: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
            dark: 'bg-gray-800 hover:bg-gray-700 text-gray-100',
        },
        ring: 'focus-visible:ring-gray-500',
    },
    danger: {
        solid: 'bg-red-600 hover:bg-red-700 text-white',
        outline:
            'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white',
        ghost: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30',
        soft: {
            light: 'bg-red-100 hover:bg-red-200 text-red-700',
            dark: 'bg-red-900/30 hover:bg-red-900/50 text-red-300',
        },
        ring: 'focus-visible:ring-red-500',
    },
    warning: {
        solid: 'bg-amber-500 hover:bg-amber-600 text-white',
        outline:
            'border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white',
        ghost: 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30',
        soft: {
            light: 'bg-amber-100 hover:bg-amber-200 text-amber-700',
            dark: 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-300',
        },
        ring: 'focus-visible:ring-amber-400',
    },
    info: {
        solid: 'bg-blue-600 hover:bg-blue-700 text-white',
        outline:
            'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white',
        ghost: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30',
        soft: {
            light: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
            dark: 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-300',
        },
        ring: 'focus-visible:ring-blue-500',
    },
    success: {
        solid: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        outline:
            'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white',
        ghost: 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30',
        soft: {
            light: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700',
            dark: 'bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-300',
        },
        ring: 'focus-visible:ring-emerald-500',
    },
    confirm: {
        solid: 'bg-violet-600 hover:bg-violet-700 text-white',
        outline:
            'border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-500 dark:hover:text-white',
        ghost: 'text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/30',
        soft: {
            light: 'bg-violet-100 hover:bg-violet-200 text-violet-700',
            dark: 'bg-violet-900/30 hover:bg-violet-900/50 text-violet-300',
        },
        ring: 'focus-visible:ring-violet-500',
    },
    neutral: {
        solid: 'bg-gray-500 hover:bg-gray-600 text-white',
        outline:
            'border-2 border-gray-400 text-gray-600 hover:bg-gray-500 hover:text-white dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white',
        ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
        soft: {
            light: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
            dark: 'bg-gray-800 hover:bg-gray-700 text-gray-300',
        },
        ring: 'focus-visible:ring-gray-400',
    },
};

// ─── Size config ──────────────────────────────────────────────────────────────

interface SizeConfig {
    padding: string;
    text: string;
    iconSize: number;
    gap: string;
}

const SIZE_STYLES: Record<ButtonSize, SizeConfig> = {
    sm: { padding: 'px-3 py-2', text: 'text-xs', iconSize: 14, gap: 'gap-1.5' },
    md: { padding: 'px-4 py-3', text: 'text-sm', iconSize: 16, gap: 'gap-2' },
    lg: { padding: 'px-6 py-3.5', text: 'text-base', iconSize: 18, gap: 'gap-2' },
};

// ─── Loader variants ────────────────────────────────────────────────────────
// Each loader uses `currentColor` (via bg-current / text-current) so it always
// matches the button's text color, whatever the variant/styleType combo is.

function SpinnerLoader({ size }: { size: number }) {
    return <Loader2 style={{ width: size, height: size }} className="animate-spin" />;
}

function DotsLoader({ size }: { size: number }) {
    const dot = Math.max(3, Math.round(size / 3.2));
    return (
        <span className="inline-flex items-center" style={{ gap: Math.max(2, dot / 2), height: size }}>
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="rounded-full bg-current"
                    style={{ width: dot, height: dot }}
                    animate={{ y: [0, -dot, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                />
            ))}
        </span>
    );
}

function BarsLoader({ size }: { size: number }) {
    const barWidth = Math.max(2, Math.round(size / 6));
    return (
        <span className="inline-flex items-end" style={{ gap: barWidth * 0.7, height: size }}>
            {[0, 1, 2, 3].map((i) => (
                <motion.span
                    key={i}
                    className="rounded-sm bg-current"
                    style={{ width: barWidth }}
                    animate={{ height: [size * 0.3, size, size * 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                />
            ))}
        </span>
    );
}

function PulseLoader({ size }: { size: number }) {
    return (
        <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <motion.span
                className="absolute inset-0 rounded-full bg-current"
                animate={{ scale: [0.6, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
            />
            <span className="rounded-full bg-current" style={{ width: size * 0.45, height: size * 0.45 }} />
        </span>
    );
}

const LOADERS: Record<LoaderVariant, React.ComponentType<{ size: number }>> = {
    spinner: SpinnerLoader,
    dots: DotsLoader,
    bars: BarsLoader,
    pulse: PulseLoader,
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface MutationButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    /** Controls the color palette. Defaults to "primary". */
    variant?: ButtonVariant;
    /** Controls how the color is applied: filled, outlined, ghost, or a soft tint. Defaults to "solid". */
    styleType?: ButtonStyleType;
    size?: ButtonSize;
    /**
     * Drives the loading state (e.g. bind directly to `mutation.isPending`).
     * When omitted/false the component behaves like a completely normal button.
     */
    isLoading?: boolean;
    /** Which loader animation to show while `isLoading` is true. Defaults to "spinner". */
    loaderVariant?: LoaderVariant;
    /** Optional text swapped in next to the loader while loading (defaults to children). */
    loadingText?: React.ReactNode;
    icon?: React.ElementType;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MutationButton({
    variant = 'primary',
    styleType = 'solid',
    size = 'md',
    isLoading = false,
    loaderVariant = 'spinner',
    loadingText,
    icon: IconComp,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    className = '',
    children,
    onClick,
    type = 'button',
    ...rest
}: MutationButtonProps) {
    const { darkMode } = useThemeStore();

    const vc = VARIANT_COLORS[variant];
    const sz = SIZE_STYLES[size];
    const Loader = LOADERS[loaderVariant];

    const colorCls =
        styleType === 'solid'
            ? vc.solid
            : styleType === 'outline'
                ? vc.outline
                : styleType === 'ghost'
                    ? vc.ghost
                    : darkMode
                        ? vc.soft.dark
                        : vc.soft.light;

    const isDisabled = disabled || isLoading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            aria-busy={isLoading}
            className={[
                'inline-flex items-center justify-center font-semibold rounded-xl transition-all',
                'active:scale-95 disabled:opacity-60 disabled:active:scale-100',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                darkMode ? 'focus-visible:ring-offset-gray-900' : 'focus-visible:ring-offset-white',
                colorCls,
                vc.ring,
                sz.padding,
                sz.text,
                sz.gap,
                fullWidth ? 'w-full' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {isLoading ? (
                <>
                    <Loader size={sz.iconSize} />
                    {(loadingText ?? children) && <span>{loadingText ?? children}</span>}
                </>
            ) : (
                <>
                    {IconComp && iconPosition === 'left' && (
                        <IconComp style={{ width: sz.iconSize, height: sz.iconSize }} />
                    )}
                    {children && <span>{children}</span>}
                    {IconComp && iconPosition === 'right' && (
                        <IconComp style={{ width: sz.iconSize, height: sz.iconSize }} />
                    )}
                </>
            )}
        </button>
    );
}

export default MutationButton;

// ─── Usage ──────────────────────────────────────────────────────────────────
//
// Basic button (no mutation wiring at all):
//   <MutationButton onClick={() => console.log('clicked')}>Save</MutationButton>
//
// Bound to a mutation, danger variant, dots loader:
//   <MutationButton
//     variant="danger"
//     loaderVariant="dots"
//     isLoading={deleteMutation.isPending}
//     onClick={() => deleteMutation.mutate(id)}
//   >
//     Delete account
//   </MutationButton>
//
// Outline style, success variant, icon, small size:
//   <MutationButton variant="success" styleType="outline" size="sm" icon={Check}>
//     Approve
//   </MutationButton>
//
// Soft ghost-tinted confirm button, bars loader, full width:
//   <MutationButton
//     variant="confirm"
//     styleType="soft"
//     loaderVariant="bars"
//     fullWidth
//     isLoading={submitMutation.isPending}
//     loadingText="Submitting..."
//   >
//     Submit request
//   </MutationButton>