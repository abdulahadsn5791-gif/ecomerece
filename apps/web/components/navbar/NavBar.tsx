"use client";

import { useState } from "react";
import {
    MapPin,
    Plus,
    Pencil,
    Trash2,
    Star,
    CheckCircle,
    Home,
    Phone,
    Mail,
    Globe,
    Package,
    Gift,
    HelpCircle,
    Search,
    Heart,
    User,
    ShoppingCart,
    Moon,
    Sun,
    X,
    AlertTriangle,
    CreditCard,
    PackageOpen,
    LogOut,
    Settings,
    ClipboardList,
    Menu,
} from "lucide-react";

// Navigation and account items (moved here for reuse)
const navItems = [
    "Home",
    "Fashion",
    "Electronics",
    "Home & Living",
    "Beauty",
    "Sports",
    "Books",
    "Gaming",
    "Deals",
    "New Arrivals",
];

const accountItems = [
    { label: "Profile", icon: User },
    { label: "Orders", icon: ClipboardList },
    { label: "Addresses", icon: MapPin },
    { label: "Payment Methods", icon: CreditCard },
    { label: "Saved Items", icon: PackageOpen },
    { label: "Settings", icon: Settings },
    { label: "Sign Out", icon: LogOut },
];

export default function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const toggleTheme = () => setDarkMode(!darkMode);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        setAccountMenuOpen(false);
    };

    const toggleAccountMenu = () => {
        setAccountMenuOpen(!accountMenuOpen);
        setMobileMenuOpen(false);
    };

    return (
        <div >
            <div className="bg-gray-100 dark:bg-gray-800 text-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-2 py-2">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <Phone className="w-4 h-4" /> +1 (555) 123-4567
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                            <Mail className="w-4 h-4" /> support@shopverse.com
                        </span>
                    </div>
                    <div className="flex items-center gap-6">

                        <a href="#" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            <Package className="w-4 h-4" /> Track Order
                        </a>

                        <a href="#" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            <HelpCircle className="w-4 h-4" /> Help Center
                        </a>
                    </div>
                </div>
            </div>

            {/* ============ HEADER ============ */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-8 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-4">
                    {/* Logo and hamburger buttons */}
                    <div className="flex items-center gap-2">
                        {/* Main nav hamburger (mobile only) */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle main navigation"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        {/* Account hamburger (mobile only) */}
                        <button
                            onClick={toggleAccountMenu}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle account menu"
                        >
                            {accountMenuOpen ? <X className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </button>
                        <a href="#" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            <span className="text-black dark:text-white">Shop</span>Verse
                        </a>
                    </div>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
                    </button>

                    {/* Search bar (desktop only) */}
                    <div className="hidden md:flex flex-1 max-w-md items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 border border-transparent focus-within:border-black dark:focus-within:border-white focus-within:bg-white dark:focus-within:bg-gray-900 transition-all">
                        <input
                            type="text"
                            placeholder="Search products, brands, and more..."
                            className="flex-1 bg-transparent border-none outline-none py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav actions */}
                    <div className="flex items-center gap-2">
                        <button className="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Heart className="w-5 h-5" />
                            <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">3</span>
                        </button>
                        <button className="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                            <User className="w-5 h-5" />
                        </button>
                        <button className="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">5</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ============ MOBILE MAIN NAV MENU ============ */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-30">
                    <div className="px-4 py-2 space-y-1">
                        {navItems.map(item => (
                            <a
                                key={item}
                                href="#"
                                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* ============ MOBILE ACCOUNT MENU ============ */}
            {accountMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-30">
                    <div className="px-4 py-2 space-y-1">
                        <h3 className="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Account</h3>
                        {accountItems.map((item) => (
                            <a
                                key={item.label}
                                href="#"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${item.label === 'Addresses' ? 'bg-black dark:bg-white text-white dark:text-black font-medium' : ''
                                    }`}
                                onClick={() => setAccountMenuOpen(false)}
                            >
                                <item.icon className="w-4 h-4" /> {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* ============ NAVIGATION (desktop only) ============ */}
            <nav className="hidden md:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-24 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto">
                    {navItems.map((item, idx) => (
                        <a
                            key={item}
                            href="#"
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${idx === 0
                                ? 'text-black dark:text-white border-black dark:border-white'
                                : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                                } transition-colors`}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </nav>
        </div>
    );
}