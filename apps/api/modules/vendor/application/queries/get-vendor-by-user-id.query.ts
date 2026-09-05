import type { VendorReadModel } from '@ecomerece/domain';
import type { IQuery } from '@ecomerece/domain/query/query-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';

export class GetVendorByUserIdQuery implements IQuery<VendorReadModel | null> {
    readonly __result?: VendorReadModel | null;
    readonly type = 'GetVendorByUserIdQuery';
    public readonly payload: { userId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ userId: Id }];
        this.payload = payload;
    }
}
