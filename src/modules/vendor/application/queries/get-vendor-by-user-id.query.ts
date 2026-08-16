import type { IQuery } from '../../../../core/domain/query/query-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { VendorReadModel } from '../../domain/read-models/vendor-read-model';

export class GetVendorByUserIdQuery implements IQuery<VendorReadModel | null> {
    readonly __result?: VendorReadModel | null;
    readonly type = 'GetVendorByUserIdQuery';
    public readonly payload: { userId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ userId: Id }];
        this.payload = payload;
    }
}
