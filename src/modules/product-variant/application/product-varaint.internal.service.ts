import type { InMemoryQueryBus } from '../../../core/domain/infrastructure/in-memory-query-bus';
import type { Id } from '../../../core/domain/value-objects/id.vo';
import { BaseService } from '../../../core/services/base.services';
import type { ProductVariantReadModel } from '../domain/read-models/product-variant.read-model';
import { productVariantMapper } from '../infrastructure/product-variant.mapper';
import type { ProductVariantRepository } from '../infrastructure/product-variant.repository';

export class productVariantInternalService extends BaseService {
    constructor(
        private readonly vairiantRepo: ProductVariantRepository,
        private readonly queryBus: InMemoryQueryBus,
    ) {
        super();
    }

    async ensureActiveVariantGetById(
        variantId: Id,
    ): Promise<{ variant: ProductVariantReadModel | null; active: boolean }> {
        const variant = await this.vairiantRepo.FindById(variantId);
        if (!variant) return { variant: null, active: false };
        if (variant.delete.isDeleted || !variant.active)
            return { variant: productVariantMapper.aggregateToReadModel(variant), active: false };
        return { variant: productVariantMapper.aggregateToReadModel(variant), active: true };
    }
}
