'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { Check, Loader2, Plus, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ImageInput, ImageLightbox } from '@/components/image';

export interface ProductImageEntry {
  url: string;
  alt: string;
  default: boolean;
}

interface ImageListEditorProps {
  images: ProductImageEntry[];
  busy?: boolean;
  onAdd: (img: ProductImageEntry) => void;
  onRemove: (img: ProductImageEntry) => void;
  onSetDefault?: (index: number) => void;
}

export function ImageListEditor({
  images,
  busy,
  onAdd,
  onRemove,
  onSetDefault,
}: ImageListEditorProps) {
  const { darkMode } = useThemeStore();
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [makeDefault, setMakeDefault] = useState(false);
  const [error, setError] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const inputCls = darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500';

  const handleAdd = () => {
    const trimmedUrl = url.trim();
    const trimmedAlt = alt.trim();
    if (!trimmedUrl) {
      setError('Choose an image file or paste an image URL.');
      return;
    }
    if (!trimmedAlt) {
      setError('Alt text is required.');
      return;
    }
    setError('');
    onAdd({ url: trimmedUrl, alt: trimmedAlt, default: makeDefault || images.length === 0 });
    setUrl('');
    setAlt('');
    setMakeDefault(false);
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((img, i) => (
            <div
              key={img.url}
              className={`flex items-start gap-3 p-3 rounded-2xl border ${
                darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => setPreviewSrc(img.url)}
                title="Preview image"
                aria-label="Preview image"
                className="shrink-0 rounded-xl overflow-hidden bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {/* biome-ignore lint/performance/noImgElement: editor thumbnail */}
                <img src={img.url} alt={img.alt} className="w-14 h-14 object-cover" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{img.alt || 'No alt text'}</p>
                <p
                  className={`text-xs truncate ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
                >
                  {img.url}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {img.default && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        darkMode
                          ? 'bg-emerald-900/30 text-emerald-400'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      Default
                    </span>
                  )}
                  {onSetDefault && !img.default && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onSetDefault(i)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 disabled:opacity-40"
                    >
                      <Star className="w-3 h-3" />
                      Set default
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onRemove(img)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-400 disabled:opacity-40"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={`rounded-2xl border p-3 space-y-2 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Add image</p>
        <ImageInput value={url} onChange={setUrl} darkMode={darkMode} tone="emerald" />
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Alt text"
          className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls}`}
        />
        <div className="flex items-center justify-between gap-2">
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={makeDefault}
              onChange={(e) => setMakeDefault(e.target.checked)}
              className="w-4 h-4 accent-emerald-500"
            />
            Set as default image
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>

      {images.length > 0 && !images.some((img) => img.default) && (
        <p
          className={`text-xs flex items-center gap-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}
        >
          <Check className="w-3 h-3" />
          No default image set — the first image is shown on the storefront.
        </p>
      )}

      <ImageLightbox
        src={previewSrc}
        alt="Product image preview"
        onClose={() => setPreviewSrc(null)}
      />
    </div>
  );
}
