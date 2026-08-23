import type { IQuery } from '@ecomerece/domain/query/query-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { VendorReadModel } from '@ecomerece/domain/modules/address/read-models/vendor-read-model';

export class EnsureActiveVendorQuery implements IQuery<VendorReadModel> {
    readonly __result?: VendorReadModel;
    readonly type = 'EnsureActiveVendorQuery';
    public readonly payload: { userId: Id; vendorId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ userId: Id; vendorId: Id }];
        this.payload = payload;
    }
}
