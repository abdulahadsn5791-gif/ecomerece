import type { VendorReadModel } from '@ecomerece/domain';
import type { EnsureActiveVendorGetByIdQuery } from '../queries/ensure-active-vendor-get-by-id.query';

import type { VendorInternalService } from '../vendor.internal.service';

export class EnsureActiveVendorGetByIdHandler {
    readonly type = 'EnsureActiveVendorGetByIdQuery';
    constructor(private readonly internalService: VendorInternalService) { }
    async handle(
        query: EnsureActiveVendorGetByIdQuery,
    ): Promise<{ vendor: VendorReadModel | null; active: boolean }> {
        return await this.internalService.ensureActiveVendorGetById(query.payload.vendorId);
    }
}
