import { VendorReadModel } from "../../domain/read-models/vendor-read-model";
import { EnsureActiveVendorGetByIdQuery } from "../queries/ensure-active-vendor-get-by-id.query";

import { VendorInternalService } from "../vendor.internal.service";

export class EnsureActiveVendorGetByIdHandler {
    readonly type = 'EnsureActiveVendorGetByIdQuery';
    constructor(private readonly internalService: VendorInternalService) { }
    async handle(query: EnsureActiveVendorGetByIdQuery): Promise<{ vendor: VendorReadModel | null; active: boolean }> {
        return await this.internalService.ensureActiveVendorGetById(query.payload.vendorId);
    }
}
