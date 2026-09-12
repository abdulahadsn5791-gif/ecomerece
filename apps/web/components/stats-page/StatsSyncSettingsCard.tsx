'use client';

import {
  useGetStatsSyncSettings,
  useTriggerProductStatsDenormalization,
  useUpdateStatsSyncSettings,
} from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsSyncSettingsCardProps {
  accent?: string;
}

export const StatsSyncSettingsCard = ({ accent = '#7C3AED' }: StatsSyncSettingsCardProps) => {
  const { darkMode } = useThemeStore();
  const { data: settings, isLoading } = useGetStatsSyncSettings();
  const updateSettings = useUpdateStatsSyncSettings();
  const trigger = useTriggerProductStatsDenormalization();

  const [intervalInput, setIntervalInput] = useState<string>('');
  const [autoEnabled, setAutoEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (settings) {
      setIntervalInput(String(settings.intervalHours));
      setAutoEnabled(settings.autoDenormalizeEnabled);
    }
  }, [settings]);

  const card = `rounded-[28px] p-6 transition-colors duration-500 ${
    darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
  }`;
  const labelCls = darkMode ? 'text-neutral-400' : 'text-neutral-500';
  const inputCls = `w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors ${
    darkMode
      ? 'bg-neutral-800 text-white border border-neutral-700'
      : 'bg-neutral-100 text-neutral-900 border border-neutral-200'
  }`;

  const lastRun = settings?.lastRun ? new Date(settings.lastRun).toLocaleString() : 'Never';

  const saveInterval = () => {
    const parsed = Number(intervalInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    updateSettings.mutate({ intervalHours: Math.round(parsed) });
  };

  const toggleAuto = (next: boolean) => {
    setAutoEnabled(next);
    updateSettings.mutate({ autoDenormalizeEnabled: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      className={card}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3
              className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-neutral-900'}`}
            >
              Product Stats Sync
            </h3>
            <p className={`text-xs ${labelCls}`}>Denormalization interval &amp; corrections</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div
          className={`animate-pulse h-24 rounded-2xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="syncInterval" className={`text-xs font-medium ${labelCls}`}>
              Auto-refresh every (hours)
            </label>
            <div className="flex items-center gap-2 mt-1.5">
              <input
                id="syncInterval"
                type="number"
                min={1}
                max={672}
                value={intervalInput}
                onChange={(e) => setIntervalInput(e.target.value)}
                onBlur={saveInterval}
                onKeyDown={(e) => e.key === 'Enter' && saveInterval()}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <span className={`text-xs font-medium ${labelCls}`}>Denormalize automatically</span>
            <button
              type="button"
              role="switch"
              aria-checked={autoEnabled}
              onClick={() => toggleAuto(!autoEnabled)}
              className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
              }`}
            >
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  autoEnabled ? '' : darkMode ? 'bg-neutral-600' : 'bg-neutral-300'
                }`}
                style={autoEnabled ? { backgroundColor: accent } : undefined}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    autoEnabled ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </span>
              <span className={darkMode ? 'text-neutral-200' : 'text-neutral-700'}>
                {autoEnabled ? 'On' : 'Off'}
              </span>
            </button>
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <p className={`text-xs ${labelCls}`}>
              Last run: <span className="font-medium">{lastRun}</span>
            </p>
            <button
              type="button"
              onClick={() => trigger.mutate()}
              disabled={trigger.isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              <RefreshCw className={`w-4 h-4 ${trigger.isPending ? 'animate-spin' : ''}`} />
              {trigger.isPending ? 'Running correction…' : 'Run data correction'}
            </button>
          </div>

          {(updateSettings.isError || updateSettings.isSuccess) && (
            <p
              className={`sm:col-span-2 text-xs ${updateSettings.isError ? 'text-rose-500' : 'text-emerald-500'}`}
            >
              {updateSettings.isError ? 'Could not update settings. Try again.' : 'Settings saved.'}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};
