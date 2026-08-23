import type { IQuery } from '@ecomerece/domain/query/query-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { ProductVariantReadModel } from '@ecomerece/domain';

export class EnsureActiveVariantGetByIdQuery
    implements IQuery<{ variant: ProductVariantReadModel | null; active: boolean }> {
    readonly __result?: { variant: ProductVariantReadModel | null; active: boolean };
    readonly type = 'EnsureActiveVariantGetByIdQuery';
    public readonly payload: { variantId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ variantId: Id }];
        this.payload = payload;
    }
}
