import { useThemeStore } from '@ecomerece/frontend';
import type { AddressResponseReadModel } from '@ecomerece/shared';
import AddressSkeleton from './AddressSkeleton';
import EmptyAddresses from './EmptyAddresses';
import AddressCard from './AddressCard';

interface AddressListProps {
    addresses: AddressResponseReadModel[];
    isLoading: boolean;
    setDeleteId: (id: string) => void;
    handleSetDefault: (id: string) => void;
    openCreateForm: () => void;
    openEditForm: (address: AddressResponseReadModel) => void;
}

export default function AddressList({
    addresses,
    isLoading,
    setDeleteId,
    handleSetDefault,
    openCreateForm,
    openEditForm,
}: AddressListProps) {
    const { darkMode } = useThemeStore();

    if (isLoading) return <AddressSkeleton darkMode={darkMode} />;
    if (!addresses?.length) return <EmptyAddresses darkMode={darkMode} openCreateForm={openCreateForm} />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                    darkMode={darkMode}
                    setDeleteId={setDeleteId}
                    handleSetDefault={handleSetDefault}
                    openEditForm={openEditForm}
                />
            ))}
        </div>
    );
}