import { useThemeStore } from '@ecomerece/frontend';
import type { AddressResponseReadModel } from '@ecomerece/shared';
import { CheckCircle, MapPin, Pencil, Star, Trash2 } from 'lucide-react';
import React from 'react';

interface AddressCardProps {
    address: AddressResponseReadModel;
    setDeleteId: (id: string) => void;
    handleSetDefault: (id: string) => void;
    openEditForm: (address: AddressResponseReadModel) => void;
}

export default function AddressCard({
    address,
    setDeleteId,
    handleSetDefault,
    openEditForm,
}: AddressCardProps) {
    const { darkMode } = useThemeStore();
    return (
        <div
            className={`border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
        >
            {address.defaultDate && (
                <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-3 ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}
                >
                    <CheckCircle className="w-3 h-3" /> Default
                </span>
            )}
            <div className="flex items-start gap-3">
                <MapPin className={`w-5 h-5 mt-1 shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{address.fullAddress}</p>
            </div>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Added: {new Date(address.createdAt).toLocaleDateString()}
            </p>
            <div className={`flex gap-2 mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <button
                    onClick={() => openEditForm(address)}
                    className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition-colors cursor-pointer ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                        }`}
                >
                    <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                    onClick={() => setDeleteId(address.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition-colors cursor-pointer ${darkMode ? 'border-red-600 text-red-400 hover:bg-red-900/20' : 'border-red-300 text-red-600 hover:bg-red-50'
                        }`}
                >
                    <Trash2 className="w-3 h-3" /> Delete
                </button>
                {!address.defaultDate && (
                    <button
                        onClick={() => handleSetDefault(address.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition-colors ml-auto cursor-pointer ${darkMode ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20' : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                            }`}
                    >
                        <Star className="w-3 h-3" /> Set Default
                    </button>
                )}
            </div>
        </div>
    );
}