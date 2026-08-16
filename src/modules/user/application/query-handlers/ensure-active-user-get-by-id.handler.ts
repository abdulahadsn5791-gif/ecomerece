import type { UserReadModel } from '../../domain/read-models/user.read-model';
import type { EnsureActiveUserGetByIdQuery } from '../queries/ensure-active-user-get-by-id.query';
import type { UserInternalService } from '../user.internal.service';

export class EnsureActiveUserGetByIdHandler {
    readonly type = 'EnsureActiveUserGetByIdQuery';
    constructor(private readonly internalService: UserInternalService) {}
    async handle(
        query: EnsureActiveUserGetByIdQuery,
    ): Promise<{ user: UserReadModel | null; active: boolean }> {
        return await this.internalService.ensureActiveUserGetById(query.payload.userId);
    }
}
