'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { useGetMe } from '@ecomerece/frontend/user';
import {
  ChevronDown,
  ClipboardList,
  CreditCard,
  Heart,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Moon,
  PackageOpen,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Sun,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const accountItems = [
  { label: 'Profile', icon: User, href: '/account/profile' },
  { label: 'Orders', icon: ClipboardList, href: '/account/order' },
  { label: 'Addresses', icon: MapPin, href: '/account/address' },
  { label: 'Payment Methods', icon: CreditCard, href: '/account/payment' },
  { label: 'Saved Items', icon: PackageOpen, href: '/account/cart' },
  { label: 'Become a Vendor', icon: Store, href: '/vendor/create' },
  { label: 'Settings', icon: Settings, href: '/account/settings' },
  { label: 'Sign Out', icon: LogOut, danger: true, href: '/auth/signout' },
];

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/client/categories' },
  { label: 'Categories', href: '/client/categories' },
];

export default function Navbar() {
  const { darkMode, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { data: user } = useGetMe();

  const glass = darkMode
    ? 'bg-neutral-950/80 border-neutral-800 text-white backdrop-blur-2xl'
    : 'bg-white/80 border-neutral-200 text-neutral-900 backdrop-blur-2xl';

  const softSurface = darkMode
    ? 'bg-neutral-900/80 border-neutral-800'
    : 'bg-white/60 border-neutral-200';

  const solidButton = darkMode
    ? 'bg-white text-neutral-900 hover:bg-neutral-200'
    : 'bg-neutral-900 text-white hover:bg-neutral-700';

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setAccountMenuOpen(false);
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen((prev) => !prev);
    setMobileMenuOpen(false);
  };

  const closeAllMenus = () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <nav
          aria-label="Main navigation"
          className={`relative rounded-2xl border shadow-sm ${glass}`}
        >
          <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-2.5">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${softSurface}`}
              aria-label="Toggle main navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              onClick={closeAllMenus}
              className="text-xl font-bold tracking-tight shrink-0"
            >
              ShopVerse
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeAllMenus}
                  className={`text-sm font-medium transition-colors ${
                    darkMode
                      ? 'text-neutral-300 hover:text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Search */}
            <div
              className={`hidden md:flex flex-1 max-w-sm items-center gap-2 rounded-full border px-3.5 py-2 transition-all ${
                darkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white/60 border-neutral-200'
              } focus-within:border-neutral-400`}
            >
              <Search
                className={`w-4 h-4 shrink-0 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
              />
              <input
                type="text"
                placeholder="Search products…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2.5 rounded-full border transition-all duration-300 hover:scale-105 ${softSurface}`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link
                href="/account/cart"
                className={`relative hidden sm:flex items-center justify-center p-2.5 rounded-full border transition-all duration-300 hover:scale-105 ${softSurface}`}
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                <span
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                    darkMode ? 'bg-neutral-500' : 'bg-neutral-700'
                  }`}
                >
                  3
                </span>
              </Link>

              {user?.email ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleAccountMenu}
                    className={`flex items-center gap-1.5 p-1 pr-2 rounded-full border transition-all duration-300 ${softSurface}`}
                    aria-label="Account menu"
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        darkMode
                          ? 'bg-neutral-800 text-neutral-300'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${accountMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {accountMenuOpen && (
                    <div
                      className={`absolute right-0 mt-2.5 w-56 rounded-2xl border p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${glass}`}
                    >
                      <div
                        className={`px-3 py-2 border-b mb-1 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}
                      >
                        <p
                          className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}
                        >
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold truncate">{user.email}</p>
                      </div>
                      {accountItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setAccountMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                              item.danger
                                ? 'text-rose-500 hover:bg-rose-500/10'
                                : darkMode
                                  ? 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${softSurface}`}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </Link>
              )}

              <Link
                href="/account/cart"
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 ${solidButton}`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span
                  className={`h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    darkMode ? 'bg-neutral-900/15 text-neutral-900' : 'bg-white/20 text-white'
                  }`}
                >
                  5
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile drawer */}
          {mobileMenuOpen && (
            <div className={`lg:hidden mx-3 mb-3 rounded-2xl border p-4 space-y-3 ${glass}`}>
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-2 ${darkMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/60 border-neutral-200'}`}
              >
                <Search className="w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products, brands…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-medium hover:bg-neutral-500/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {!user?.email ? (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-semibold text-sm ${solidButton}`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in</span>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {accountItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          item.danger
                            ? 'text-rose-500 hover:bg-rose-500/10'
                            : 'hover:bg-neutral-500/10'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
