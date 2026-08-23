import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { ProductReadModel } from '@ecomerece/domain';
import type { ProductInternelService } from '../product.internel.service';
import type { VerifyProductAndGetQuery } from '../queries/verify-product-and-get.query';

export class VerifyProductAndGetHandler {
    readonly type = 'VerifyProductAndGetQuery';
    constructor(private readonly internalService: ProductInternelService) { }
    async handle(query: VerifyProductAndGetQuery): Promise<{
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        blockedIds: Id[];
        productReadModel: ProductReadModel[];
    }> {
        return await this.internalService.verifyProductAndGet(query.payload.ids);
    }
}
