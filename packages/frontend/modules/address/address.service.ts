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
        return http.get<AddressResponseReadModel[]>('/addresses/me');
    }

    createMyAddress(data: createMyAddressDtoType): Promise<AddressMutationResult> {
        return http.post<AddressMutationResult>('/addresses/me', data);
    }

    deleteMyAddress(id: string): Promise<AddressMutationResult> {
        return http.delete<AddressMutationResult>(`/addresses/me/${id}`);
    }

    setMyAddressAsDefault(id: string): Promise<AddressMutationResult> {
        return http.patch<AddressMutationResult>(`/addresses/me/${id}/default`);
    }

    recoverAddress(id: string): Promise<AddressMutationResult> {
        return http.patch<AddressMutationResult>(`/addresses/${id}/recover`);
    }
}

export const addressService = new AddressService();