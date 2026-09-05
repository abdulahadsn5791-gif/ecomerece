"use client";

import { useProfileManager, useThemeStore } from '@ecomerece/frontend';
import { motion } from 'framer-motion';
import { ProfileSkeleton } from './components/ProfileSkeleton';
import { ProfileErrorState } from './components/ProfileErrorState';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { DangerZone } from './components/DangerZone';



export default function ProfileMain() {
    const { darkMode } = useThemeStore();
    const {
        user,
        isLoading,
        error,
        refetch,
        isFetching,
        deleteAccount,
        isDeleting,
        deleteError,
        resetDelete,
        formatDate,
    } = useProfileManager();

    if (isLoading) return <main className="lg:col-span-3"><ProfileSkeleton darkMode={darkMode} /></main>;

    if (error || !user) {
        return <main className="lg:col-span-3"><ProfileErrorState darkMode={darkMode} refetch={refetch} isFetching={isFetching} /></main>;
    }

    return (
        <main className="lg:col-span-3 ">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`border rounded-3xl p-8 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                    }`}
            >
                <ProfileHeader user={user} darkMode={darkMode} />
                <ProfileStats user={user} darkMode={darkMode} formatDate={formatDate} />
                <DangerZone
                    darkMode={darkMode}
                    deleteAccount={deleteAccount}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    resetDelete={resetDelete}
                />
            </motion.div>
        </main>
    );
}