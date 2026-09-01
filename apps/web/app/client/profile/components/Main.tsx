import { useAuth, useTheme, useComponentState, ButtonLoader } from '@ecomerece/frontend';
import { User, Mail, ShieldCheck, BadgeCheck, Clock, Calendar, Ban, Trash2, Star } from 'lucide-react';
import { useState } from 'react';

export default function Main() {


    const auth = useAuth(true);
    const user = auth.user;
    const { darkMode } = useTheme();
    const formatDate = (date: string | Date | null) => {
        if (!date) return 'Never';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    const { isLoading: authLoading } = useAuth();

    const { isLoading: isDeleting } = useComponentState();

    const [reason, setReason] = useState('');

    return (
        <main className={`lg:col-span-3 space-y-6   ${authLoading ? "blur-sm animate-pulse-blur " : ""} `}>
            <div className={`border rounded-2xl p-6 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div
                        className={`w-20 h-20 rounded-full overflow-hidden border-2 flex-shrink-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}
                    >
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}
                            >
                                <User className="w-10 h-10 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <h2
                                className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                {user?.fullName}
                            </h2>
                            <BadgeCheck className="w-5 h-5 text-blue-500" />
                        </div>
                        <p
                            className={`flex items-center gap-1 justify-center sm:justify-start ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                        >
                            <Mail className="w-4 h-4" /> {user?.email ?? 'No email provided'}
                        </p>
                        <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${darkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {user?.role}
                        </span>
                        {user?.isBlocked && (
                            <span
                                className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold ${darkMode
                                    ? 'bg-red-900/30 text-red-300'
                                    : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                Blocked
                            </span>
                        )}
                        {user?.isBanned && (
                            <span
                                className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold ${darkMode
                                    ? 'bg-red-900/30 text-red-300'
                                    : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                Banned
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {user?.isBlocked || user?.isBanned ? (
                            <Ban className="w-6 h-6 text-red-500" />
                        ) : (
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                        )}
                    </div>
                </div>


                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                        className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                            }`}
                    >
                        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                Last Login
                            </p>
                            <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                                {formatDate(user?.lastLogin)}
                            </p>
                        </div>
                    </div>
                    <div
                        className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                            }`}
                    >
                        <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <div>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                Member Since
                            </p>
                            <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                                {formatDate(user?.createdAt)}
                            </p>
                        </div>
                    </div>
                    {user?.isBanned && user?.bannedUntil && (
                        <div
                            className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-red-900/20' : 'bg-red-50'
                                }`}
                        >
                            <Ban className="w-5 h-5 text-red-500 dark:text-red-400" />
                            <div>
                                <p className={darkMode ? 'text-red-400' : 'text-red-500'}>
                                    Banned Until
                                </p>
                                <p className={darkMode ? 'text-red-300' : 'text-red-600'}>
                                    {formatDate(user?.bannedUntil)}
                                </p>
                            </div>
                        </div>
                    )}
                    <div
                        className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                            }`}
                    >
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                Account Status
                            </p>
                            <p className={darkMode ? 'text-white' : 'text-gray-900'}>
                                {user?.isBlocked || user?.isBanned ? 'Restricted' : 'Active'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`mt-6 pt-6 border-t flex flex-col sm:flex-row items-center gap-3 justify-end ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <textarea
                        rows={2}
                        placeholder="Why are you leaving?"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={`w-full sm:w-64 px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                    />
                    <ButtonLoader
                        isLoading={isDeleting}



                        className="w-full sm:w-auto"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                    </ButtonLoader>
                </div>

            </div>
        </main>
    );
}