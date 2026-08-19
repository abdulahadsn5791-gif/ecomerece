import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { VendorReadModel } from "../../domain/read-models/vendor-read-model";

export class VerifyVendorAndGetQuery implements IQuery<{ validIds: Id[], invalidIds: Id[], vendorReadModel: VendorReadModel[] }> {
    readonly __result?: { validIds: Id[], invalidIds: Id[], vendorReadModel: VendorReadModel[] };
    readonly type = 'VerifyVendorAndGetQuery';
    public readonly payload: { ids: Id[] };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ ids: Id[] }];
        this.payload = payload;
    }
}
