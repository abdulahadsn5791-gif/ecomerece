// vendor.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { vendorService, type VendorMutationResult } from './vendor.service';
import {

    CreateVendorDtoSchema,
    DeleteMyVendorDtoSchema,
    DeleteVendorDtoSchema,
    RecoverVendorDtoSchema,
    RejectVendorDtoSchema,
    VerifyVendorDtoSchema,
    type CreateVendorDto,
    type DeleteMyVendorDto,
    type DeleteVendorDto,
    type RecoverVendorDto,
    type RejectVendorDto,
    type VendorResponseReadModel,
    type VerifyVendorDto,
} from '@ecomerece/shared';

export const VENDOR_QUERY_KEY = ['vendors'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetVendorById(vendorId: string) {
    return useQuery({
        queryKey: [...VENDOR_QUERY_KEY, vendorId],
        queryFn: () => vendorService.getVendorById(vendorId),
        enabled: Boolean(vendorId),
    });
}

// ── Shared cache-update helper ───────────────────────────────────────────────

/**
 * Updates cache directly when `updatedData` is returned, otherwise invalidates vendor queries.
 */
function applyVendorMutationResult(queryClient: QueryClient, result: VendorMutationResult) {
    const updated = result.updatedData;

    if (!updated) {
        queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEY });
        return;
    }

    queryClient.setQueryData([...VENDOR_QUERY_KEY, updated.id], updated);
    queryClient.setQueryData<VendorResponseReadModel | undefined>(
        [...VENDOR_QUERY_KEY, 'me'],
        (old) => (old && old.id === updated.id ? updated : old),
    );
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useCreateMyVendor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateVendorDto) =>
            vendorService.createMyVendor(CreateVendorDtoSchema.parse(data)),
        onSuccess: (data) => applyVendorMutationResult(queryClient, data),
    });
}

export function useDeleteMyVendor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeleteMyVendorDto) =>
            vendorService.deleteMyVendor(DeleteMyVendorDtoSchema.parse(data)),
        onSuccess: (data) => applyVendorMutationResult(queryClient, data),
    });
}

export function useSoftDeleteVendor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeleteVendorDto) =>
            vendorService.softDeleteVendor(DeleteVendorDtoSchema.parse(data)),
        onSuccess: (data) => applyVendorMutationResult(queryClient, data),
    });
}

export function useRecoverVendor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RecoverVendorDto) =>
            vendorService.recoverVendor(RecoverVendorDtoSchema.parse(data)),
        onSuccess: (data) => applyVendorMutationResult(queryClient, data),
    });
}

export function useVerifyVendor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VerifyVendorDto) =>
            vendorService.verifyVendor(VerifyVendorDtoSchema.parse(data)),
        onSuccess: (data) => applyVendorMutationResult(queryClient, data),
    });
}

export function useRejectVendorVerification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RejectVendorDto) =>
            vendorService.rejectVendorVerification(RejectVendorDtoSchema.parse(data)),
        onSuccess: (data) => applyVendorMutationResult(queryClient, data),
    });
}