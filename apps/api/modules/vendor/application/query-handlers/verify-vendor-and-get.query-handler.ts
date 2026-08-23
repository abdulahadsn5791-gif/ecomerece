import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { VendorReadModel } from '@ecomerece/domain/modules/address/read-models/vendor-read-model';
import type { VerifyVendorAndGetQuery } from '../queries/verify-vendor-and-get.query';
import type { VendorInternalService } from '../vendor.internal.service';

export class VerifyVendorAndGetHandler {
    readonly type = 'VerifyVendorAndGetQuery';
    constructor(private readonly internalService: VendorInternalService) {}
    async handle(query: VerifyVendorAndGetQuery): Promise<{
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        nonVerifiedIds: Id[];
        vendorReadModel: VendorReadModel[];
    }> {
        return await this.internalService.verifyVendorAndGet(query.payload.ids);
    }
}
