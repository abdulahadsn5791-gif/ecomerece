import type { IQuery } from '@ecomerece/domain/query/query-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { VendorReadModel } from '@ecomerece/domain';

export class VerifyVendorAndGetQuery
    implements
    IQuery<{
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        nonVerifiedIds: Id[];
        vendorReadModel: VendorReadModel[];
    }> {
    readonly __result?: {
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        nonVerifiedIds: Id[];
        vendorReadModel: VendorReadModel[];
    };
    readonly type = 'VerifyVendorAndGetQuery';
    public readonly payload: { ids: Id[] };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ ids: Id[] }];
        this.payload = payload;
    }
}
