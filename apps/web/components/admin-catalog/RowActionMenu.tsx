'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import React, { useState } from 'react';

export interface RowActionItem {
  key: string;
  label: string;
  icon: React.ElementType;
  danger?: boolean;
  onClick: () => void;
}

export function RowActionMenu({
  items,
  darkMode: propDark,
}: {
  items: RowActionItem[];
  darkMode?: boolean;
}) {
  const { darkMode: themeDark } = useThemeStore();
  const darkMode = propDark ?? themeDark;
  const [open, setOpen] = useState(false);

  const menuBtnCls = darkMode
    ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
    : 'hover:bg-neutral-100 text-neutral-500 hover:text-black';

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`p-2 rounded-full transition-colors ${menuBtnCls} ${
          open ? (darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black') : ''
        }`}
        aria-label="Row actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close menu"
              className="fixed inset-0 z-20 cursor-default"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-full mt-1 z-30 w-52 rounded-2xl border shadow-xl overflow-hidden ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-700 shadow-black/40'
                  : 'bg-white border-neutral-200 shadow-neutral-200/60'
              }`}
            >
              {items.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === items.length - 1;
                return (
                  <React.Fragment key={item.key}>
                    {idx > 0 && (
                      <div
                        className={`h-px ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'} ${isLast ? 'my-1' : ''}`}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        item.onClick();
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                        item.danger
                          ? darkMode
                            ? 'text-rose-400 hover:bg-rose-500/10'
                            : 'text-rose-600 hover:bg-rose-50'
                          : darkMode
                            ? 'text-neutral-200 hover:bg-neutral-800'
                            : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </React.Fragment>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
