import React from 'react';
import { useThemeStore } from '@ecomerece/frontend/theme';
import type { AddressResponseReadModel } from '@ecomerece/shared';
import { CheckCircle, MapPin, Pencil, Star, Trash2 } from 'lucide-react';
import MutationButton from '@/components/Mutationbutton';

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
            className={`border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between ${darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
                }`}
        >
            <div>
                {address.defaultDate && (
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${darkMode ? 'bg-blue-900/40 border border-blue-800 text-blue-300' : 'bg-blue-50 border border-blue-200 text-blue-700'
                            }`}
                    >
                        <CheckCircle className="w-3.5 h-3.5" /> Default Address
                    </span>
                )}
                <div className="flex items-start gap-3">
                    <MapPin className={`w-5 h-5 mt-0.5 shrink-0 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                    <p className={`text-sm leading-relaxed font-medium ${darkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                        {address.fullAddress}
                    </p>
                </div>
                <p className={`text-xs mt-3 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Added: {new Date(address.createdAt).toLocaleDateString()}
                </p>
            </div>

            <div className={`flex items-center gap-2 mt-6 pt-4 border-t flex-wrap ${darkMode ? 'border-neutral-800' : 'border-neutral-100'}`}>
                <MutationButton
                    variant="neutral"
                    styleType="outline"
                    size="sm"
                    icon={Pencil}
                    onClick={() => openEditForm(address)}
                >
                    Edit
                </MutationButton>
                <MutationButton
                    variant="danger"
                    styleType="soft"
                    size="sm"
                    icon={Trash2}
                    onClick={() => setDeleteId(address.id)}
                >
                    Delete
                </MutationButton>
                {!address.defaultDate && (
                    <div className="ml-auto">
                        <MutationButton
                            variant="info"
                            styleType="ghost"
                            size="sm"
                            icon={Star}
                            onClick={() => handleSetDefault(address.id)}
                        >
                            Set Default
                        </MutationButton>
                    </div>
                )}
            </div>
        </div>
    );
}