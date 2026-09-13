'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

/**
 * Fullscreen image preview. Hidden (closed) until `src` is set — expand from
 * a collapsed thumbnail to view the image at full size.
 */
export function ImageLightbox({ src, alt = 'Image preview', onClose }: ImageLightboxProps) {
  const isOpen = Boolean(src);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && src && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <motion.div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-6xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-11 right-0">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close image preview"
                className="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={src}
              alt={alt}
              className="w-full max-h-[85vh] object-contain rounded-3xl bg-neutral-950 shadow-2xl"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
