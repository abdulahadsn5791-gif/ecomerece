import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { UserReadModel } from "../../domain/read-models/user.read-model";

export class EnsureActiveUserGetByIdQuery implements IQuery<{ user: UserReadModel | null; active: boolean }> {
    readonly __result?: { user: UserReadModel | null; active: boolean };
    readonly type = 'EnsureActiveUserGetByIdQuery';
    public readonly payload: { userId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ userId: Id }];
        this.payload = payload;
    }
}
