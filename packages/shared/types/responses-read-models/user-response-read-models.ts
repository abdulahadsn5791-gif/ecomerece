import type { UserRolesType } from '../../../domain/modules/user/value-objects/role-info.vo';

export interface UserResponseReadModel {
    id: string;
    fullName: string;
    email: string | null;
    image: string | null;
    role: UserRolesType;
    isBlocked: boolean;
    isBanned: boolean;
    bannedUntil: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
}
