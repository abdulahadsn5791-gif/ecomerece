import { useThemeStore } from '@ecomerece/frontend';
import type { AddressResponseReadModel } from '@ecomerece/shared';
import AddressSkeleton from './AddressSkeleton';
import EmptyAddresses from './EmptyAddresses';
import AddressCard from './AddressCard';
import { AddressErrorState } from './AddressError';

interface AddressListProps {
    addresses: AddressResponseReadModel[];
    isLoading: boolean;
    isFetching: boolean;
    setDeleteId: (id: string) => void;
    handleSetDefault: (id: string) => void;
    openCreateForm: () => void;
    refetch: () => void;
    openEditForm: (address: AddressResponseReadModel) => void;
    error: Error | null
}

export default function AddressList({
    addresses,
    isLoading,
    setDeleteId,
    handleSetDefault,
    openCreateForm,
    openEditForm,
    refetch,
    isFetching,
    error
}: AddressListProps) {


    const { darkMode } = useThemeStore();

    if (isLoading) return <AddressSkeleton />;
    if (error) return <AddressErrorState refetch={refetch} isFetching={isFetching} />
    if (!addresses?.length) return <EmptyAddresses openCreateForm={openCreateForm} />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
                <AddressCard
                    key={address.id}
                    address={address}
                    setDeleteId={setDeleteId}
                    handleSetDefault={handleSetDefault}
                    openEditForm={openEditForm}
                />
            ))}
        </div>
    );
}