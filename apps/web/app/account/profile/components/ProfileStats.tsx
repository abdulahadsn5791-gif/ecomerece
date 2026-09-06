import { UserResponseReadModel } from '@ecomerece/shared';
import { Clock, Calendar, Star, Ban } from 'lucide-react';
import React from 'react';

interface ProfileStatsProps {
    user: UserResponseReadModel;
    darkMode: boolean;
    formatDate: (date: any) => string;
}


export const ProfileStats = ({ user, darkMode, formatDate }: ProfileStatsProps) => {
    const isRestricted = user.isBlocked || user.isBanned;

    const stats: { icon: typeof Clock; label: string; value: string; color: string }[] = [
        { icon: Clock, label: 'Last login', value: formatDate(user.lastLogin), color: 'bg-blue-500' },
        { icon: Calendar, label: 'Member since', value: formatDate(user.createdAt), color: 'bg-violet-500' },
        {
            icon: isRestricted ? Ban : Star,
            label: 'Account status',
            value: isRestricted ? 'Restricted' : 'Active, good standing',
            color: isRestricted ? 'bg-rose-500' : 'bg-emerald-500',
        },
        ...(user.isBanned && user.bannedUntil
            ? [{ icon: Ban, label: 'Banned until', value: formatDate(user.bannedUntil), color: 'bg-orange-500' }]
            : []),
    ];

    return (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    className={`flex items-center gap-4 p-5 rounded-2xl transition-transform duration-200 hover:-translate-y-1 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.color}`}>
                        <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className={`text-xs font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {stat.label}
                        </p>
                        <p className={`font-semibold mt-0.5 ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
                            {stat.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};