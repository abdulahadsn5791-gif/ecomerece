"use client";

import { useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Package,
    HelpCircle,
    Search,
    Heart,
    User,
    ShoppingCart,
    Moon,
    Sun,
    X,
    CreditCard,
    PackageOpen,
    LogOut,
    Settings,
    ClipboardList,
    Menu,
} from "lucide-react";
import { useThemeStore } from "@ecomerece/frontend";


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
    const { darkMode, toggleTheme } = useThemeStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        setAccountMenuOpen(false);
    };

    const toggleAccountMenu = () => {
        setAccountMenuOpen(!accountMenuOpen);
        setMobileMenuOpen(false);
    };

    return (
        <div>
            {/* ============ TOP BAR ============ */}
            <div
                className={`text-sm border-b sticky top-0 z-50 ${darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-100 border-gray-200"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-2 py-2">
                    <div className="flex items-center gap-6">
                        <span
                            className={`flex items-center gap-1 ${darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                        >
                            <Phone className="w-4 h-4" /> +1 (555) 123-4567
                        </span>
                        <span
                            className={`flex items-center gap-1 ${darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                        >
                            <Mail className="w-4 h-4" /> support@shopverse.com
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className={`flex items-center gap-1 ${darkMode
                                ? "text-gray-300 hover:text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <Package className="w-4 h-4" /> Track Order
                        </a>
                        <a
                            href="#"
                            className={`flex items-center gap-1 ${darkMode
                                ? "text-gray-300 hover:text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <HelpCircle className="w-4 h-4" /> Help Center
                        </a>
                    </div>
                </div>
            </div>

            {/* ============ HEADER ============ */}
            <header
                className={`border-b sticky top-8 z-40 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-2">
                        {/* Mobile hamburger – main nav */}
                        <button
                            onClick={toggleMobileMenu}
                            className={`md:hidden p-2 rounded-lg ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                                }`}
                            aria-label="Toggle main navigation"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                        {/* Mobile hamburger – account */}
                        <button
                            onClick={toggleAccountMenu}
                            className={`md:hidden p-2 rounded-lg ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                                }`}
                            aria-label="Toggle account menu"
                        >
                            {accountMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <User className="w-6 h-6" />
                            )}
                        </button>
                        <a
                            href="#"
                            className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            <span className={darkMode ? "text-white" : "text-black"}>
                                Shop
                            </span>
                            Verse
                        </a>
                    </div>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${darkMode
                            ? "bg-gray-800 text-white hover:bg-gray-700"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                            }`}
                    >
                        {darkMode ? (
                            <Sun className="w-4 h-4" />
                        ) : (
                            <Moon className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">
                            {darkMode ? "Light" : "Dark"}
                        </span>
                    </button>

                    {/* Search bar (desktop) */}
                    <div
                        className={`hidden md:flex flex-1 max-w-md items-center rounded-full px-4 border border-transparent transition-all ${darkMode
                            ? "bg-gray-800 focus-within:bg-gray-900 focus-within:border-white"
                            : "bg-gray-100 focus-within:bg-white focus-within:border-black"
                            }`}
                    >
                        <input
                            type="text"
                            placeholder="Search products, brands, and more..."
                            className={`flex-1 bg-transparent border-none outline-none py-2 px-3 placeholder-gray-500 ${darkMode
                                ? "text-white placeholder-gray-400"
                                : "text-gray-900"
                                }`}
                        />
                        <button
                            className={`p-2 ${darkMode
                                ? "text-gray-400 hover:text-white"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Action icons */}
                    <div className="flex items-center gap-2">
                        <button
                            className={`relative w-11 h-11 rounded-full flex items-center justify-center ${darkMode
                                ? "text-white hover:bg-gray-800"
                                : "text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <Heart className="w-5 h-5" />
                            <span
                                className={`absolute top-0 right-0 text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 ${darkMode
                                    ? "bg-white text-black border-gray-900"
                                    : "bg-black text-white border-white"
                                    }`}
                            >
                                3
                            </span>
                        </button>
                        <button
                            className={`relative w-11 h-11 rounded-full flex items-center justify-center ${darkMode
                                ? "text-white hover:bg-gray-800"
                                : "text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <User className="w-5 h-5" />
                        </button>
                        <button
                            className={`relative w-11 h-11 rounded-full flex items-center justify-center ${darkMode
                                ? "text-white hover:bg-gray-800"
                                : "text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span
                                className={`absolute top-0 right-0 text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 ${darkMode
                                    ? "bg-white text-black border-gray-900"
                                    : "bg-black text-white border-white"
                                    }`}
                            >
                                5
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ============ MOBILE MAIN NAV ============ */}
            {mobileMenuOpen && (
                <div
                    className={`md:hidden border-b z-30 ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                >
                    <div className="px-4 py-2 space-y-1">
                        {navItems.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className={`block px-3 py-2 rounded-lg ${darkMode
                                    ? "text-gray-300 hover:bg-gray-800"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
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
                <div
                    className={`md:hidden border-b z-30 ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                        }`}
                >
                    <div className="px-4 py-2 space-y-1">
                        <h3
                            className={`px-3 py-2 text-sm font-semibold uppercase ${darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Account
                        </h3>
                        {accountItems.map((item) => {
                            const isActive = item.label === "Addresses";
                            return (
                                <a
                                    key={item.label}
                                    href="#"
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                                        ? darkMode
                                            ? "bg-white text-black font-medium"
                                            : "bg-black text-white font-medium"
                                        : darkMode
                                            ? "text-gray-300 hover:bg-gray-800"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    onClick={() => setAccountMenuOpen(false)}
                                >
                                    <item.icon className="w-4 h-4" /> {item.label}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ============ DESKTOP NAVIGATION ============ */}
            <nav
                className={`hidden md:block border-b sticky top-24 z-30 ${darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-200"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto">
                    {navItems.map((item, idx) => {
                        const isFirst = idx === 0;
                        const baseClasses =
                            "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors";
                        const activeClasses = isFirst
                            ? darkMode
                                ? "text-white border-white"
                                : "text-black border-black"
                            : darkMode
                                ? "text-gray-400 border-transparent hover:text-white hover:border-white"
                                : "text-gray-500 border-transparent hover:text-black hover:border-black";
                        return (
                            <a key={item} href="#" className={`${baseClasses} ${activeClasses}`}>
                                {item}
                            </a>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}