// components/Navbar.tsx
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
    ChevronDown,
    Sparkles,
} from "lucide-react";
import { useThemeStore } from "@ecomerece/frontend";

const navItems = [
    { name: "Home", href: "#" },
    { name: "Fashion", href: "#" },
    { name: "Electronics", href: "#" },
    { name: "Home & Living", href: "#" },
    { name: "Beauty", href: "#" },
    { name: "Sports", href: "#" },
    { name: "Books", href: "#" },
    { name: "Gaming", href: "#" },
    { name: "Deals", href: "#" },
    { name: "New Arrivals", href: "#" },
];

const accountItems = [
    { label: "Profile", icon: User },
    { label: "Orders", icon: ClipboardList },
    { label: "Addresses", icon: MapPin },
    { label: "Payment Methods", icon: CreditCard },
    { label: "Saved Items", icon: PackageOpen },
    { label: "Settings", icon: Settings },
    { label: "Sign Out", icon: LogOut, danger: true },
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
        <nav className="relative z-50">
            {/* ============ TOP BAR ============ */}
            <div
                className={`text-xs font-medium border-b transition-colors duration-500 ${darkMode
                        ? "bg-neutral-950 border-neutral-800 text-neutral-400"
                        : "bg-neutral-100 border-neutral-200 text-neutral-600"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center flex-wrap gap-2.5 py-2.5">
                    <div className="flex items-center gap-6">
                        <a href="tel:+15551234567" className={`flex items-center gap-1.5 transition-colors ${darkMode ? "hover:text-white" : "hover:text-neutral-900"
                            }`}>
                            <Phone className="w-3.5 h-3.5" /> +1 (555) 123-4567
                        </a>
                        <a href="mailto:support@shopverse.com" className={`hidden sm:flex items-center gap-1.5 transition-colors ${darkMode ? "hover:text-white" : "hover:text-neutral-900"
                            }`}>
                            <Mail className="w-3.5 h-3.5" /> support@shopverse.com
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className={`flex items-center gap-1.5 transition-colors ${darkMode ? "hover:text-white" : "hover:text-neutral-900"
                                }`}
                        >
                            <Package className="w-3.5 h-3.5" /> Track Order
                        </a>
                        <a
                            href="#"
                            className={`flex items-center gap-1.5 transition-colors ${darkMode ? "hover:text-white" : "hover:text-neutral-900"
                                }`}
                        >
                            <HelpCircle className="w-3.5 h-3.5" /> Help Center
                        </a>
                    </div>
                </div>
            </div>

            {/* ============ MAIN HEADER ============ */}
            <header
                className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-500 ${darkMode
                        ? "bg-neutral-950/80 border-neutral-800 text-white"
                        : "bg-white/80 border-neutral-200 text-neutral-900"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6 py-4">

                    {/* Left: Mobile Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleMobileMenu}
                            className={`md:hidden p-2 rounded-xl border transition-colors ${darkMode ? "border-neutral-800 bg-neutral-900 text-white" : "border-neutral-200 bg-neutral-50 text-neutral-900"
                                }`}
                            aria-label="Toggle main navigation"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <a
                            href="#"
                            className="text-2xl font-extrabold tracking-tight flex items-center gap-1"
                        >
                            <span className="opacity-60">Shop</span>Verse
                        </a>
                    </div>

                    {/* Center: Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-lg items-center relative">
                        <div className={`w-full flex items-center rounded-full px-4 py-2.5 border transition-all duration-300 shadow-sm ${darkMode
                                ? "bg-neutral-900/50 border-neutral-800 focus-within:border-neutral-600 focus-within:bg-neutral-900"
                                : "bg-neutral-50 border-neutral-200 focus-within:border-neutral-400 focus-within:bg-white"
                            }`}>
                            <Search className={`w-4 h-4 mr-3 shrink-0 ${darkMode ? "text-neutral-500" : "text-neutral-400"}`} />
                            <input
                                type="text"
                                placeholder="Search products, brands, and categories..."
                                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-neutral-500"
                            />
                        </div>
                    </div>

                    {/* Right: Actions (Theme, Wishlist, Account, Cart) */}
                    <div className="flex items-center gap-3">

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-full border transition-all duration-300 hover:scale-105 ${darkMode
                                    ? "border-neutral-800 bg-neutral-900 text-yellow-400 hover:bg-neutral-800"
                                    : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                                }`}
                            aria-label="Toggle Theme"
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {/* Wishlist */}
                        <a
                            href="#"
                            className={`relative p-2.5 rounded-full border transition-all duration-300 hover:scale-105 hidden sm:flex items-center justify-center ${darkMode
                                    ? "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                    : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:text-black"
                                }`}
                            aria-label="Wishlist"
                        >
                            <Heart className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center bg-rose-500 text-white">
                                3
                            </span>
                        </a>

                        {/* Account Menu Toggle (Desktop Dropdown) */}
                        <div className="relative">
                            <button
                                onClick={toggleAccountMenu}
                                className={`flex items-center gap-2 p-2 rounded-full border transition-all duration-300 ${darkMode
                                        ? "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                                        : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                                    }`}
                                aria-label="Account Menu"
                            >
                                <div className="w-6 h-6 rounded-full bg-neutral-500/20 flex items-center justify-center">
                                    <User className="w-3.5 h-3.5" />
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${accountMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Account Dropdown */}
                            {accountMenuOpen && (
                                <div className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-xl border overflow-hidden p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${darkMode ? "bg-neutral-900 border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                                    }`}>
                                    <div className="px-3 py-2 border-b border-neutral-200/20 mb-1">
                                        <p className="text-xs font-medium text-neutral-400">Signed in as</p>
                                        <p className="text-sm font-bold truncate">alex.johnson@example.com</p>
                                    </div>
                                    {accountItems.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <a
                                                key={item.label}
                                                href="#"
                                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${item.danger
                                                        ? "text-rose-500 hover:bg-rose-500/10"
                                                        : darkMode
                                                            ? "hover:bg-neutral-800 text-neutral-300 hover:text-white"
                                                            : "hover:bg-neutral-100 text-neutral-700 hover:text-black"
                                                    }`}
                                            >
                                                <IconComponent className="w-4 h-4" />
                                                <span>{item.label}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <a
                            href="#"
                            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-xs transition-all duration-300 shadow-sm ${darkMode
                                    ? "bg-white text-black hover:bg-neutral-200"
                                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">Cart</span>
                            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                5
                            </span>
                        </a>

                    </div>
                </div>

                {/* ============ SECONDARY NAV BAR (Categories Links) ============ */}
                <div className={`hidden md:block border-t transition-colors ${darkMode ? "border-neutral-800 bg-neutral-950/40" : "border-neutral-100 bg-neutral-50/50"
                    }`}>
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-8 py-3 overflow-x-auto scrollbar-none">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${darkMode
                                        ? "text-neutral-400 hover:text-white"
                                        : "text-neutral-600 hover:text-black"
                                    }`}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ============ MOBILE DRAWER MENU ============ */}
                {mobileMenuOpen && (
                    <div className={`md:hidden absolute top-full left-0 w-full border-b shadow-2xl p-6 transition-all duration-300 ${darkMode ? "bg-neutral-950 border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                        }`}>
                        {/* Mobile Search */}
                        <div className={`flex items-center rounded-full px-4 py-2.5 border mb-6 ${darkMode ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
                            }`}>
                            <Search className="w-4 h-4 mr-3 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-transparent border-none outline-none text-sm"
                            />
                        </div>

                        {/* Mobile Links Grid */}
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Categories</p>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${darkMode ? "bg-neutral-900 hover:bg-neutral-800" : "bg-neutral-50 hover:bg-neutral-100"
                                        }`}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-neutral-200/20 flex justify-between items-center">
                            <a href="#" className="text-xs font-semibold flex items-center gap-1.5 text-rose-500">
                                <Heart className="w-4 h-4" /> Wishlist (3 items)
                            </a>
                            <a href="#" className="text-xs font-semibold flex items-center gap-1.5">
                                <Package className="w-4 h-4" /> Track Order
                            </a>
                        </div>
                    </div>
                )}
            </header>
        </nav>
    );
}