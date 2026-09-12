'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { BarChart3, LayoutDashboard, LogOut, Store, Truck } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';

const VENDOR_ACCENT = '#059669';
const VENDOR_ACCENT_TEXT = '#047857';

interface VendorNavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const primaryItems: VendorNavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, href: '/vendor/dashboard' },
  { label: 'Performance', icon: BarChart3, href: '/vendor/products-stats' },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { darkMode } = useThemeStore();

  const borderColor = darkMode ? 'border-neutral-800' : 'border-neutral-200';
  const mutedText = darkMode ? 'text-neutral-400' : 'text-neutral-500';

  const handleSignOut = async () => {
    router.push('/login');
  };

  return (
    <>
      <nav className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200 dark:border-neutral-800 mb-6">
        {primaryItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-emerald-500 text-white font-medium'
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

      <aside className="hidden lg:block lg:col-span-1">
        <div
          className={`rounded-2xl border p-4 sticky top-28 transition-colors duration-500 ${
            darkMode
              ? 'bg-neutral-900 border-neutral-800 text-white'
              : 'bg-neutral-50 border-neutral-200 text-neutral-900'
          }`}
          style={
            {
              '--accent': VENDOR_ACCENT,
              '--accent-text': darkMode ? VENDOR_ACCENT : VENDOR_ACCENT_TEXT,
            } as React.CSSProperties
          }
        >
          <div className="flex items-center gap-2 px-3 mb-3">
            <Store className="w-4 h-4 text-emerald-500" />
            <h2 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
              Vendor Panel
            </h2>
          </div>

          <nav className="space-y-1">
            {primaryItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
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

          <div className={`mt-3 pt-3 border-t ${borderColor}`}>
            <div
              className={`flex items-center gap-3 pl-[10px] pr-3 py-2 rounded-lg text-sm ${mutedText}`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span className="flex-1">Products</span>
            </div>
            <div
              className={`flex items-center gap-3 pl-[10px] pr-3 py-2 rounded-lg text-sm ${mutedText}`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span className="flex-1">Orders</span>
            </div>
          </div>

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
