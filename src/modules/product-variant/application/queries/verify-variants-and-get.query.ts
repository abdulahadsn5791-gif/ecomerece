import type { IQuery } from '../../../../core/domain/query/query-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { ProductVariantReadModel } from '../../domain/read-models/product-variant.read-model';

export class VerifyVariantsAndGetQuery
    implements
        IQuery<{
            validIds: Id[];
            notFoundIds: Id[];
            deletedIds: Id[];
            nonActiveIds: Id[];
            variantReadModel: ProductVariantReadModel[];
        }>
{
    readonly __result?: {
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        nonActiveIds: Id[];
        variantReadModel: ProductVariantReadModel[];
    };
    readonly type = 'VerifyVariantsAndGetQuery';
    public readonly payload: { ids: Id[] };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ ids: Id[] }];
        this.payload = payload;
    }
}
