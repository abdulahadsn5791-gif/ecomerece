import { useThemeStore } from '../stores/theme.store';

export const useTheme = () => {
  const { darkMode, isLoading, toggleTheme, setDarkMode } = useThemeStore();
  return { darkMode, isLoading, toggleTheme, setDarkMode };
};