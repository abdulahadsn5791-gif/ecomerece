// components/Footer.tsx
"use client";

import { useThemeStore } from '@ecomerece/frontend';
import { Facebook, Instagram, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import React from 'react';

export default function Footer() {
    const { darkMode } = useThemeStore();

    return (
        <footer className={`border-t py-20 transition-colors duration-500 ${darkMode
                ? "bg-neutral-950 border-neutral-800 text-white"
                : "bg-white border-neutral-200 text-neutral-900"
            }`}>
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">

                {/* Brand Column (Span 4) */}
                <div className="md:col-span-4 space-y-5">
                    <a href="#" className="inline-block text-2xl font-extrabold tracking-tight">
                        <span className="opacity-60">Shop</span>Verse
                    </a>

                    <p className={`text-sm leading-relaxed max-w-sm ${darkMode ? "text-neutral-400" : "text-neutral-600"
                        }`}>
                        Your one-stop destination for quality products at unbeatable prices. Shop with confidence and enjoy a seamless online shopping experience.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-3 pt-2">
                        {[
                            { name: 'Facebook', icon: Facebook },
                            { name: 'Instagram', icon: Instagram },
                            { name: 'Twitter', icon: Twitter },
                            { name: 'LinkedIn', icon: Linkedin },
                        ].map((social) => {
                            const IconComponent = social.icon;
                            return (
                                <a
                                    key={social.name}
                                    href="#"
                                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 ${darkMode
                                            ? "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-white hover:text-black hover:border-white"
                                            : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-black hover:text-white hover:border-black"
                                        }`}
                                >
                                    <span className="sr-only">{social.name}</span>
                                    <IconComponent className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Links (Span 2 or 3) */}
                <div className="md:col-span-2 space-y-4">
                    <h4 className="font-bold text-sm tracking-wide uppercase">Quick Links</h4>
                    <ul className={`space-y-3 text-sm ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                        {['About Us', 'Contact Us', 'Careers', 'Blog', 'Press'].map((item) => (
                            <li key={item}>
                                <a href="#" className={`inline-flex items-center gap-1 transition-colors ${darkMode ? "hover:text-white" : "hover:text-black"
                                    }`}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer Service (Span 3) */}
                <div className="md:col-span-3 space-y-4">
                    <h4 className="font-bold text-sm tracking-wide uppercase">Customer Service</h4>
                    <ul className={`space-y-3 text-sm ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                        {['FAQs', 'Shipping Policy', 'Returns & Refunds', 'Order Tracking', 'Support Center'].map((item) => (
                            <li key={item}>
                                <a href="#" className={`inline-flex items-center gap-1 transition-colors ${darkMode ? "hover:text-white" : "hover:text-black"
                                    }`}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Categories (Span 3) */}
                <div className="md:col-span-3 space-y-4">
                    <h4 className="font-bold text-sm tracking-wide uppercase">Categories</h4>
                    <ul className={`space-y-3 text-sm ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                        {['Fashion & Apparel', 'Electronics & Gadgets', 'Home & Furniture', 'Beauty & Health', 'Sports & Outdoors'].map((item) => (
                            <li key={item}>
                                <a href="#" className={`inline-flex items-center gap-1 transition-colors ${darkMode ? "hover:text-white" : "hover:text-black"
                                    }`}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className={`max-w-7xl mx-auto px-6 mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${darkMode ? "border-neutral-800 text-neutral-500" : "border-neutral-200 text-neutral-500"
                }`}>
                <p>&copy; 2026 ShopVerse. All rights reserved.</p>

                <div className="flex items-center gap-6">
                    <a href="#" className="hover:underline transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:underline transition-colors">Terms of Service</a>
                    <a href="#" className="inline-flex items-center gap-0.5 hover:underline transition-colors">
                        Security <ArrowUpRight className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </footer>
    );
}