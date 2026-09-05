"use client";

import { useProfileManager, useThemeStore } from '@ecomerece/frontend';
import { motion } from 'framer-motion';
import { ProfileSkeleton } from './ProfileSkeleton';
import { ProfileErrorState } from './ProfileErrorState';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { DangerZone } from './DangerZone';


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
        return <ProfileErrorState darkMode={darkMode} refetch={refetch} isFetching={isFetching} />;
    }

    return (
        <main className="lg:col-span-3 relative">
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