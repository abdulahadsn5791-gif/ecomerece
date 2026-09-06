import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from '@ecomerece/frontend';

// ─── Type Definitions ─────────────────────────────────────────────────────────

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

// ─── Color Config ─────────────────────────────────────────────────────────────
//
// One UI palette: blue-500 / rose-500 / orange-500 / emerald-500 / violet-500
// are solid, saturated, and — per the design system — vivid enough to read
// unchanged on both white and near-black, so those four style buckets don't
// need separate light/dark values. Only `neutral` (which is a background
// scale, not a semantic color) needs to shift with `darkMode`, so its four
// buckets are `{ light, dark }` pairs instead of plain strings.
//
// `primary` and `info` intentionally share Blue — the reference doc groups
// "primary actions, links, info" under one meaning, so they render the same.

type ThemedClass = string | { light: string; dark: string };

interface VariantColorSet {
    solid: ThemedClass;
    outline: ThemedClass;
    ghost: ThemedClass;
    soft: ThemedClass;
    ring: string;
}

function resolve(cls: ThemedClass, darkMode: boolean): string {
    return typeof cls === 'string' ? cls : darkMode ? cls.dark : cls.light;
}

const VARIANT_COLORS: Record<ButtonVariant, VariantColorSet> = {
    primary: {
        solid: 'bg-blue-500 hover:bg-blue-600 text-white',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
        ghost: 'text-blue-500 hover:bg-blue-500/10',
        soft: 'bg-blue-500/15 border border-blue-500/20 text-blue-500 hover:bg-blue-500/25',
        ring: 'focus-visible:ring-blue-500',
    },
    info: {
        solid: 'bg-blue-500 hover:bg-blue-600 text-white',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
        ghost: 'text-blue-500 hover:bg-blue-500/10',
        soft: 'bg-blue-500/15 border border-blue-500/20 text-blue-500 hover:bg-blue-500/25',
        ring: 'focus-visible:ring-blue-500',
    },
    danger: {
        solid: 'bg-rose-500 hover:bg-rose-600 text-white',
        outline: 'border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white',
        ghost: 'text-rose-500 hover:bg-rose-500/10',
        soft: 'bg-rose-500/15 border border-rose-500/20 text-rose-500 hover:bg-rose-500/25',
        ring: 'focus-visible:ring-rose-500',
    },
    warning: {
        solid: 'bg-orange-500 hover:bg-orange-600 text-white',
        outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white',
        ghost: 'text-orange-500 hover:bg-orange-500/10',
        soft: 'bg-orange-500/15 border border-orange-500/20 text-orange-500 hover:bg-orange-500/25',
        ring: 'focus-visible:ring-orange-400',
    },
    success: {
        solid: 'bg-emerald-500 hover:bg-emerald-600 text-white',
        outline: 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white',
        ghost: 'text-emerald-500 hover:bg-emerald-500/10',
        soft: 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/25',
        ring: 'focus-visible:ring-emerald-500',
    },
    confirm: {
        // Secondary informational accent per the palette (violet), kept
        // distinct from `success` so the two don't collide on meaning.
        solid: 'bg-violet-500 hover:bg-violet-600 text-white',
        outline: 'border-2 border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-white',
        ghost: 'text-violet-500 hover:bg-violet-500/10',
        soft: 'bg-violet-500/15 border border-violet-500/20 text-violet-500 hover:bg-violet-500/25',
        ring: 'focus-visible:ring-violet-500',
    },
    neutral: {
        solid: {
            light: 'bg-neutral-800 hover:bg-neutral-900 text-white',
            dark: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900',
        },
        outline: {
            light: 'border-2 border-neutral-300 text-neutral-800 hover:bg-neutral-100',
            dark: 'border-2 border-neutral-700 text-neutral-200 hover:bg-neutral-800',
        },
        ghost: {
            light: 'text-neutral-700 hover:bg-neutral-100',
            dark: 'text-neutral-300 hover:bg-neutral-800',
        },
        soft: {
            light: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800',
            dark: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200',
        },
        ring: 'focus-visible:ring-neutral-400',
    },
};

// ─── Size Config ──────────────────────────────────────────────────────────────
// Base padding follows the design system's button spec (px-6–7, py-3–3.5);
// sm/lg scale proportionally around that.

interface SizeConfig {
    padding: string;
    text: string;
    iconSize: number;
    gap: string;
}

const SIZE_STYLES: Record<ButtonSize, SizeConfig> = {
    sm: { padding: 'px-4 py-2', text: 'text-xs', iconSize: 14, gap: 'gap-1.5' },
    md: { padding: 'px-6 py-3', text: 'text-sm', iconSize: 16, gap: 'gap-2' },
    lg: { padding: 'px-7 py-3.5', text: 'text-base', iconSize: 18, gap: 'gap-2.5' },
};

// ─── Loader Variants ──────────────────────────────────────────────────────────

function SpinnerLoader({ size }: { size: number }) {
    return <Loader2 style={{ width: size, height: size }} className="animate-spin shrink-0" />;
}

function DotsLoader({ size }: { size: number }) {
    const dot = Math.max(3, Math.round(size / 3.2));
    return (
        <span className="inline-flex items-center shrink-0" style={{ gap: Math.max(2, dot / 2), height: size }}>
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
        <span className="inline-flex items-end shrink-0" style={{ gap: barWidth * 0.7, height: size }}>
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
        <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
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

// ─── Component Props ──────────────────────────────────────────────────────────

export interface MutationButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    /** Controls the color palette. Defaults to "primary". */
    variant?: ButtonVariant;
    /** Controls visual style: filled, outlined, ghost, or soft tint. Defaults to "solid". */
    styleType?: ButtonStyleType;
    size?: ButtonSize;
    /** Drives the loading state (e.g. `mutation.isPending`). */
    isLoading?: boolean;
    /** Loader animation style while `isLoading` is true. Defaults to "spinner". */
    loaderVariant?: LoaderVariant;
    /** Optional text displayed while loading (defaults to `children`). */
    loadingText?: React.ReactNode;
    icon?: React.ElementType;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
}

// ─── Main Component ───────────────────────────────────────────────────────────

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

    const colorCls = resolve(
        styleType === 'solid'
            ? vc.solid
            : styleType === 'outline'
                ? vc.outline
                : styleType === 'ghost'
                    ? vc.ghost
                    : vc.soft,
        darkMode,
    );

    const isDisabled = disabled || isLoading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            aria-busy={isLoading}
            aria-disabled={isDisabled}
            className={[
                'inline-flex items-center justify-center font-bold rounded-full transition-all select-none',
                'active:scale-95 disabled:opacity-60 disabled:active:scale-100 disabled:cursor-not-allowed',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                darkMode ? 'focus-visible:ring-offset-neutral-950' : 'focus-visible:ring-offset-white',
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
                        <IconComp style={{ width: sz.iconSize, height: sz.iconSize }} className="shrink-0" />
                    )}
                    {children && <span>{children}</span>}
                    {IconComp && iconPosition === 'right' && (
                        <IconComp style={{ width: sz.iconSize, height: sz.iconSize }} className="shrink-0" />
                    )}
                </>
            )}
        </button>
    );
}

export default MutationButton;