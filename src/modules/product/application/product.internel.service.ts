import { InMemoryQueryBus } from "../../../core/domain/infrastructure/in-memory-query-bus";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { BaseService } from "../../../core/services/base.services";
import { ProductReadModel } from "../domain/read-models/product.read-model";
import { ProductMapper } from "../infrastructure/product.mapper";
import { ProductRepository } from "../infrastructure/product.repository";

export class ProductInternelService extends BaseService {
    constructor(
        private readonly productRepo: ProductRepository) { super(); }

    async ensureActiveProductGetById(productId: Id): Promise<{ product: ProductReadModel | null; active: boolean }> {
        const product = await this.productRepo.FindById(productId);

        if (!product) return { product: null, active: false }
        const ProductReadModel = ProductMapper.aggregateToReadModel(product);
        if (
            product.block.isBlocked ||
            product.delete.isDeleted) return { product: ProductReadModel, active: false }
        return { product: ProductReadModel, active: true }
    }

}