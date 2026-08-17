import { AddressReadModel } from "../../domain/read-models/address.read-models";
import { AddressInternalService } from "../address.app.internal.service";
import { EnsureActiveAddressGetByIdQuery } from "../queries/ensure-active-address-get-by-it.query";

export class EnsureActiveAddressGetByIdQueryHandler {
    readonly type = 'EnsureActiveAddressGetByIdQuery';
    constructor(private readonly internalService: AddressInternalService) { }
    async handle(
        query: EnsureActiveAddressGetByIdQuery,
    ): Promise<{ address: AddressReadModel | null; active: boolean }> {
        return await this.internalService.ensureActiveAddressGetById(query.payload.addressId);
    }
}
