export type UserRolesType = 'admin' | 'vendor' | 'customer';

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
