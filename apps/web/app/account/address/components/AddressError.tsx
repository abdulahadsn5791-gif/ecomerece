import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { useThemeStore } from '@ecomerece/frontend';
import MutationButton from '@/components/Mutationbutton';

interface AddressErrorStateProps {
    refetch: () => void;
    isFetching: boolean;
}

export const AddressErrorState = ({ refetch, isFetching }: AddressErrorStateProps) => {
    const { darkMode } = useThemeStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-3xl p-10 text-center shadow-sm backdrop-blur-sm ${darkMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/80 border-neutral-200'
                }`}
        >
            <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-500'
                }`}>
                <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                Unable to load addresses
            </h3>
            <p className={`mb-6 text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                We encountered an issue fetching your data.
            </p>
            <MutationButton
                variant="info"
                isLoading={isFetching}
                loadingText="Synchronizing..."
                onClick={refetch}
            >
                Try Again
            </MutationButton>
        </motion.div>
    );
};

export function EmptyAddresses({ openCreateForm }: { openCreateForm: () => void }) {
    const { darkMode } = useThemeStore();

    return (
        <div className={`text-center py-16 px-4 rounded-3xl border ${darkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200/60'
            }`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-white text-neutral-400 shadow-sm'
                }`}>
                <Home className="w-8 h-8" />
            </div>
            <h2 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                No addresses saved
            </h2>
            <p className={`mb-6 text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Add a new address to speed up checkout.
            </p>
            <MutationButton variant="primary" onClick={openCreateForm}>
                Add Address
            </MutationButton>
        </div>
    );
}

export function AddressSkeleton() {
    const { darkMode } = useThemeStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
                <div
                    key={n}
                    className={`border rounded-3xl p-6 shadow-sm animate-pulse ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
                        }`}
                >
                    <div className={`h-5 w-24 rounded-full mb-4 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                    <div className={`h-10 w-full rounded-xl mb-4 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                    <div className={`h-4 w-32 rounded-md ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                </div>
            ))}
        </div>
    );
}