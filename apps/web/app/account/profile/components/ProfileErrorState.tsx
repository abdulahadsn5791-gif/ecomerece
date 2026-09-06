import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import React from 'react';

interface ProfileErrorStateProps {
    darkMode: boolean;
    refetch: () => void;
    isFetching: boolean;
}

export const ProfileErrorState = ({ darkMode, refetch, isFetching }: ProfileErrorStateProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[28px] p-10 text-center ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
    >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-rose-500">
            <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
            Unable to load profile
        </h3>
        <p className={`mb-6 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            We ran into an issue fetching your data.
        </p>
        <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
        >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Syncing…' : 'Try again'}
        </button>
    </motion.div>
);