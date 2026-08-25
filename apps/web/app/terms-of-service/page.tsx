"use client"

import { useState } from 'react';
import {
    Moon,
    Sun,
    ScrollText,
    FileText,
    ShieldCheck,
    CheckCircle,
    Info,
    ArrowUp,
} from 'lucide-react';

// Sidebar sections for Terms of Service
const termsSections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: FileText },
    { id: 'accounts', title: 'User Accounts', icon: Info },
    { id: 'orders', title: 'Orders and Payments', icon: CheckCircle },
    { id: 'shipping', title: 'Shipping and Delivery', icon: Info },
    { id: 'returns', title: 'Returns and Refunds', icon: Info },
    { id: 'intellectual', title: 'Intellectual Property', icon: Info },
    { id: 'liability', title: 'Limitation of Liability', icon: Info },
    { id: 'changes', title: 'Changes to Terms', icon: Info },
];

export default function TermsOfServicePage() {
    const [darkMode, setDarkMode] = useState(false);
    const toggleTheme = () => setDarkMode(!darkMode);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
                {/* ============ HEADER ============ */}
                <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <a href="/" className="text-2xl font-bold tracking-tight">
                            <span className="text-black dark:text-white">Shop</span>Verse
                        </a>
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            <span className="text-sm font-medium">{darkMode ? 'Light' : 'Dark'}</span>
                        </button>
                    </div>
                </header>

                {/* ============ MAIN CONTENT (two-column layout) ============ */}
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Sidebar navigation */}
                            <aside className="lg:col-span-1">
                                <div className="sticky top-24 space-y-2">
                                    <h2 className="font-semibold text-gray-500 dark:text-gray-400 uppercase text-sm mb-4 px-2">
                                        On this page
                                    </h2>
                                    <nav className="space-y-1">
                                        {termsSections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => scrollToSection(section.id)}
                                                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <section.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm">{section.title}</span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </aside>

                            {/* Main content */}
                            <div className="lg:col-span-3">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <ScrollText className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
                                        <p className="text-gray-500 dark:text-gray-400">Last updated: August 24, 2026</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Welcome to ShopVerse. These Terms of Service govern your use of our website and services.
                                        By accessing or using ShopVerse, you agree to be bound by these terms.
                                    </p>

                                    {/* Section 1 */}
                                    <div id="acceptance">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            1. Acceptance of Terms
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            By creating an account, making a purchase, or browsing our website, you acknowledge that you have
                                            read, understood, and agree to be bound by these Terms of Service. If you do not agree with any
                                            part of these terms, please do not use our services.
                                        </p>
                                    </div>

                                    {/* Section 2 */}
                                    <div id="accounts">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            2. User Accounts
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            You are responsible for maintaining the confidentiality of your account credentials and for all
                                            activities that occur under your account. You agree to provide accurate and complete information
                                            when creating an account and to update such information to keep it accurate.
                                        </p>
                                    </div>

                                    {/* Section 3 */}
                                    <div id="orders">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            3. Orders and Payments
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            All orders are subject to acceptance and availability. We reserve the right to refuse or cancel
                                            any order at our sole discretion. Prices are subject to change without notice. Payment must be
                                            received in full before products are shipped.
                                        </p>
                                    </div>

                                    {/* Section 4 */}
                                    <div id="shipping">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            4. Shipping and Delivery
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            We aim to deliver products within the estimated timeframes. However, we are not responsible for
                                            delays caused by third‑party carriers or events beyond our control.
                                        </p>
                                    </div>

                                    {/* Section 5 */}
                                    <div id="returns">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            5. Returns and Refunds
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            You may return eligible products within 30 days of delivery for a refund or exchange. Items must
                                            be in original condition. Certain products may be excluded from the return policy.
                                        </p>
                                    </div>

                                    {/* Section 6 */}
                                    <div id="intellectual">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            6. Intellectual Property
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            All content on this website, including text, graphics, logos, images, and software, is the
                                            property of ShopVerse or its licensors and is protected by intellectual property laws.
                                        </p>
                                    </div>

                                    {/* Section 7 */}
                                    <div id="liability">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            7. Limitation of Liability
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            ShopVerse shall not be liable for any indirect, incidental, special, consequential, or punitive
                                            damages arising out of or related to your use of our services.
                                        </p>
                                    </div>

                                    {/* Section 8 */}
                                    <div id="changes">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            8. Changes to Terms
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            We reserve the right to modify these Terms of Service at any time. Changes will be effective
                                            immediately upon posting. Continued use of the website after changes constitutes acceptance.
                                        </p>
                                    </div>

                                    {/* Back to top */}
                                    <button
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        <ArrowUp className="w-4 h-4" /> Back to top
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ============ FOOTER ============ */}
                <footer className="border-t border-gray-200 dark:border-gray-700 py-6 bg-gray-50 dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>&copy; 2026 ShopVerse. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}