import type { Id } from '../../../core/domain/value-objects/id.vo';
import { BaseService } from '../../../core/services/base.services';
import type { ProductReadModel } from '../domain/read-models/product.read-model';
import { ProductMapper } from '../infrastructure/product.mapper';
import type { ProductRepository } from '../infrastructure/product.repository';

export class ProductInternelService extends BaseService {
    constructor(private readonly productRepo: ProductRepository) {
        super();
    }

    async ensureActiveProductGetById(
        productId: Id,
    ): Promise<{ product: ProductReadModel | null; active: boolean }> {
        const product = await this.productRepo.FindById(productId);

        if (!product) return { product: null, active: false };
        const ProductReadModel = ProductMapper.aggregateToReadModel(product);
        if (product.block.isBlocked || product.delete.isDeleted)
            return { product: ProductReadModel, active: false };
        return { product: ProductReadModel, active: true };
    }

    async verifyProductAndGet(ids: Id[]): Promise<{
        validIds: Id[], invalidIds: Id[], products: ProductReadModel[]
    }> {
        const products = await this.productRepo.FindByIds(ids);
        const foundIds = new Set(products.map(p => p.id));

        const validProducts = products.filter(p =>
            !p.delete.deleted && !p.block.blocked
        );
        const validIds = validProducts.map((value) => (value.id));
        const notFound = products.filter(id => !foundIds.has(id.id));
        const notFoundIds = notFound.map((value) => (value.id));
        const deletedIds = products.filter(p => p.delete.deleted).map(p => p.id);
        const bannedIds = products.filter(p => p.block.blocked).map(p => p.id);
        const invalidIds = [...notFoundIds, ...deletedIds, ...bannedIds];

        return { validIds, invalidIds, products: products.map((value) => ProductMapper.aggregateToReadModel(value)) }
    }

}
