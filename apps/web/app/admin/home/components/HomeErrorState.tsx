import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useThemeStore } from '@ecomerece/frontend';
import MutationButton from '@/components/Mutationbutton';
import React from 'react';

interface HomeErrorStateProps {
  refetch: () => void;
  isFetching: boolean;
}

export const HomeErrorState = ({ refetch, isFetching }: HomeErrorStateProps) => {
  const { darkMode } = useThemeStore();

  return (
    <main className="lg:col-span-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[28px] p-10 text-center ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-rose-500">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h3
          className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}
        >
          Unable to load home layout
        </h3>
        <p
          className={`mb-6 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
        >
          We ran into an issue fetching the home page configuration.
        </p>
        <MutationButton
          variant="info"
          isLoading={isFetching}
          loadingText="Syncing..."
          onClick={refetch}
          icon={RefreshCw}
        >
          Try again
        </MutationButton>
      </motion.div>
    </main>
  );
};
