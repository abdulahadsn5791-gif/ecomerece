import { useThemeStore } from '@ecomerece/frontend';
import { Plus } from 'lucide-react';
import React from 'react';

interface AddressHeaderProps {
    openCreateForm: () => void;
}

export default function AddressHeader({ openCreateForm }: AddressHeaderProps) {
    const { darkMode } = useThemeStore();
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Addresses</h1>
                <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your saved delivery addresses.</p>
            </div>
            <button
                onClick={openCreateForm}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer ${darkMode
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
            >
                <Plus className="w-4 h-4" /> Add New Address
            </button>
        </div>
    );
}