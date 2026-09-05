import type { ProductReadModel } from '@ecomerece/domain';
import type { IQuery } from '@ecomerece/domain/query/query-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';

export class VerifyProductAndGetQuery
    implements
        IQuery<{
            validIds: Id[];
            notFoundIds: Id[];
            deletedIds: Id[];
            blockedIds: Id[];
            productReadModel: ProductReadModel[];
        }>
{
    readonly __result?: {
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        blockedIds: Id[];
        productReadModel: ProductReadModel[];
    };
    readonly type = 'VerifyProductAndGetQuery';
    public readonly payload: { ids: Id[] };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ ids: Id[] }];
        this.payload = payload;
    }
}
