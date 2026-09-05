"use client";

import { useAddressManager, useThemeStore } from '@ecomerece/frontend';
import Aside from '@/components/aside/Aside';

import AddressFormModal from './components/AddressFormModal';
import DeleteAddressModal from './components/DeleteAddressModal';
import AddressHeader from './components/AddressHeader';
import AddressList from './components/AddressList';

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
    } = useAddressManager();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <Aside />
                    <main className="lg:col-span-3">
                        <AddressHeader openCreateForm={openCreateForm} />
                        <AddressList
                            addresses={addresses}
                            isLoading={isLoading}
                            setDeleteId={setDeleteId}
                            handleSetDefault={handleSetDefault}
                            openCreateForm={openCreateForm}
                            openEditForm={openEditForm}
                        />
                    </main>
                </div>
            </div>

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
        </div>
    );
}