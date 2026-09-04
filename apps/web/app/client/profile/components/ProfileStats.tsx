import { Clock, Calendar, Star, Ban } from 'lucide-react';

interface ProfileStatsProps {
    user: any;
    darkMode: boolean;
    formatDate: (date: any) => string;
}

export const ProfileStats = ({ user, darkMode, formatDate }: ProfileStatsProps) => {
    const stats = [
        { icon: Clock, label: 'Last Login', value: formatDate(user.lastLogin), color: 'text-blue-500' },
        { icon: Calendar, label: 'Member Since', value: formatDate(user.createdAt), color: 'text-purple-500' },
        { icon: Star, label: 'Account Status', value: user.isBlocked || user.isBanned ? 'Restricted' : 'Active in Good Standing', color: 'text-yellow-500' },
        ...(user.isBanned && user.bannedUntil ? [{ icon: Ban, label: 'Banned Until', value: formatDate(user.bannedUntil), color: 'text-red-500' }] : [])
    ];

    return (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-white hover:shadow-md hover:shadow-gray-200/50'}`}>
                    <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white shadow-sm'}`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
                        <p className={`font-medium mt-0.5 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};