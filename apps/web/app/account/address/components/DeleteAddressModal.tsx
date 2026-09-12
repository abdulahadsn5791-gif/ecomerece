import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useThemeStore } from '@ecomerece/frontend/theme';
import MutationButton from '@/components/Mutationbutton';

interface DeleteAddressModalProps {
    handleDelete: (id: string) => void;
    setDeleteId: (id: string | null) => void;
    deleteId: string;
    isPending?: boolean;
}

export default function DeleteAddressModal({
    handleDelete,
    setDeleteId,
    deleteId,
    isPending = false,
}: DeleteAddressModalProps) {
    const { darkMode } = useThemeStore();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className={`rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center border transition-colors ${darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-100 text-neutral-900'
                    }`}
            >
                <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                        }`}
                >
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold mb-1">Delete Address?</h2>
                <p className={`text-sm mb-6 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <MutationButton
                        variant="neutral"
                        styleType="soft"
                        fullWidth
                        disabled={isPending}
                        onClick={() => setDeleteId(null)}
                    >
                        Cancel
                    </MutationButton>
                    <MutationButton
                        variant="danger"
                        fullWidth
                        isLoading={isPending}
                        loadingText="Deleting..."
                        onClick={() => handleDelete(deleteId)}
                    >
                        Delete
                    </MutationButton>
                </div>
            </div>
        </div>
    );
}