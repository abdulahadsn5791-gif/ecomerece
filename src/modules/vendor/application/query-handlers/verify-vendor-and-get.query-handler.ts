import { Id } from "../../../../core/domain/value-objects/id.vo";
import { VendorReadModel } from "../../domain/read-models/vendor-read-model";
import { VerifyVendorAndGetQuery } from "../queries/verify-vendor-and-get.query";
import { VendorInternalService } from "../vendor.internal.service";

export class VerifyVendorAndGetHandler {
    readonly type = 'VerifyVendorAndGetQuery';
    constructor(private readonly internalService: VendorInternalService) { }
    async handle(query: VerifyVendorAndGetQuery): Promise<{ validIds: Id[], invalidIds: Id[], vendorReadModel: VendorReadModel[] }> {
        return await this.internalService.verifyVendorAndGet(query.payload.ids);
    }
}