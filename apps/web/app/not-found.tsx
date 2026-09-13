'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const { darkMode } = useThemeStore();

  const border = darkMode ? 'border-neutral-800' : 'border-neutral-200';
  const muted = darkMode ? 'text-neutral-500' : 'text-neutral-500';

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${
        darkMode ? 'bg-neutral-950' : 'bg-slate-50'
      }`}
    >
      <div className="flex flex-col items-center w-full max-w-md text-center">
        <Link
          href="/"
          className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}
        >
          ShopVerse
        </Link>

        <div
          className={`w-full mt-8 rounded-[28px] border shadow-sm p-10 sm:p-12 ${border} ${
            darkMode ? 'bg-neutral-900' : 'bg-white'
          }`}
        >
          <p
            className={`text-7xl sm:text-8xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}
          >
            404
          </p>

          <h1
            className={`mt-4 text-xl font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}
          >
            Page not found
          </h1>

          <p className={`text-sm mt-2 leading-relaxed ${muted}`}>
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. Check the
            URL and try again.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95 ${
                darkMode
                  ? 'bg-white text-neutral-900 hover:bg-neutral-200'
                  : 'bg-neutral-900 text-white hover:bg-neutral-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <Link
              href="/shop"
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-colors ${
                darkMode
                  ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Browse products
            </Link>
          </div>
        </div>

        <p className={`text-xs mt-8 ${muted}`}>error not_found</p>
      </div>
    </main>
  );
}
