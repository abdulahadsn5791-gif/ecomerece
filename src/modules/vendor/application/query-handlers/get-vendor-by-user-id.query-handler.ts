import { VendorReadModel } from "../../domain/read-models/vendor-read-model";
import { GetVendorByUserIdQuery } from "../queries/get-vendor-by-user-id.query";
import { VendorInternalService } from "../vendor.internal.service";

export class GetVendorByUserIdHandler {
    readonly type = 'GetVendorByUserIdQuery';
    constructor(private readonly internalService: VendorInternalService) { }
    async handle(query: GetVendorByUserIdQuery): Promise<VendorReadModel | null> {
        return await this.internalService.getVendorByUserId(query.payload.userId);
    }
}
