import type { VendorReadModel } from '@ecomerece/domain';
import type { GetVendorByUserIdQuery } from '../queries/get-vendor-by-user-id.query';
import type { VendorInternalService } from '../vendor.internal.service';

export class GetVendorByUserIdHandler {
    readonly type = 'GetVendorByUserIdQuery';
    constructor(private readonly internalService: VendorInternalService) { }
    async handle(query: GetVendorByUserIdQuery): Promise<VendorReadModel | null> {
        return await this.internalService.getVendorByUserId(query.payload.userId);
    }
}
