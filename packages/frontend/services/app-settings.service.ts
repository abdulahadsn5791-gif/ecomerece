import { storageAdapter } from '@ecomerece/frontend/storage';
import { create } from 'zustand';

const SETTINGS_KEY = 'app-settings';

export interface AppSettings {
  footerEnabled: boolean;
}

export const defaultAppSettings: AppSettings = {
  footerEnabled: true,
};

interface AppSettingsState extends AppSettings {
  isInitialized: boolean;
  initAppSettings: () => Promise<void>;
  setFooterEnabled: (enabled: boolean, persist?: boolean) => void;
  resetAppSettings: () => void;
}

export const useAppSettingsStore = create<AppSettingsState>((set, get) => ({
  ...defaultAppSettings,
  isInitialized: false,

  initAppSettings: async () => {
    if (get().isInitialized || typeof window === 'undefined') return;

    try {
      await storageAdapter.ensureReady();
      const stored = await storageAdapter.getItem<Partial<AppSettings>>(SETTINGS_KEY);
      set({
        footerEnabled: stored?.footerEnabled ?? defaultAppSettings.footerEnabled,
        isInitialized: true,
      });
    } catch {
      set({ isInitialized: true });
    }
  },

  setFooterEnabled: (enabled: boolean, persist = true) => {
    set({ footerEnabled: enabled });
    if (persist && typeof window !== 'undefined') {
      void storageAdapter.setItem<AppSettings>(SETTINGS_KEY, { footerEnabled: enabled });
    }
  },

  resetAppSettings: () => {
    set({ ...defaultAppSettings });
    if (typeof window !== 'undefined') {
      void storageAdapter.setItem<AppSettings>(SETTINGS_KEY, defaultAppSettings);
    }
  },
}));
