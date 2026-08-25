"use client"

import { useState } from 'react';
import {
    Moon,
    Sun,
    ShieldCheck,
    FileText,
    Info,
    ArrowUp,
} from 'lucide-react';

// Sidebar sections for Privacy Policy
const privacySections = [
    { id: 'collection', title: 'Information We Collect', icon: Info },
    { id: 'usage', title: 'How We Use Your Information', icon: Info },
    { id: 'sharing', title: 'Sharing of Information', icon: Info },
    { id: 'cookies', title: 'Cookies', icon: Info },
    { id: 'security', title: 'Data Security', icon: Info },
    { id: 'rights', title: 'Your Rights', icon: Info },
    { id: 'changes', title: 'Changes to This Policy', icon: Info },
];

export default function PrivacyPolicyPage() {
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
                                        {privacySections.map((section) => (
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
                                        <ShieldCheck className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
                                        <p className="text-gray-500 dark:text-gray-400">Last updated: August 24, 2026</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        This Privacy Policy describes how ShopVerse collects, uses, and protects your personal information
                                        when you use our website.
                                    </p>

                                    {/* Section 1 */}
                                    <div id="collection">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            1. Information We Collect
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            We may collect personal information such as your name, email address, shipping address, and
                                            payment details when you create an account or make a purchase. We also collect usage data such
                                            as pages visited and links clicked.
                                        </p>
                                    </div>

                                    {/* Section 2 */}
                                    <div id="usage">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            2. How We Use Your Information
                                        </h2>
                                        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                                            <li>To process and fulfill orders</li>
                                            <li>To communicate with you about your account and orders</li>
                                            <li>To improve our products and services</li>
                                            <li>To send promotional emails (if opted in)</li>
                                            <li>To prevent fraud and ensure security</li>
                                        </ul>
                                    </div>

                                    {/* Section 3 */}
                                    <div id="sharing">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            3. Sharing of Information
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            We do not sell your personal information. We may share it with trusted third‑party service
                                            providers who assist us in operating our website, processing payments, and delivering orders.
                                            All third parties are contractually obligated to protect your data.
                                        </p>
                                    </div>

                                    {/* Section 4 */}
                                    <div id="cookies">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            4. Cookies
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            We use cookies to enhance your browsing experience, remember your preferences, and analyze site
                                            traffic. You can control cookie settings through your browser.
                                        </p>
                                    </div>

                                    {/* Section 5 */}
                                    <div id="security">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            5. Data Security
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            We implement reasonable security measures to protect your personal information. However, no
                                            method of transmission over the internet is 100% secure, and we cannot guarantee absolute
                                            security.
                                        </p>
                                    </div>

                                    {/* Section 6 */}
                                    <div id="rights">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            6. Your Rights
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            You have the right to access, correct, or delete your personal information. You may also object
                                            to or restrict certain processing activities. To exercise these rights, please contact us.
                                        </p>
                                    </div>

                                    {/* Section 7 */}
                                    <div id="changes">
                                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Info className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                            7. Changes to This Policy
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            We may update this Privacy Policy from time to time. We will notify you of any material changes
                                            by posting the new policy on this page.
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