"use client"

import { useState } from 'react';
import { z } from 'zod';

import {
    User,
    Mail,
    ShieldCheck,
    BadgeCheck,
    Clock,
    Calendar,
    Ban,
    Trash2,
    Star
} from 'lucide-react';
import { useAuth, useTheme } from '@ecomerece/frontend';
import Aside from '@/components/aside/Aside';




// ============ ZOD SCHEMAS ============
const clerkUserIdSchema = z.string().min(1);
const reasonSchema = z.string().min(3).max(200);

const DeleteUserDTOSchema = z.object({
    userId: clerkUserIdSchema,
    reason: reasonSchema,
});

type DeleteUserDTO = z.infer<typeof DeleteUserDTOSchema>;




export default function ProfilePage() {
    const auth = useAuth();
    const user = auth.user
    console.log(user)

    const { darkMode, toggleTheme } = useTheme();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState(false);



    const handleDeleteAccount = () => {
        setDeleteError('');
        try {
            const dto: DeleteUserDTO = {
                userId: user?.id,
                reason: deleteReason,
            };
            DeleteUserDTOSchema.parse(dto);
            setDeleteSuccess(true);
            console.log('Delete API called with:', dto);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setDeleteError(error.errors.map(e => e.message).join(', '));
            }
        }
    };


    const formatDate = (date: string | Date | null) => {
        if (!date) return 'Never';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <Aside />


                    <main className="lg:col-span-3 space-y-6">

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your account information.</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
                                    {user?.image ? (
                                        <img src={user?.image} alt={user.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <h2 className="text-xl font-bold">{user?.fullName}</h2>
                                        <BadgeCheck className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-center sm:justify-start">
                                        <Mail className="w-4 h-4" /> {user?.email ?? 'No email provided'}
                                    </p>
                                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                                        {user?.role}
                                    </span>
                                    {user?.isBlocked && (
                                        <span className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Blocked</span>
                                    )}
                                    {user?.isBanned && (
                                        <span className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Banned</span>
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
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
                                        <p className="font-medium">{formatDate(user?.lastLogin)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                        <p className="font-medium">{formatDate(user?.createdAt)}</p>
                                    </div>
                                </div>
                                {user?.isBanned && user?.bannedUntil && (
                                    <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                        <Ban className="w-5 h-5 text-red-500" />
                                        <div>
                                            <p className="text-sm text-red-500 dark:text-red-400">Banned Until</p>
                                            <p className="font-medium text-red-600 dark:text-red-300">{formatDate(user?.bannedUntil)}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                                        <p className="font-medium">{user?.isBlocked || user?.isBanned ? 'Restricted' : 'Active'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <button
                                    onClick={() => setDeleteModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-full text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {
                deleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                    </div>
                )
            }


        </div >
    );
}
