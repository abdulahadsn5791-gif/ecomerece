import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { userService, type UserMutationResult } from './user.service';
import {
    BanUserDTOSchema,
    BlockUserDTOSchema,
    DeleteMeDTOSchema,
    DeleteUserDTOSchema,
    ExtendBanDTOSchema,
    UserRoleDtoSchema,
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



export function useAssignRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UserRoleDto) => userService.assignRole(UserRoleDtoSchema.parse(data)),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useSoftDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeleteUserDTO) => userService.softDeleteUser(DeleteUserDTOSchema.parse(data)),
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
        mutationFn: (data: BlockUserDTO) => userService.blockUser(BlockUserDTOSchema.parse(data)),
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
        mutationFn: (data: BanUserDTO) => userService.banUser(BanUserDTOSchema.parse(data)),
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
        mutationFn: (data: ExtendBanDTO) => userService.extendBan(ExtendBanDTOSchema.parse(data)),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}

export function useShortenBan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ExtendBanDTO) => userService.shortenBan(ExtendBanDTOSchema.parse(data)),
        onSuccess: (data) => applyUserMutationResult(queryClient, data),
    });
}