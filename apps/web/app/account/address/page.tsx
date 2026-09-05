"use client";

import { useAddressManager, useThemeStore } from '@ecomerece/frontend';
import Aside from '@/components/aside/Aside';

import AddressFormModal from './components/AddressFormModal';
import DeleteAddressModal from './components/DeleteAddressModal';
import AddressHeader from './components/AddressHeader';
import AddressList from './components/AddressList';
import { motion } from 'framer-motion';
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
        <main className="lg:col-span-3  ">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`border rounded-3xl p-8 shadow-sm transition-colors duration-300 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
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

                {deleteId && (
                    <DeleteAddressModal
                        deleteId={deleteId}
                        setDeleteId={setDeleteId}
                        handleDelete={handleDelete}
                        isPending={isDeleting}
                    />
                )}
            </motion.div>
        </main>
    );
}