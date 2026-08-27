import { useState, useEffect } from 'react';
import { storageAdapter } from '@ecomerece/frontend/storage';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    const load = async () => {
      const stored = await storageAdapter.getItem<boolean>('theme');
      if (stored !== null) {
        setDarkMode(stored);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Apply theme – runs on web and native
  useEffect(() => {
    if (!loading) {
      // 👇 Guard: only manipulate DOM on the web
      if (typeof document !== 'undefined') {
        if (darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      // Persist the preference (works on both platforms)
      storageAdapter.setItem('theme', darkMode);
    }
  }, [darkMode, loading]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return { darkMode, toggleTheme, loading };
};