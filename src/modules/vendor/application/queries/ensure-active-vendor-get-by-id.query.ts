import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { VendorReadModel } from "../../domain/read-models/vendor-read-model";

export class EnsureActiveVendorGetByIdQuery implements IQuery<{ vendor: VendorReadModel | null; active: boolean }> {
    readonly __result?: { vendor: VendorReadModel | null; active: boolean };
    readonly type = 'EnsureActiveVendorGetByIdQuery';
    public readonly payload: { vendorId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ vendorId: Id }];
        this.payload = payload;
    }
}
