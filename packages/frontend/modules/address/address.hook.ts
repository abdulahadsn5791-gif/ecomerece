// address.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { addressService, type AddressMutationResult } from './address.service';
import {

    createMyAddressDto,
    type AddressResponseReadModel,
    type createMyAddressDtoType,
} from '@ecomerece/shared';

export const ADDRESS_QUERY_KEY = ['addresses'];

export function useGetMyAddresses() {
    return useQuery({
        queryKey: [...ADDRESS_QUERY_KEY, 'me'],
        queryFn: () => addressService.getMyAddresses(),
    });
}


function applyAddressMutationResult(queryClient: QueryClient, result: AddressMutationResult) {
    const updated = result.updatedData;

    if (!updated) {
        queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
        return;
    }

    queryClient.setQueryData([...ADDRESS_QUERY_KEY, updated.id], updated);

    queryClient.setQueryData<AddressResponseReadModel[] | undefined>(
        [...ADDRESS_QUERY_KEY, 'me'],
        (old) => {
            if (!old) return [updated];
            const exists = old.some((item) => item.id === updated.id);
            if (exists) {
                return old.map((item) => (item.id === updated.id ? updated : item));
            }
            return [...old, updated];
        },
    );
}


export function useCreateMyAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: createMyAddressDtoType) =>
            addressService.createMyAddress(createMyAddressDto.parse(data)),
        onSuccess: (data) => applyAddressMutationResult(queryClient, data),
    });
}

export function useDeleteMyAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => addressService.deleteMyAddress(id),
        onSuccess: (data, id) => {
            queryClient.setQueryData<AddressResponseReadModel[] | undefined>(
                [...ADDRESS_QUERY_KEY, 'me'],
                (old) => old?.filter((item) => item.id !== id),
            );
            applyAddressMutationResult(queryClient, data);
        },
    });
}

export function useSetMyAddressAsDefault() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => addressService.setMyAddressAsDefault(id),
        onSuccess: (data) => applyAddressMutationResult(queryClient, data),
    });
}

export function useRecoverAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => addressService.recoverAddress(id),
        onSuccess: (data) => applyAddressMutationResult(queryClient, data),
    });
}