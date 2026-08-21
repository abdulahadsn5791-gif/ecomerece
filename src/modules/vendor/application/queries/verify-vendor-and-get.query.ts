import type { IQuery } from '../../../../core/domain/query/query-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { VendorReadModel } from '../../domain/read-models/vendor-read-model';

export class VerifyVendorAndGetQuery
    implements
        IQuery<{
            validIds: Id[];
            notFoundIds: Id[];
            deletedIds: Id[];
            nonVerifiedIds: Id[];
            vendorReadModel: VendorReadModel[];
        }>
{
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
