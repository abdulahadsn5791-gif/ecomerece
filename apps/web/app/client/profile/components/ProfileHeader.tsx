import { User, Mail, BadgeCheck } from 'lucide-react';

interface ProfileHeaderProps {
    user: any;
    darkMode: boolean;
}

export const ProfileHeader = ({ user, darkMode }: ProfileHeaderProps) => (
    <div className="flex flex-col sm:flex-row items-center gap-8 relative">
        <div className="relative group">
            <div className={`w-24 h-24 rounded-full overflow-hidden ring-4 transition-all duration-300 group-hover:ring-8 ${darkMode ? 'ring-gray-800' : 'ring-gray-50'}`}>
                {user.image ? (
                    <img src={user.image} alt={user.fullName ?? 'Profile'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <User className="w-10 h-10 text-gray-400" />
                    </div>
                )}
            </div>
            <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 ${darkMode ? 'border-gray-900' : 'border-white'} ${user.isBlocked || user.isBanned ? 'bg-red-500' : 'bg-green-500'}`} />
        </div>

        <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user.fullName}
                </h2>
                <BadgeCheck className="w-6 h-6 text-blue-500 drop-shadow-sm" />
            </div>
            <p className={`flex items-center gap-2 mt-1 justify-center sm:justify-start font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Mail className="w-4 h-4 opacity-70" /> {user.email ?? 'No email provided'}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {user.role}
                </span>
                {user.isBlocked && (
                    <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase animate-pulse ${darkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-700'}`}>
                        Blocked
                    </span>
                )}
                {user.isBanned && (
                    <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${darkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-700'}`}>
                        Banned
                    </span>
                )}
            </div>
        </div>
    </div>
);