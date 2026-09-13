'use client';
import { useAppSettingsStore } from '@ecomerece/frontend/app-settings';
import { storageAdapter } from '@ecomerece/frontend/storage';
import { type ReactNode, useEffect, useState } from 'react';
import { GlobalLoader } from '@/components/loaders/GlobalLoader';

function Bootloader({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const init = async () => {
      await storageAdapter.ensureReady();
      await useAppSettingsStore.getState().initAppSettings();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <GlobalLoader />;
  else return children;
}

export default Bootloader;
