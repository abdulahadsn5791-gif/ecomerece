import { motion } from 'framer-motion';
import React from 'react';

interface ProfileSkeletonProps {
    darkMode: boolean;
}

export const ProfileSkeleton = ({ darkMode }: ProfileSkeletonProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`rounded-[28px] p-8 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
    >
        <div className="flex flex-col sm:flex-row items-center gap-8 animate-pulse">
            <div className={`w-24 h-24 rounded-full ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
            <div className="flex-1 space-y-4 w-full">
                <div className={`h-7 w-48 rounded-full mx-auto sm:mx-0 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                <div className={`h-4 w-64 rounded-full mx-auto sm:mx-0 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                <div className="flex gap-2 justify-center sm:justify-start">
                    <div className={`h-7 w-20 rounded-full ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                    <div className={`h-7 w-20 rounded-full ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                </div>
            </div>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-20 rounded-2xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
            ))}
        </div>
    </motion.div>
);