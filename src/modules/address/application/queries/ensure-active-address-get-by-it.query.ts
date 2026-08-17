import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { AddressReadModel } from "../../domain/read-models/address.read-models";

export class EnsureActiveAddressGetByIdQuery
    implements IQuery<{ address: AddressReadModel | null; active: boolean }> {
    readonly __result?: { address: AddressReadModel | null; active: boolean };
    readonly type = 'EnsureActiveAddressGetByIdQuery';
    public readonly payload: { addressId: Id };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ addressId: Id }];
        this.payload = payload;
    }
}
