import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { UserReadModel } from "../../domain/read-models/user.read-model";

export class VerifyUserAndGetQuery implements IQuery<{ validIds: Id[], invalidIds: Id[], usersReadModel: UserReadModel[] }> {
    readonly __result?: { validIds: Id[], invalidIds: Id[], usersReadModel: UserReadModel[] };
    readonly type = 'VerifyUserAndGetQuery';
    public readonly payload: { ids: Id[] };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ ids: Id[] }];
        this.payload = payload;
    }
}
