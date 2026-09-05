import type { VendorReadModel } from '@ecomerece/domain';
import type { EnsureActiveVendorQuery } from '../queries/ensure-active-vendor.query';
import type { VendorInternalService } from '../vendor.internal.service';

export class EnsureActiveVendorHandler {
    readonly type = 'EnsureActiveVendorQuery';
    constructor(private readonly internalService: VendorInternalService) {}
    async handle(query: EnsureActiveVendorQuery): Promise<VendorReadModel> {
        return await this.internalService.ensureActiveVendor(
            query.payload.userId,
            query.payload.vendorId,
        );
    }
}
