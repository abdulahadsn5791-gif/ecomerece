import { ProductReadModel } from "../../domain/read-models/product.read-model";

import { ProductInternelService } from "../product.internel.service";
import { EnsureActiveProductGetByIdQuery } from "../queries/ensure-active-product-get-by-id.query";

export class EnsureActiveProductGetByIdHandler {
    readonly type = 'EnsureActiveProductGetByIdQuery';
    constructor(private readonly internalService: ProductInternelService) { }
    async handle(query: EnsureActiveProductGetByIdQuery): Promise<{ product: ProductReadModel | null; active: boolean }> {
        return await this.internalService.ensureActiveProductGetById(query.payload.productId);
    }
}
