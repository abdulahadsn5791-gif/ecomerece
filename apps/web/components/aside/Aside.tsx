'use client';

import { useThemeStore } from '@ecomerece/frontend';
import { ClipboardList, CreditCard, LogOut, MapPin, PackageOpen, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';


const accountItems = [
    { label: 'Profile', icon: User, href: '/account/profile' },
    { label: 'Orders', icon: ClipboardList, href: '/account/order' },
    { label: 'Address', icon: MapPin, href: '/account/address' },
    { label: 'Cart', icon: PackageOpen, href: '/account/cart' },
    { label: 'Settings', icon: Settings, href: '/account/settings' },
];

function Aside() {
    const pathname = usePathname();
    const { darkMode } = useThemeStore();

    return (
        <aside className="hidden lg:block lg:col-span-1">
            <div
                className={`rounded-2xl p-4 sticky top-40 transition-colors ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
                    }`}
            >
                <h2 className={`font-semibold mb-4 px-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account</h2>
                <nav className="space-y-1">
                    {accountItems.map((item) => {
                        const isActive = item.href === pathname;

                        let linkStyles = '';
                        if (isActive) {
                            linkStyles = darkMode
                                ? 'bg-white text-gray-900 font-medium'
                                : 'bg-black text-white font-medium';
                        } else {
                            linkStyles = darkMode
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100';
                        }

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${linkStyles}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}

export default Aside;