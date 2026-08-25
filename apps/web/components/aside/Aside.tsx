import { ClipboardList, CreditCard, LogOut, MapPin, PackageOpen, Settings, User } from 'lucide-react';
import React from 'react'
const accountItems = [
    { label: 'Profile', icon: User },
    { label: 'Orders', icon: ClipboardList },
    { label: 'Addresses', icon: MapPin },
    { label: 'Payment Methods', icon: CreditCard },
    { label: 'Saved Items', icon: PackageOpen },
    { label: 'Settings', icon: Settings },
    { label: 'Sign Out', icon: LogOut },
];
function Aside() {
    return (
        <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 sticky top-40">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 px-2">Account</h2>
                <nav className="space-y-1">
                    {accountItems.map((item) => (
                        <a
                            key={item.label}
                            href="#"
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${item.label === 'Addresses' ? 'bg-black dark:bg-white text-white dark:text-black font-medium' : ''
                                }`}
                        >
                            <item.icon className="w-4 h-4" /> {item.label}
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    )
}

export default Aside
