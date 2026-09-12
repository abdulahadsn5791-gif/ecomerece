import React from 'react';
import { Home } from 'lucide-react';
import { useThemeStore } from '@ecomerece/frontend/theme';
import MutationButton from '@/components/Mutationbutton';

interface EmptyAddressesProps {
    openCreateForm: () => void;
}

export default function EmptyAddresses({ openCreateForm }: EmptyAddressesProps) {
    const { darkMode } = useThemeStore();

    return (
        <div
            className={`text-center py-16 px-4 rounded-3xl border transition-colors ${darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200/60'
                }`}
        >
            <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-white text-neutral-400 shadow-sm'
                    }`}
            >
                <Home className="w-8 h-8" />
            </div>
            <h2 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                No addresses saved
            </h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Add a new address to speed up checkout.
            </p>
            <MutationButton variant="primary" onClick={openCreateForm}>
                Add Address
            </MutationButton>
        </div>
    );
}