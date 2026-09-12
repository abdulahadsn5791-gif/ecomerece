// vendor.hook.ts

import {
  type CreateVendorDto,
  CreateVendorDtoSchema,
  type DeleteMyVendorDto,
  DeleteMyVendorDtoSchema,
  type DeleteVendorDto,
  DeleteVendorDtoSchema,
  type GetAdminPaginatedVendorsQueryDto,
  type GetPaginatedVendorsQueryDto,
  getAdminPaginatedVendorsQuerySchema,
  getPaginatedVendorsQuerySchema,
  type RecoverVendorDto,
  RecoverVendorDtoSchema,
  type RejectVendorDto,
  RejectVendorDtoSchema,
  type UpdateVendorStatsRefreshDto,
  updateVendorStatsRefreshSchema,
  type VendorResponseReadModel,
  type VerifyVendorDto,
  VerifyVendorDtoSchema,
} from '@ecomerece/shared';
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type VendorMutationResult, vendorService } from './vendor.service';

export const VENDOR_QUERY_KEY = ['vendors'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetVendorById(vendorId: string) {
  return useQuery({
    queryKey: [...VENDOR_QUERY_KEY, vendorId],
    queryFn: () => vendorService.getVendorById(vendorId),
    enabled: Boolean(vendorId),
  });
}

export function useGetMyVendor() {
  return useQuery({
    queryKey: [...VENDOR_QUERY_KEY, 'my'],
    queryFn: () => vendorService.getMyVendor(),
  });
}

export function useGetPaginatedVendors(params: GetPaginatedVendorsQueryDto) {
  return useQuery({
    queryKey: [...VENDOR_QUERY_KEY, 'paginated', params],
    queryFn: () => vendorService.getPaginatedVendors(getPaginatedVendorsQuerySchema.parse(params)),
  });
}

export function useGetAdminPaginatedVendors(params: GetAdminPaginatedVendorsQueryDto) {
  return useQuery({
    queryKey: [...VENDOR_QUERY_KEY, 'admin-paginated', params],
    queryFn: () =>
      vendorService.getAdminPaginatedVendors(getAdminPaginatedVendorsQuerySchema.parse(params)),
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

export function useUpdateMyStatsRefresh() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateVendorStatsRefreshDto) =>
      vendorService.updateMyStatsRefresh(updateVendorStatsRefreshSchema.parse(data)),
    onSuccess: (data) => {
      queryClient.setQueryData<VendorResponseReadModel | undefined>(
        [...VENDOR_QUERY_KEY, 'my'],
        (old) => (old && old.id === data.id ? data : old),
      );
      queryClient.setQueryData<VendorResponseReadModel | undefined>(
        [...VENDOR_QUERY_KEY, 'me'],
        (old) => (old && old.id === data.id ? data : old),
      );
    },
  });
}
