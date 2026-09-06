import React from 'react';
import { useThemeStore } from '@ecomerece/frontend';
import { Plus } from 'lucide-react';
import MutationButton from '@/components/Mutationbutton';

interface AddressHeaderProps {
    openCreateForm: () => void;
}

export default function AddressHeader({ openCreateForm }: AddressHeaderProps) {
    const { darkMode } = useThemeStore();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    My Addresses
                </h1>
                <p className={`mt-1 text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Manage your delivery locations and preferences.
                </p>
            </div>
            <MutationButton
                variant="primary"
                size="md"
                icon={Plus}
                onClick={openCreateForm}
            >
                Add New Address
            </MutationButton>
        </div>
    );
}