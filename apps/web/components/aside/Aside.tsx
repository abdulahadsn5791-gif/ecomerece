'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { ClipboardList, CreditCard, LogOut, MapPin, PackageOpen, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const ACCOUNT_ACCENT = '#4A7FB5';
const ACCOUNT_ACCENT_TEXT = '#2F5F8C';

const accountItems = [
    { label: 'Profile', icon: User, href: '/account/profile' },
    { label: 'Orders', icon: ClipboardList, href: '/account/order' },
    { label: 'Address', icon: MapPin, href: '/account/address' },
    { label: 'Cart', icon: PackageOpen, href: '/account/cart' },
    { label: 'Payment methods', icon: CreditCard, href: '/account/payment' },
    { label: 'Settings', icon: Settings, href: '/account/settings' },
];

export default function Aside() {
    const pathname = usePathname();
    const router = useRouter();
    const { darkMode } = useThemeStore();

    const borderColor = darkMode ? 'border-neutral-800' : 'border-neutral-200';
    const mutedText = darkMode ? 'text-neutral-400' : 'text-neutral-500';

    const handleSignOut = async () => {
        // TODO: Execute authentication clear token / session logic
        router.push('/login');
    };

    return (
        <>
            {/* Mobile / Tablet Horizontal Scroll Navigation */}
            <nav className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200 dark:border-neutral-800 mb-6">
                {accountItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap shrink-0 transition-colors ${isActive
                                    ? 'bg-[#4A7FB5] text-white font-medium'
                                    : darkMode
                                        ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop Sticky Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
                <div
                    className={`rounded-2xl border p-4 sticky top-28 transition-colors duration-500 ${darkMode
                            ? 'bg-neutral-900 border-neutral-800 text-white'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                        }`}
                    style={
                        {
                            '--accent': ACCOUNT_ACCENT,
                            '--accent-text': darkMode ? ACCOUNT_ACCENT : ACCOUNT_ACCENT_TEXT,
                        } as React.CSSProperties
                    }
                >
                    <h2 className={`font-semibold text-sm mb-3 px-3 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                        Account
                    </h2>

                    <nav className="space-y-1">
                        {accountItems.map((item) => {
                            // Highlights exact route OR any sub-route (e.g. /account/order/123)
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3 pl-[10px] pr-3 py-2 rounded-lg text-sm border-l-2 transition-colors ${isActive
                                            ? 'bg-[var(--accent)]/10 text-[var(--accent-text)] font-medium border-[var(--accent)]'
                                            : `border-transparent ${darkMode
                                                ? 'text-neutral-300 hover:bg-neutral-800'
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                            }`
                                        }`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className={`mt-2 pt-2 border-t ${borderColor}`}>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className={`w-full flex items-center gap-3 pl-[10px] pr-3 py-2 rounded-lg text-sm transition-colors ${mutedText} hover:bg-rose-500/10 hover:text-rose-500`}
                        >
                            <LogOut className="w-4 h-4 shrink-0" />
                            Log out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}