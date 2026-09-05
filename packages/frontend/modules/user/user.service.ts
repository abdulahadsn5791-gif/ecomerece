// user.service.ts
import { http } from './../../lib';
import type {
    BanUserDTO,
    BlockUserDTO,
    DeleteMeDTO,
    DeleteUserDTO,
    ExtendBanDTO,
    UserResponseReadModel,
    UserRoleDto,
} from '@ecomerece/shared';

/** Matches the backend's `{ success: true, data: { updatedData?, message } }` mutation envelope. */
export type UserMutationResult = {
    message: string;
    updatedData?: UserResponseReadModel;
};

export class UserService {
    getMe(): Promise<UserResponseReadModel> {
        return http.get<UserResponseReadModel>('/users/me');
    }

    getUserById(id: string): Promise<UserResponseReadModel> {
        return http.get<UserResponseReadModel>(`/users/${id}`);
    }


    assignRole(data: UserRoleDto): Promise<UserMutationResult> {
        return http.patch<UserMutationResult>('/users/role', data);
    }

    softDeleteUser(data: DeleteUserDTO): Promise<UserMutationResult> {
        return http.delete<UserMutationResult>('/users/soft', data);
    }

    softDeleteMe(data?: DeleteMeDTO): Promise<UserMutationResult> {
        return http.delete<UserMutationResult>('/users/me/soft', data);
    }

    recoverUser(userId: string): Promise<UserMutationResult> {
        return http.patch<UserMutationResult>('/users/recover', { userId });
    }

    blockUser(data: BlockUserDTO): Promise<UserMutationResult> {
        return http.patch<UserMutationResult>('/users/block', data);
    }

    blockLift(userId: string): Promise<UserMutationResult> {
        return http.patch<UserMutationResult>('/users/block/lift', { userId });
    }

    banUser(data: BanUserDTO): Promise<UserMutationResult> {
        return http.patch<UserMutationResult>('/users/ban', data);
    }

    banLift(userId: string): Promise<UserMutationResult> {
        return http.patch<UserMutationResult>('/users/ban/lift', { userId });
    }

    extendBan(data: ExtendBanDTO): Promise<UserMutationResult> {
        return http.patch<UserMutationResult>('/users/ban/extend', data);
    }

    shortenBan(data: ExtendBanDTO): Promise<UserMutationResult> {
        return http.patch<UserMutationResult>('/users/ban/short', data);
    }
}

export const userService = new UserService();