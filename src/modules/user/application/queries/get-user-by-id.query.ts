import type { IQuery } from '../../../../core/domain/query/query-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { UserReadModel } from '../../domain/read-models/user.read-model';

export class GetUserByIdQuery implements IQuery<UserReadModel | null> {
    readonly __result?: UserReadModel | null;
    readonly type = 'GetUserByIdQuery';
    public readonly payload: { userId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ userId: Id }];
        this.payload = payload;
    }
}
