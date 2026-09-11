'use client';
import { Link2, Maximize2, Trash2, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import { ImageLightbox } from './ImageLightbox';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif'];
const ACCEPTED_EXT = 'png,jpg,jpeg,gif,webp,avif';
const MAX_FILE_BYTES = 5 * 1024 * 1024;

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
}

/**
 * Image field for create/edit forms.
 *
 * Accepts either an external URL pasted into the text input or a local file
 * (converted client-side to a base64 data URI that the API uploads). The
 * preview is collapsed by default — expand it to view the image fullscreen.
 */
export function ImageInput({ value, onChange, darkMode }: ImageInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const isDataUri = value.startsWith('data:image/');
  const displayLabel = isDataUri && value.length > 80 ? `${value.slice(0, 60)}…` : value;

  const inputCls = `w-full p-3 text-sm rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
    darkMode
      ? 'bg-neutral-800 text-white placeholder-neutral-500'
      : 'bg-neutral-100 text-neutral-900 placeholder-neutral-400'
  }`;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError(`Unsupported file type. Use ${ACCEPTED_EXT.replaceAll(',', ', ')}.`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError('Image is too large. Maximum size is 5MB.');
      return;
    }
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.onerror = () => setFileError('Could not read the selected file.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-white transition-all bg-violet-600 hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 active:scale-95"
        >
          <UploadCloud className="w-4 h-4" />
          Choose Image
        </button>
        <span
          className={`flex items-center gap-1.5 text-[11px] ${
            darkMode ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          PNG, JPG, GIF, WEBP, AVIF · max 5MB
        </span>
      </div>

      <input
        type="text"
        placeholder="…or paste an image URL"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setFileError(null);
        }}
        className={inputCls}
      />

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {fileError && (
        <p className={`text-xs font-medium ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
          {fileError}
        </p>
      )}

      {value && (
        <div
          className={`flex items-center gap-3 p-2 rounded-2xl border ${
            darkMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-900">
            <img
              src={value}
              alt="Uploaded preview thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-semibold truncate ${
                darkMode ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {displayLabel}
            </p>
            <p className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {isDataUri ? 'Uploaded from file' : 'External URL'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            title="Expand to fullscreen preview"
            aria-label="Expand to fullscreen preview"
            className={`p-2 rounded-xl transition-colors ${
              darkMode
                ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white'
                : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              onChange('');
              setFileError(null);
            }}
            title="Remove image"
            aria-label="Remove image"
            className="p-2 rounded-xl transition-colors text-rose-500 hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <ImageLightbox
        src={previewOpen ? value : null}
        alt="Image preview"
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
