'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { FileWarning, Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';

export interface DisclaimerEntry {
  name: string;
  title: string;
}

interface DisclaimerEditorProps {
  enabled: boolean;
  items: DisclaimerEntry[];
  busy?: boolean;
  onToggle: (enable: boolean) => void;
  onAdd: (items: DisclaimerEntry[]) => void;
  onRemove: (items: DisclaimerEntry[]) => void;
}

export function DisclaimerEditor({
  enabled,
  items,
  busy,
  onToggle,
  onAdd,
  onRemove,
}: DisclaimerEditorProps) {
  const { darkMode } = useThemeStore();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const inputCls = darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500';

  const handleAdd = () => {
    const trimmedName = name.trim();
    const trimmedTitle = title.trim();
    if (!trimmedName || !trimmedTitle) {
      setError('Disclaimer name and title are required.');
      return;
    }
    setError('');
    onAdd([{ name: trimmedName, title: trimmedTitle }]);
    setName('');
    setTitle('');
  };

  return (
    <div className="space-y-3">
      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          disabled={busy}
          className="w-4 h-4 accent-emerald-500"
        />
        This product has disclaimers
      </label>

      {enabled && (
        <>
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((d) => (
                <div
                  key={d.name}
                  className={`flex items-start gap-3 p-3 rounded-2xl border ${
                    darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
                  }`}
                >
                  <FileWarning
                    className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{d.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {d.title}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onRemove([d])}
                    className="text-neutral-500 hover:text-rose-500 disabled:opacity-40"
                    aria-label={`Remove ${d.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div
            className={`rounded-2xl border p-3 space-y-2 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Disclaimer name (e.g. Fragrance warnings)"
              className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls}`}
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder="Disclaimer title / body text"
              className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls}`}
            />
            <div className="flex justify-end">
              <button
                type="button"
                disabled={busy}
                onClick={handleAdd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add disclaimer
              </button>
            </div>
            {error && <p className="text-xs text-rose-500">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}
