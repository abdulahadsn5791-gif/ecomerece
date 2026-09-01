'use client'
import { useThemeStore } from '../stores/theme.store';

export const useTheme = () => {
  const { darkMode, isInitialized: isLoading, toggleTheme, setDarkMode } = useThemeStore();
  return { darkMode, isLoading, toggleTheme, setDarkMode };
};