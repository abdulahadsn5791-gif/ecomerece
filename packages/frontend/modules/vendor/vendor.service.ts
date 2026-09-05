// vendor.service.ts
import { http } from './../../lib';
import type {
    CreateVendorDto,
    DeleteMyVendorDto,
    DeleteVendorDto,
    RecoverVendorDto,
    RejectVendorDto,
    VendorResponseReadModel,
    VerifyVendorDto,
} from '@ecomerece/shared';

/** Matches the backend's standard vendor mutation response envelope. */
export type VendorMutationResult = {
    message: string;
    updatedData?: VendorResponseReadModel;
};

export class VendorService {
    getVendorById(id: string): Promise<VendorResponseReadModel> {
        return http.get<VendorResponseReadModel>(`/vendor/${id}`);
    }

    createMyVendor(data: CreateVendorDto): Promise<VendorMutationResult> {
        return http.post<VendorMutationResult>('/vendor/my', data);
    }

    deleteMyVendor(data: DeleteMyVendorDto): Promise<VendorMutationResult> {
        return http.delete<VendorMutationResult>('/vendor/my', data);
    }

    softDeleteVendor(data: DeleteVendorDto): Promise<VendorMutationResult> {
        return http.delete<VendorMutationResult>('/vendor/soft', data);
    }

    recoverVendor(data: RecoverVendorDto): Promise<VendorMutationResult> {
        return http.patch<VendorMutationResult>('/vendor/recover', data);
    }

    verifyVendor(data: VerifyVendorDto): Promise<VendorMutationResult> {
        return http.patch<VendorMutationResult>('/vendor/verify', data);
    }

    rejectVendorVerification(data: RejectVendorDto): Promise<VendorMutationResult> {
        return http.patch<VendorMutationResult>('/vendor/reject', data);
    }
}

export const vendorService = new VendorService();