import type { Id } from '../../../core/domain/value-objects/id.vo';
import { BaseService } from '../../../core/services/base.services';
import type { IUserRepository } from '../domain/ports/i-user-repository';
import type { UserReadModel } from '../domain/read-models/user.read-model';
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

    async ensureActiveUserGetById(userId: Id): Promise<{ user: UserReadModel | null; active: boolean }> {
        const user = await this.getById(userId);
        if (!user) return { user: null, active: false }
        if (

            user.isBlocked ||
            user.isBlocked ||
            user.isDeleted ||
            (user.bannedUntil !== null && user.bannedUntil > new Date())
        ) return { user: user, active: false }

        return { user, active: true }
    }
}
