import type { ProductReadModel } from '@ecomerece/domain';

import type { ProductInternelService } from '../product.internel.service';
import type { EnsureActiveProductGetByIdQuery } from '../queries/ensure-active-product-get-by-id.query';

export class EnsureActiveProductGetByIdHandler {
    readonly type = 'EnsureActiveProductGetByIdQuery';
    constructor(private readonly internalService: ProductInternelService) { }
    async handle(
        query: EnsureActiveProductGetByIdQuery,
    ): Promise<{ product: ProductReadModel | null; active: boolean }> {
        return await this.internalService.ensureActiveProductGetById(query.payload.productId);
    }
}
