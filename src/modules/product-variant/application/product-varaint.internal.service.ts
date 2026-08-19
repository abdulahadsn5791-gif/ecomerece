import type { InMemoryQueryBus } from '../../../core/domain/infrastructure/in-memory-query-bus';
import type { Id } from '../../../core/domain/value-objects/id.vo';
import { BaseService } from '../../../core/services/base.services';
import { ProductVariantAggregate } from '../domain/product-variant.aggregate';
import type { ProductVariantReadModel } from '../domain/read-models/product-variant.read-model';
import { productVariantMapper } from '../infrastructure/product-variant.mapper';
import type { ProductVariantRepository } from '../infrastructure/product-variant.repository';

export class productVariantInternalService extends BaseService {
    constructor(
        private readonly variantRepo: ProductVariantRepository,
        private readonly queryBus: InMemoryQueryBus,
    ) {
        super();
    }

    async ensureActiveVariantGetById(
        variantId: Id,
    ): Promise<{ variant: ProductVariantReadModel | null; active: boolean }> {
        const variant = await this.variantRepo.FindById(variantId);
        if (!variant) return { variant: null, active: false };
        if (variant.delete.isDeleted || !variant.active)
            return { variant: productVariantMapper.aggregateToReadModel(variant), active: false };
        return { variant: productVariantMapper.aggregateToReadModel(variant), active: true };
    }
    async verifyVariantsAndGet(ids: Id[]): Promise<{ validIds: Id[], invalidIds: Id[], variantReadModel: ProductVariantReadModel[] }> {
        const variants = await this.variantRepo.FindByIds(ids);
        const existingVariantIds = new Set(variants.map(variant => variant.id.value));
        const validIds = ids.filter(id => existingVariantIds.has(id.value));
        const notfoundIds = ids.filter(id => !existingVariantIds.has(id.value));
        const nonActiveIds = variants.filter(p => p.active).map(p => p.id);
        const deletedIds = variants.filter(p => p.delete.deleted).map(p => p.id);
        const invalidIds = [...notfoundIds, ...nonActiveIds, ...deletedIds];
        const variantReadModel = variants.map((value) => (productVariantMapper.aggregateToReadModel(value)));
        return {
            validIds,
            invalidIds,
            variantReadModel,
        };
    }

}
