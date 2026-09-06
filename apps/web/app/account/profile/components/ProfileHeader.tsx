import { UserResponseReadModel } from '@ecomerece/shared';
import { User, Mail, BadgeCheck } from 'lucide-react';
import React from 'react';

interface ProfileHeaderProps {
    user: UserResponseReadModel;
    darkMode: boolean;
}

export const ProfileHeader = ({ user, darkMode }: ProfileHeaderProps) => {


    return (

        <div className="flex flex-col sm:flex-row items-center gap-8 relative">
            <div className="relative">
                <div
                    className={`w-24 h-24 rounded-full overflow-hidden ring-4 ${darkMode ? 'ring-blue-500/30' : 'ring-blue-500/15'
                        }`}
                >
                    {user.image ? (
                        <img src={user.image} alt={user.fullName ?? 'Profile'} className="w-full h-full object-cover" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                            <User className="w-10 h-10 text-neutral-400" />
                        </div>
                    )}
                </div>
                <div
                    className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 flex items-center justify-center ${darkMode ? 'border-neutral-900' : 'border-white'
                        } ${user.isBlocked || user.isBanned ? 'bg-rose-500' : 'bg-emerald-500'}`}
                />
            </div>

            <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h2 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                        {user.fullName}
                    </h2>
                    <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/15" />
                </div>
                <p className={`flex items-center gap-2 mt-1.5 justify-center sm:justify-start font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    <Mail className="w-4 h-4 opacity-70" /> {user.email ?? 'No email provided'}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-blue-500 capitalize">
                        {user.role}
                    </span>
                    {user.isBlocked && (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-rose-500">Blocked</span>
                    )}
                    {user.isBanned && (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-rose-500">Banned</span>
                    )}
                </div>
            </div>
        </div>
    )
};