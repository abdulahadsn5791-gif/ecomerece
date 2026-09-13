'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface IngredientEditorProps {
  enabled: boolean;
  items: string[];
  busy?: boolean;
  onToggle: (enable: boolean) => void;
  onAdd: (items: string[]) => void;
  onRemove: (items: string[]) => void;
}

export function IngredientEditor({
  enabled,
  items,
  busy,
  onToggle,
  onAdd,
  onRemove,
}: IngredientEditorProps) {
  const { darkMode } = useThemeStore();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const inputCls = darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500';

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Ingredient name is required.');
      return;
    }
    setError('');
    onAdd([trimmed]);
    setValue('');
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
        This product has an ingredients list
      </label>

      {enabled && (
        <>
          {items.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    darkMode
                      ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {item}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onRemove([item])}
                    className="text-neutral-500 hover:text-rose-500 disabled:opacity-40"
                    aria-label={`Remove ${item}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder="Add an ingredient"
              className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls}`}
            />
            <button
              type="button"
              disabled={busy}
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
        </>
      )}
    </div>
  );
}
