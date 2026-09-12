// vendor.service.ts
import { http } from './../../lib';
import type {
    CreateVendorDto,
    DeleteMyVendorDto,
    DeleteVendorDto,
    GetAdminPaginatedVendorsQueryDto,
    GetPaginatedVendorsQueryDto,
    RecoverVendorDto,
    RejectVendorDto,
    VendorListItemReadModel,
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

    getPaginatedVendors(
        params: GetPaginatedVendorsQueryDto,
    ): Promise<{ data: VendorListItemReadModel[]; meta: { nextCursor: string | null; prevCursor: string | null; hasMore: boolean } }> {
        const searchParams = new URLSearchParams();
        if (params.cursor) searchParams.append('cursor', params.cursor);
        if (params.limit) searchParams.append('limit', String(params.limit));
        if (params.direction) searchParams.append('direction', params.direction);
        if (params.search) searchParams.append('search', params.search);

        const query = searchParams.toString();
        const url = query ? `/vendor?${query}` : '/vendor';

        return http.get(url);
    }

    getAdminPaginatedVendors(
        params: GetAdminPaginatedVendorsQueryDto,
    ): Promise<{ data: VendorListItemReadModel[]; meta: { nextCursor: string | null; prevCursor: string | null; hasMore: boolean } }> {
        const searchParams = new URLSearchParams();
        if (params.cursor) searchParams.append('cursor', params.cursor);
        if (params.limit) searchParams.append('limit', String(params.limit));
        if (params.direction) searchParams.append('direction', params.direction);
        if (params.search) searchParams.append('search', params.search);
        if (params.deleted !== undefined) searchParams.append('deleted', String(params.deleted));
        if (params.verified !== undefined) searchParams.append('verified', String(params.verified));

        const query = searchParams.toString();
        const url = query ? `/vendor/admin/all?${query}` : '/vendor/admin/all';

        return http.get(url);
    }
}

export const vendorService = new VendorService();