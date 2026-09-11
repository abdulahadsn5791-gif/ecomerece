import { useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { DEFAULT_ICON_NAME, DynamicIcon, ICON_NAMES, resolveIconName } from '@/lib/icons';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  darkMode: boolean;
  label?: string;
}

export const IconPicker = ({ value, onChange, darkMode, label = 'Icon' }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const current = resolveIconName(value);
  const filtered = ICON_NAMES.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));

  const inputCls = `w-full p-3 text-sm rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
    darkMode
      ? 'bg-neutral-800 text-white placeholder-neutral-500'
      : 'bg-neutral-100 text-neutral-900 placeholder-neutral-400'
  }`;

  return (
    <div>
      <p className={`text-xs mb-1.5 font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
        {label}
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full flex items-center gap-3 p-3 text-sm rounded-2xl border transition-colors ${
          darkMode
            ? 'bg-neutral-800 text-white border-neutral-700 hover:border-violet-500/50'
            : 'bg-neutral-100 text-neutral-900 border-neutral-200 hover:border-violet-500/50'
        }`}
      >
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            darkMode ? 'bg-neutral-700' : 'bg-white'
          }`}
        >
          <DynamicIcon name={value} className="w-5 h-5 text-violet-500" strokeWidth={1.75} />
        </span>
        <span className="flex-1 text-left truncate font-medium">
          {value || DEFAULT_ICON_NAME}
        </span>
        <span className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
          Change
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-5 ${
              darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                Pick an icon
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`p-2 rounded-xl transition-colors ${
                  darkMode
                    ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                    : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-neutral-500' : 'text-neutral-400'
                }`}
              />
              <input
                autoFocus
                placeholder="Search icons…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${inputCls} pl-10`}
              />
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-72 overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <p
                  className={`col-span-full text-center text-sm py-8 ${
                    darkMode ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  No icons match &ldquo;{query}&rdquo;
                </p>
              ) : (
                filtered.map((name) => {
                  const selected = resolveIconName(value) === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => {
                        onChange(name);
                        setOpen(false);
                        setQuery('');
                      }}
                      className={`relative h-12 rounded-xl flex items-center justify-center transition-colors ${
                        selected
                          ? 'bg-violet-500 text-white ring-2 ring-violet-500'
                          : darkMode
                            ? 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                            : 'bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200'
                      }`}
                    >
                      <DynamicIcon name={name} className="w-5 h-5" strokeWidth={1.75} />
                      {selected && <Check className="absolute bottom-1 right-1 w-3 h-3" />}
                    </button>
                  );
                })
              )}
            </div>

            {value && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`mt-4 text-sm font-medium ${
                  darkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Keep current icon
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};