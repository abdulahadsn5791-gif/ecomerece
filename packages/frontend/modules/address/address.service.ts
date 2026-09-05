// address.service.ts
import { http } from './../../lib';
import type {
    AddressResponseReadModel,
    createMyAddressDtoType,
} from '@ecomerece/shared';

/** Matches the backend's standard address mutation response envelope. */
export type AddressMutationResult = {
    message: string;
    updatedData?: AddressResponseReadModel;
};

export class AddressService {
    getMyAddresses(): Promise<AddressResponseReadModel[]> {
        return http.get<AddressResponseReadModel[]>('/address/my');
    }

    createMyAddress(data: createMyAddressDtoType): Promise<AddressMutationResult> {
        return http.post<AddressMutationResult>('/address/my', data);
    }
    updateMyAddress(data: createMyAddressDtoType, id: string): Promise<AddressMutationResult> {
        return http.patch<AddressMutationResult>(`/address/my/${id}/update`, data);
    }

    deleteMyAddress(id: string): Promise<AddressMutationResult> {
        return http.delete<AddressMutationResult>(`/address/my/${id}`);
    }

    setMyAddressAsDefault(id: string): Promise<AddressMutationResult> {
        return http.patch<AddressMutationResult>(`/address/my/${id}/default`);
    }

    recoverAddress(id: string): Promise<AddressMutationResult> {
        return http.patch<AddressMutationResult>(`/address/my/${id}/recover`);
    }
}

export const addressService = new AddressService();