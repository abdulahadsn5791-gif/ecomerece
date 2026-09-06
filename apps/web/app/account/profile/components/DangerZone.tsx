import React, { useState } from 'react';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';
import MutationButton from '@/components/Mutationbutton';

interface DeleteMeDTO {
    reason: string;
    feedback?: string;
}

interface DangerZoneProps {
    darkMode: boolean;
    deleteAccount: (payload: DeleteMeDTO, options?: any) => void;
    isDeleting: boolean;
    deleteError: any;
    resetDelete: () => void;
}

export const DangerZone = ({ darkMode, deleteAccount, isDeleting, deleteError, resetDelete }: DangerZoneProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (deleteError) resetDelete();
    };

    const errorMessage = deleteError
        ? (deleteError as any)?.response?.data?.message || deleteError.message || 'Failed to delete account'
        : null;

    return (
        <>
            <div className={`mt-10 pt-6 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${darkMode ? 'bg-rose-500/10' : 'bg-rose-50'
                }`}>
                <div className="text-center sm:text-left">
                    <h4 className={`text-sm font-bold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>Danger zone</h4>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Once deleted, your account will be soft-deleted and restricted.
                    </p>
                </div>
                <MutationButton variant="danger" onClick={() => setIsModalOpen(true)}>
                    Delete account
                </MutationButton>
            </div>

            <GenericConfirmModal<DeleteMeDTO>
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Delete your account?"
                message="You are about to delete your account. This will temporarily disable your access and hide your profile."
                confirmText="Yes, delete account"
                isLoading={isDeleting}
                variant="danger"
                error={errorMessage}
                defaultPayload={{ reason: '' }}
                onConfirm={(payload) => {
                    deleteAccount(payload, { onSuccess: () => setIsModalOpen(false) });
                }}
                renderFields={(payload, updatePayload) => (
                    <div className="space-y-3 my-4">
                        <textarea
                            placeholder="Reason for deleting account..."
                            value={payload.reason || ''}
                            onChange={(e) => updatePayload({ reason: e.target.value })}
                            disabled={isDeleting}
                            rows={3}
                            className={`w-full p-3 text-sm rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-rose-500 ${darkMode ? 'bg-neutral-800 text-white placeholder-neutral-500' : 'bg-neutral-100 text-neutral-900 placeholder-neutral-400'
                                }`}
                        />
                    </div>
                )}
            />
        </>
    );
};