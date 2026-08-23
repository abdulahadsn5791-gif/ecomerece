import type { IQuery } from '@ecomerece/domain/query/query-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { VendorReadModel } from '@ecomerece/domain/modules/address/read-models/vendor-read-model';

export class EnsureActiveVendorGetByIdQuery
    implements IQuery<{ vendor: VendorReadModel | null; active: boolean }>
{
    readonly __result?: { vendor: VendorReadModel | null; active: boolean };
    readonly type = 'EnsureActiveVendorGetByIdQuery';
    public readonly payload: { vendorId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ vendorId: Id }];
        this.payload = payload;
    }
}
