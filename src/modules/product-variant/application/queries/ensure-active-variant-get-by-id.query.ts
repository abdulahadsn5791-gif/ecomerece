import type { IQuery } from '../../../../core/domain/query/query-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { ProductVariantReadModel } from '../../domain/read-models/product-variant.read-model';

export class EnsureActiveVariantGetByIdQuery
    implements IQuery<{ variant: ProductVariantReadModel | null; active: boolean }>
{
    readonly __result?: { variant: ProductVariantReadModel | null; active: boolean };
    readonly type = 'EnsureActiveVariantGetByIdQuery';
    public readonly payload: { variantId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ variantId: Id }];
        this.payload = payload;
    }
}
