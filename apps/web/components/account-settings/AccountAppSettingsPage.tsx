'use client';

import { useAppSettingsStore } from '@ecomerece/frontend/app-settings';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { Moon, PanelBottom, RotateCcw, Sun } from 'lucide-react';
import type { ReactNode } from 'react';

function SectionCard({
  darkMode,
  title,
  description,
  icon,
  children,
}: {
  darkMode: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[28px] p-6 sm:p-8 border shadow-sm space-y-5 transition-colors duration-300 ${
        darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-100 border-neutral-200'
          }`}
        >
          {icon}
        </span>
        <div>
          <h2 className="font-semibold tracking-tight">{title}</h2>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function AccountAppSettingsPage() {
  const { darkMode, setDarkMode } = useThemeStore();
  const { footerEnabled, setFooterEnabled, resetAppSettings } = useAppSettingsStore();

  const surface = darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200';
  const solid = darkMode
    ? 'bg-white text-neutral-900 hover:bg-neutral-200'
    : 'bg-neutral-900 text-white hover:bg-neutral-700';
  const muted = darkMode ? 'text-neutral-500' : 'text-neutral-500';

  const segmentedBase = `flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors ${
    darkMode ? 'text-neutral-300' : 'text-neutral-600'
  }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">App Settings</h1>
        <p className={`text-sm mt-1 ${muted}`}>
          Preferences are stored locally on this device only.
        </p>
      </div>

      <SectionCard
        darkMode={darkMode}
        title="Appearance"
        description="Choose how ShopVerse looks on this device."
        icon={darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      >
        <div
          className={`flex gap-1 rounded-2xl border p-1 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}
        >
          <button
            type="button"
            onClick={() => setDarkMode(false, true)}
            aria-pressed={!darkMode}
            className={`${segmentedBase} ${!darkMode ? solid : ''}`}
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            type="button"
            onClick={() => setDarkMode(true, true)}
            aria-pressed={darkMode}
            className={`${segmentedBase} ${darkMode ? solid : ''}`}
          >
            <Moon className="w-4 h-4" />
            Dark
          </button>
        </div>
      </SectionCard>

      <SectionCard
        darkMode={darkMode}
        title="Footer layout"
        description="Shrink the storefront footer to a compact brand bar."
        icon={<PanelBottom className="w-4 h-4" />}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Compact footer</p>
            <p className={`text-xs mt-0.5 ${muted}`}>
              Shows only the ShopVerse brand and copyright.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={!footerEnabled}
            aria-label="Toggle compact footer"
            onClick={() => setFooterEnabled(!footerEnabled, true)}
            className={`relative h-8 w-14 shrink-0 rounded-full border transition-colors ${
              !footerEnabled ? solid : surface
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full transition-all ${
                !footerEnabled
                  ? `left-[30px] ${darkMode ? 'bg-neutral-900' : 'bg-white'}`
                  : `left-1 ${darkMode ? 'bg-neutral-400' : 'bg-neutral-500'}`
              }`}
            />
          </button>
        </div>
      </SectionCard>

      <button
        type="button"
        onClick={() => {
          resetAppSettings();
          setDarkMode(false, true);
        }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
          darkMode
            ? 'border-neutral-800 text-neutral-400 hover:text-white'
            : 'border-neutral-200 text-neutral-600 hover:text-black'
        }`}
      >
        <RotateCcw className="w-4 h-4" />
        Reset to defaults
      </button>
    </div>
  );
}
