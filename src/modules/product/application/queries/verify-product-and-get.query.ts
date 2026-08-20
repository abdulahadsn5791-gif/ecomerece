import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { ProductReadModel } from "../../domain/read-models/product.read-model";

export class VerifyProductAndGetQuery
    implements IQuery<{
        validIds: Id[],
        notFoundIds: Id[],
        deletedIds: Id[],
        blockedIds: Id[],
        productReadModel: ProductReadModel[]
    }> {
    readonly __result?: {
        validIds: Id[],
        notFoundIds: Id[],
        deletedIds: Id[],
        blockedIds: Id[],
        productReadModel: ProductReadModel[]
    };
    readonly type = 'VerifyProductAndGetQuery';
    public readonly payload: { ids: Id[] };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ ids: Id[] }];
        this.payload = payload;
    }
}
