import type { IUserRepository, UserReadModel } from '@ecomerece/domain';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import { BaseService } from '../../../core/services/base.services';
import { UserMapper } from '../infrastructure/user.mapper';

export class UserInternalService extends BaseService {
    constructor(private readonly userRepo: IUserRepository) {
        super();
    }

    async getById(id: Id): Promise<UserReadModel | null> {
        const user = await this.userRepo.FindByIdOrThrow(id);

        if (!user) return null;
        return UserMapper.aggregateToReadModel(user);
    }
    async ensureActive(id: Id): Promise<boolean> {
        const user = await this.getById(id);

        if (
            !user ||
            user.isBlocked ||
            user.isBlocked ||
            user.isDeleted ||
            (user.bannedUntil !== null && user.bannedUntil > new Date())
        )
            return false;
        return true;
    }

    async ensureActiveUserGetById(
        userId: Id,
    ): Promise<{ user: UserReadModel | null; active: boolean }> {
        const user = await this.getById(userId);
        if (!user) return { user: null, active: false };
        if (
            user.isBlocked ||
            user.isBlocked ||
            user.isDeleted ||
            (user.bannedUntil !== null && user.bannedUntil > new Date())
        )
            return { user: user, active: false };

        return { user, active: true };
    }

    async verifyUserAndGet(ids: Id[]): Promise<{
        validIds: Id[];
        notFoundIds: Id[];
        bannedIds: Id[];
        blockedIds: Id[];
        deletedIds: Id[];
        userReadModel: UserReadModel[];
    }> {
        const users = await this.userRepo.FindByIds(ids);

        const validUsers = users.filter(
            (u) => !u.ban.isBan && !u.block.isBlocked && !u.deleted.deleted,
        );
        const validIdValues = new Set(validUsers.map((u) => u.id.value));

        const existingUserIds = new Set(users.map((u) => u.id.value));
        const foundIds = ids.filter((id) => existingUserIds.has(id.value));
        const notFoundIds = ids.filter((id) => !existingUserIds.has(id.value));

        const bannedIds = users.filter((u) => u.ban.isBan).map((u) => u.id);
        const blockedIds = users.filter((u) => u.block.isBlocked).map((u) => u.id);
        const deletedIds = users.filter((u) => u.deleted.deleted).map((u) => u.id);

        const validIds = foundIds.filter((id) => validIdValues.has(id.value));
        const userReadModel = validUsers.map((u) => UserMapper.aggregateToReadModel(u));

        return { validIds, notFoundIds, bannedIds, blockedIds, deletedIds, userReadModel };
    }
}
