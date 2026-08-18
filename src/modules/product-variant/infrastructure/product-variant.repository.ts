import type { Id } from '../../../core/domain/value-objects/id.vo';
import { MongoRepository } from '../../../core/repository/mongo.repository';
import { BadRequestError, ConcurrencyError } from '../../../errors/app-error';

import type { IProductVariantRepository } from '../domain/ports/i-product-variant-repository';
import type { ProductVariantAggregate } from '../domain/product-variant.aggregate';
import { productVariantMapper } from './product-variant.mapper';
import { ProductVariantModel, type ProductVariantPersistence } from './product-variant.model';

export class ProductVariantRepository
    extends MongoRepository<ProductVariantPersistence>
    implements IProductVariantRepository {
    constructor() {
        super(ProductVariantModel);
    }

    async FindById(id: Id): Promise<ProductVariantAggregate | null> {
        const doc = await super.findById(id.value);
        if (!doc) return null;
        return productVariantMapper.persistenceToAggregate(doc);
    }

    async FindByIds(id: Id[]): Promise<ProductVariantAggregate[]> {
        const ids = id.map((value) => (value.toString()));
        const docs = await super.find(ids);
        return docs.map((value) => (productVariantMapper.persistenceToAggregate(value)));
    }

    async FindByIdOrThrow(id: Id): Promise<ProductVariantAggregate> {
        const doc = await super.findById(id.value);
        if (!doc) throw new BadRequestError('Product Varient not found with this id');
        return productVariantMapper.persistenceToAggregate(doc);
    }
    async FindByProductId(productId: Id): Promise<ProductVariantAggregate[] | null> {
        const doc = await super.find({ productId: productId.value });
        if (doc.length < 1) return null;
        const docs = doc.map((value) => productVariantMapper.persistenceToAggregate(value));
        return docs;
    }
    async EnsureOwnerShipGetByIdOrThrow(
        productId: Id,
        variantId: Id,
    ): Promise<ProductVariantAggregate> {
        const doc = await super.findOne({ productId: productId.value, _id: variantId.value });
        if (!doc) throw new BadRequestError('Product dont own that varaint');
        return productVariantMapper.persistenceToAggregate(doc);
    }
    async Save(product: ProductVariantAggregate): Promise<void> {
        const data = productVariantMapper.aggregateToPersistence(product);

        const result = await ProductVariantModel.updateOne(
            {
                _id: product.id.value,
                version: product.version.value,
            },
            {
                $set: data,
                $inc: { version: 1 },
            },
        );
        if (result.modifiedCount === 0) {
            throw new ConcurrencyError();
        }
    }

    async Delete(id: Id): Promise<void> {
        await super.findByIdAndDelete(id.value);
    }

    async Create(product: ProductVariantAggregate): Promise<void> {
        const persistantProduct = productVariantMapper.aggregateToPersistence(product);
        const productDoc = new ProductVariantModel(persistantProduct);
        await super.create(productDoc);
    }

    async Exists(id: Id): Promise<boolean> {
        return !!(await super.exists({
            _id: id.value,
        }));
    }
}
