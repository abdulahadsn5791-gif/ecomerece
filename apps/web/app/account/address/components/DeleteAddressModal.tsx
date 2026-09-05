import { useThemeStore } from '@ecomerece/frontend';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface DeleteAddressModalProps {
    handleDelete: (id: string) => void;
    setDeleteId: (id: string | null) => void;
    deleteId: string;
    isPending?: boolean;
}

export default function DeleteAddressModal({ handleDelete, setDeleteId, deleteId, isPending }: DeleteAddressModalProps) {
    const { darkMode } = useThemeStore();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                    <AlertTriangle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <h2 className="text-xl font-bold mb-2">Delete Address?</h2>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        disabled={isPending}
                        onClick={() => handleDelete(deleteId)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                        onClick={() => setDeleteId(null)}
                        className={`flex-1 px-4 py-2 border rounded-full font-semibold transition-colors cursor-pointer ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}