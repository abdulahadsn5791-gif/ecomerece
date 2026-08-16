import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { VendorReadModel } from "../../domain/read-models/vendor-read-model";

export class EnsureActiveVendorQuery implements IQuery<VendorReadModel> {
    readonly __result?: VendorReadModel;
    readonly type = 'EnsureActiveVendorQuery';
    public readonly payload: { userId: Id, vendorId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ userId: Id, vendorId: Id }];
        this.payload = payload;
    }
}
