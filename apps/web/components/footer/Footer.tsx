'use client';

import { useAppSettingsStore } from '@ecomerece/frontend/app-settings';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { ArrowUpRight, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const quickLinks = ['About Us', 'Contact Us', 'Careers', 'Blog', 'Press'];
const supportLinks = [
  'FAQs',
  'Shipping Policy',
  'Returns & Refunds',
  'Order Tracking',
  'Support Center',
];
const categoryLinks = [
  'Fashion & Apparel',
  'Electronics & Gadgets',
  'Home & Furniture',
  'Beauty & Health',
  'Sports & Outdoors',
];
const socials = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
];

export default function Footer() {
  const { darkMode } = useThemeStore();
  const { footerEnabled } = useAppSettingsStore();

  const border = darkMode ? 'border-neutral-800' : 'border-neutral-200';

  if (!footerEnabled) {
    return (
      <footer className={`mt-20 border-t py-6 transition-colors duration-500 ${border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2">
          <span className="font-bold tracking-tight">ShopVerse</span>
          <span className={darkMode ? 'text-neutral-500' : 'text-neutral-500'}>
            &copy; 2026. All rights reserved.
          </span>
        </div>
      </footer>
    );
  }

  const linkText = darkMode ? 'text-neutral-400' : 'text-neutral-600';

  return (
    <footer className={`mt-20 border-t transition-colors duration-500 ${border}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Link columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-14">
          {/* Brand */}
          <div className="md:col-span-4 space-y-5">
            <a href="/" className="text-xl font-bold tracking-tight">
              ShopVerse
            </a>

            <p className={`text-sm leading-relaxed max-w-sm ${linkText}`}>
              A one-stop destination for quality products at unbeatable prices, with convenient
              delivery you can track in real time.
            </p>

            <div className="flex items-center gap-3">
              {socials.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
                      darkMode
                        ? 'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white'
                        : 'border-neutral-200 bg-white/70 text-neutral-600 hover:text-black'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <nav className="md:col-span-2 space-y-4" aria-label="Quick links">
            <h4 className="font-bold text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className={`space-y-3 text-sm ${linkText}`}>
              {quickLinks.map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className={`inline-flex items-center gap-1 transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav className="md:col-span-3 space-y-4" aria-label="Customer service">
            <h4 className="font-bold text-sm tracking-wide uppercase">Customer Service</h4>
            <ul className={`space-y-3 text-sm ${linkText}`}>
              {supportLinks.map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className={`inline-flex items-center gap-1 transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav className="md:col-span-3 space-y-4" aria-label="Categories">
            <h4 className="font-bold text-sm tracking-wide uppercase">Categories</h4>
            <ul className={`space-y-3 text-sm ${linkText}`}>
              {categoryLinks.map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className={`inline-flex items-center gap-1 transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-black'}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${darkMode ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-500'}`}
        >
          <p>&copy; 2026 ShopVerse. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="/" className="hover:underline transition-colors">
              Privacy Policy
            </a>
            <a href="/" className="hover:underline transition-colors">
              Terms of Service
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-0.5 hover:underline transition-colors"
            >
              Security <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
