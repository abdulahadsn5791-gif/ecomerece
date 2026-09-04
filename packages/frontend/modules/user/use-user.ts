// user.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { userService, type UserMutationResult } from './user.service';
import {
    DeleteMeDTOSchema,
    type BanUserDTO,
    type BlockUserDTO,
    type DeleteMeDTO,
    type DeleteUserDTO,
    type ExtendBanDTO,
    type UserResponseReadModel,
    type UserRoleDto,
} from '@ecomerece/shared';

export const USER_QUERY_KEY = ['users'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetMe() {
    return useQuery({
        queryKey: [...USER_QUERY_KEY, 'me'],
        queryFn: () => userService.getMe(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}

export function useGetUserById(userId: string) {
    return useQuery({
        queryKey: [...USER_QUERY_KEY, userId],
        queryFn: () => userService.getUserById(userId),
        enabled: Boolean(userId),
    });
}

// ── Shared cache-update helper ───────────────────────────────────────────────

/**
 * The backend returns the freshly-updated user alongside the message for
 * every mutation (`{ message, updatedData }`). When present, write it
 * straight into the cache — no refetch needed. When absent (e.g. `login`,
 * which doesn't resolve to a single user record) fall back to invalidating.
 */
function applyUserMutationResult(queryClient: QueryClient, result: UserMutationResult) {
    const updated = result.updatedData;

    if (!updated) {
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
        return;
    }

    queryClient.setQueryData([...USER_QUERY_KEY, updated.id], updated);
    queryClient.setQueryData<UserResponseReadModel | undefined>(
        [...USER_QUERY_KEY, 'me'],
        (old) => (old && old.id === updated.id ? updated : old),
    );
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useSignIn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userService.signIn(id),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => userService.login(),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useAssignRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UserRoleDto) => userService.assignRole(data),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useSoftDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeleteUserDTO) => userService.softDeleteUser(data),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useSoftDeleteMe() {
    const queryClient = useQueryClient();
    return useMutation({

        mutationFn: (data: DeleteMeDTO) => userService.softDeleteMe(DeleteMeDTOSchema.parse(data)),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useRecoverUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => userService.recoverUser(userId),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useBlockUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BlockUserDTO) => userService.blockUser(data),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useBlockLift() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => userService.blockLift(userId),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useBanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: BanUserDTO) => userService.banUser(data),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useBanLift() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => userService.banLift(userId),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useExtendBan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ExtendBanDTO) => userService.extendBan(data),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useShortenBan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ExtendBanDTO) => userService.shortenBan(data),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}