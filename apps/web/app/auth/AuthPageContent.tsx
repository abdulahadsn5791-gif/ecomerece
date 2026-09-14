'use client';

import { authAdapter } from '@ecomerece/frontend/auth';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { useGetMe } from '@ecomerece/frontend/user';
import { Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthPageContent() {
  const { darkMode, toggleTheme } = useThemeStore();
  const { data: user } = useGetMe();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await authAdapter.signInWithGoogle();
    } catch {
      setSigningIn(false);
    }
  };

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'
      }`}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-5 sm:px-8">
        <a
          href="/"
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            darkMode ? 'text-white' : 'text-neutral-900'
          }`}
        >
          <span className="text-violet-500">Shop</span>
          <span>Verse</span>
        </a>
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
            darkMode
              ? 'bg-neutral-900/80 border-neutral-800 hover:bg-neutral-800 text-white'
              : 'bg-white/60 border-neutral-200 hover:bg-neutral-100 text-neutral-900'
          }`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-sm font-medium">{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Auth form */}
      <div className="flex min-h-screen">
        {/* Left image panel */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <img
            src="https://picsum.photos/seed/shopping/1200/1600"
            alt="Shopping"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h2 className="text-3xl font-bold mb-2">
              Premium Products,
              <br />
              Unbeatable Prices
            </h2>
            <p className="text-lg opacity-90">Join millions of happy customers.</p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-10 sm:px-10">
          <div
            className={`w-full max-w-md rounded-[28px] border p-8 sm:p-10 ${
              darkMode
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-white border-neutral-200/70 shadow-sm'
            }`}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome to ShopVerse</h1>
            <p className={`mb-8 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Sign in to continue your shopping journey.
            </p>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-2xl bg-white border border-neutral-200 text-neutral-700 font-medium text-sm tracking-wide transition-colors hover:bg-neutral-50 hover:shadow-sm active:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="20"
                height="20"
                role="img"
                aria-label="Google"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span>{signingIn ? 'Signing in…' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center gap-3 my-6 text-neutral-400 dark:text-neutral-500 text-sm">
              <div className={`flex-1 h-px ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
              OR
              <div className={`flex-1 h-px ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
            </div>

            <p
              className={`text-center text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              We currently support Google authentication only.
            </p>

            <p
              className={`text-center text-sm mt-5 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              By continuing, you agree to our{' '}
              <a
                href="/terms-of-service"
                className={`underline ${
                  darkMode
                    ? 'text-white hover:text-violet-400'
                    : 'text-neutral-900 hover:text-violet-600'
                }`}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy-policy"
                className={`underline ${
                  darkMode
                    ? 'text-white hover:text-violet-400'
                    : 'text-neutral-900 hover:text-violet-600'
                }`}
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
