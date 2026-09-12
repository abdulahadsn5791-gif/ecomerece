'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import {
  LayoutDashboard,
  ImageIcon,
  Tag,
  Sparkles,
  Box,
  Layers,
  ShoppingBag,
  Users,
  Truck,
  LogOut,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const ADMIN_ACCENT = '#7C3AED';
const ADMIN_ACCENT_TEXT = '#6D28D9';

interface AdminNavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const primaryItems: AdminNavItem[] = [
  { label: 'Home Layout', icon: LayoutDashboard, href: '/admin/home' },
  { label: 'Products', icon: ShoppingBag, href: '/admin/products' },
  { label: 'Categories', icon: Tag, href: '/admin/categories' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Vendors', icon: Truck, href: '/admin/vendors' },
];

const homeSubItems: AdminNavItem[] = [
  { label: 'Slides', icon: ImageIcon, href: '/admin/home#slides' },
  { label: 'Categories', icon: Tag, href: '/admin/home#categories' },
  { label: 'Promos', icon: Layers, href: '/admin/home#promos' },
  { label: 'Features', icon: Sparkles, href: '/admin/home#features' },
  { label: 'Containers', icon: Box, href: '/admin/home#containers' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { darkMode } = useThemeStore();

  const borderColor = darkMode ? 'border-neutral-800' : 'border-neutral-200';
  const mutedText = darkMode ? 'text-neutral-400' : 'text-neutral-500';

  const isOnHomePage = pathname === '/admin/home' || pathname.startsWith('/admin/home/');
  const isOnPrimaryPage = primaryItems.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  const handleSignOut = async () => {
    router.push('/login');
  };

  return (
    <>
      {/* Mobile horizontal scroll nav */}
      <nav className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200 dark:border-neutral-800 mb-6">
        {primaryItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-violet-500 text-white font-medium'
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

      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block lg:col-span-1">
        <div
          className={`rounded-2xl border p-4 sticky top-28 transition-colors duration-500 ${
            darkMode
              ? 'bg-neutral-900 border-neutral-800 text-white'
              : 'bg-neutral-50 border-neutral-200 text-neutral-900'
          }`}
          style={
            {
              '--accent': ADMIN_ACCENT,
              '--accent-text': darkMode ? ADMIN_ACCENT : ADMIN_ACCENT_TEXT,
            } as React.CSSProperties
          }
        >
          <div className="flex items-center gap-2 px-3 mb-3">
            <Settings className="w-4 h-4 text-violet-500" />
            <h2
              className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-neutral-900'}`}
            >
              Admin Panel
            </h2>
          </div>

          {/* Primary navigation */}
          <nav className="space-y-1">
            {primaryItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/home' &&
                  pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 pl-[10px] pr-3 py-2 rounded-lg text-sm border-l-2 transition-colors ${
                    isActive
                      ? 'bg-[var(--accent)]/10 text-[var(--accent-text)] font-medium border-[var(--accent)]'
                      : `border-transparent ${
                          darkMode
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

          {/* Sub-navigation for Home Layout page */}
          {isOnHomePage && (
            <div className={`mt-4 pt-4 border-t ${borderColor}`}>
              <p
                className={`text-[11px] font-semibold uppercase tracking-wider px-3 mb-2 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
              >
                Sections
              </p>
              <nav className="space-y-1">
                {homeSubItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 pl-[10px] pr-3 py-1.5 rounded-lg text-xs border-l-2 border-transparent transition-colors ${
                        darkMode
                          ? 'text-neutral-400 hover:bg-neutral-800'
                          : 'text-neutral-500 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          <div className={`mt-3 pt-3 border-t ${borderColor}`}>
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
