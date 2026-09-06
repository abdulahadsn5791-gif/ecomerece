"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAddressManager, useThemeStore } from '@ecomerece/frontend';
import AddressHeader from './components/AddressHeader';
import AddressList from './components/AddressList';
import AddressFormModal from './components/AddressFormModal';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';

export default function AddressesPage() {
    const { darkMode } = useThemeStore();
    const {
        addresses,
        isLoading,
        formOpen,
        setFormOpen,
        editId,
        formData,
        formError,
        deleteId,
        setDeleteId,
        isSaving,
        isDeleting,
        openCreateForm,
        openEditForm,
        handleInputChange,
        handleSubmit,
        handleDelete,
        handleSetDefault,
        error,
        refetch,
        isFetching,
    } = useAddressManager();

    return (
        <main className="lg:col-span-3">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`border rounded-3xl p-6 sm:p-8 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-100'
                    }`}
            >
                <AddressHeader openCreateForm={openCreateForm} />

                <AddressList
                    addresses={addresses}
                    isLoading={isLoading}
                    setDeleteId={setDeleteId}
                    handleSetDefault={handleSetDefault}
                    openCreateForm={openCreateForm}
                    openEditForm={openEditForm}
                    error={error}
                    refetch={refetch}
                    isFetching={isFetching}
                />

                {/* Edit / Create Form Modal */}
                {formOpen && (
                    <AddressFormModal
                        editId={editId}
                        setFormOpen={setFormOpen}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        formError={formError}
                        handleSubmit={handleSubmit}
                        isPending={isSaving}
                    />
                )}

                {/* Replaced DeleteAddressModal with GenericConfirmModal */}
                <GenericConfirmModal<{ id: string }>
                    isOpen={Boolean(deleteId)}
                    onClose={() => setDeleteId(null)}
                    variant="danger"
                    title="Delete Address?"
                    message="Are you sure you want to remove this address? This action cannot be undone."
                    confirmText="Delete Address"
                    isLoading={isDeleting}
                    onConfirm={() => deleteId && handleDelete(deleteId)}
                />
            </motion.div>
        </main>
    );
}