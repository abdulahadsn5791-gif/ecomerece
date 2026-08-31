"use client";

import { useState } from 'react';
import { X, AlertTriangle, Loader2, User, Mail, ShieldCheck, BadgeCheck, Clock, Calendar, Ban, Trash2, Star } from 'lucide-react';
import { useAuth, useTheme } from '@ecomerece/frontend';
import Aside from '@/components/aside/Aside';

export default function ProfilePage() {
    const auth = useAuth();
    const user = auth.user;
    const { darkMode, toggleTheme } = useTheme();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: string | Date | null) => {
        if (!date) return 'Never';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <Aside />

                    <main className="lg:col-span-3 space-y-6">
                        <div>
                            <h1
                                className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'
                                    }`}
                            >
                                My Profile
                            </h1>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                View and manage your account information.
                            </p>
                        </div>

                        <div
                            className={`border rounded-2xl p-6 shadow-sm ${darkMode
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-white border-gray-200'
                                }`}
                        >
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

                            {/* Additional details */}
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

                            <div
                                className={`mt-6 pt-6 border-t flex justify-end ${darkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}
                            >
                                <button
                                    onClick={() => setDeleteModalOpen(true)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-colors ${darkMode
                                        ? 'border-red-600 text-red-400 hover:bg-red-900/20'
                                        : 'border-red-300 text-red-600 hover:bg-red-50'
                                        }`}
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className={`rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'
                            }`}
                    >
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className={`absolute top-4 right-4 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
                            <AlertTriangle className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Delete Account</h2>
                        </div>

                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            This action is <strong>permanent</strong> and cannot be undone. Please provide a reason for deleting your account.
                        </p>

                        <div className="mb-4 mt-4">
                            <label
                                htmlFor="delete-reason"
                                className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                            >
                                Reason (required)
                            </label>
                            <textarea
                                id="delete-reason"
                                rows={3}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Why are you leaving us?"
                                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            />
                            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className={`px-4 py-2 border rounded-full text-sm font-medium transition ${darkMode
                                    ? 'border-gray-600 hover:bg-gray-700'
                                    : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setIsDeleting(true);
                                    auth.deleteAccount(reason).finally(() => setIsDeleting(false));
                                }}
                                disabled={isDeleting || !reason.trim()}
                                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition text-white ${isDeleting || !reason.trim()
                                    ? darkMode
                                        ? 'bg-red-800 cursor-not-allowed'
                                        : 'bg-red-400 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Deleting…
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" /> Delete Account
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}