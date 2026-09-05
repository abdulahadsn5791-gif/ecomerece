"use client";

import { useThemeStore } from '@ecomerece/frontend';
import Aside from '@/components/aside/Aside';
import ProfileMain from './components/ProfileMain';

export default function ProfilePage() {
    const { darkMode } = useThemeStore();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <Aside />
                    <ProfileMain />
                </div>
            </div>
        </div>
    );
}