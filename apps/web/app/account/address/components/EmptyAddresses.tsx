import { useThemeStore } from '@ecomerece/frontend';
import { Home } from 'lucide-react';
import React from 'react';

interface EmptyAddressesProps {
    openCreateForm: () => void;
}

export default function EmptyAddresses({ openCreateForm }: EmptyAddressesProps) {

    const { darkMode } = useThemeStore();
    return (
        <div className={`text-center py-20 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Home className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <h2 className="text-xl font-semibold mb-2">No addresses yet</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Add a new address to get started.
            </p>
            <button
                onClick={openCreateForm}
                className={`px-5 py-2.5 rounded-full font-semibold cursor-pointer ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                    }`}
            >
                Add Address
            </button>
        </div>
    );
}