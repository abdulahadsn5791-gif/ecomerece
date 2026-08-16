import type { Id } from '../../../core/domain/value-objects/id.vo';
import { MongoRepository } from '../../../core/repository/mongo.repository';
import { BadRequestError, ConcurrencyError, NotFoundError } from '../../../errors/app-error';
import type { IProductRepository } from '../domain/ports/i-product-repository';
import type { ProductAggregate } from '../domain/product.aggregate';
import { ProductMapper } from './product.mapper';
import { ProductModel, type ProductPersistence } from './product.model';

export class ProductRepository
    extends MongoRepository<ProductPersistence>
    implements IProductRepository {
    constructor() {
        super(ProductModel);
    }

    async FindById(id: Id): Promise<ProductAggregate | null> {
        const doc = await super.findById(id.value);

        if (!doc) return null;

        return ProductMapper.persistenceToAggregate(doc);
    }


    async EnsureOwnerShip(productId: Id, vendorId: Id): Promise<ProductAggregate | null> {
        const doc = await super.findOne({
            _id: productId,
            vendorId: vendorId,
        })
        if (!doc) return null;
        return ProductMapper.persistenceToAggregate(doc);
    }

    async EnsureOwnerShipOrThrow(productId: Id, vendorId: Id): Promise<ProductAggregate> {
        const doc = await super.findOne({
            _id: productId.value,
            vendorId: vendorId.value,
        })
        if (!doc) throw new BadRequestError('User don`t own that product');
        return ProductMapper.persistenceToAggregate(doc);
    }

    async FindByVendorId(id: Id): Promise<ProductAggregate | null> {
        const doc = await super.findOne({
            vendorId: id.value,
        });

        if (!doc) return null;

        return ProductMapper.persistenceToAggregate(doc);
    }

    async FindByIdOrThrow(id: Id): Promise<ProductAggregate> {
        const doc = await super.findById(id.value);

        if (!doc) {
            throw new NotFoundError('Product not found with this id');
        }

        return ProductMapper.persistenceToAggregate(doc);
    }

    async FindByVendorIdOrThrow(id: Id): Promise<ProductAggregate> {
        const doc = await super.findOne({
            vendorId: id.value,
        });

        if (!doc) {
            throw new NotFoundError('Product not found for this vendor');
        }

        return ProductMapper.persistenceToAggregate(doc);
    }

    async Save(product: ProductAggregate): Promise<void> {
        const data = ProductMapper.aggregateToPersistence(product);


        const { version: _, ...updateData } = data;

        const result = await ProductModel.updateOne(
            {
                _id: product.id.value,
                version: product.version.value,
            },
            {
                $set: updateData,
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

    async Create(product: ProductAggregate): Promise<void> {
        const persistantProduct = ProductMapper.aggregateToPersistence(product);
        const productDoc = new ProductModel(persistantProduct);

        await super.create(productDoc)
    }
    async Exists(id: Id): Promise<boolean> {
        return !!(await super.exists({
            _id: id.value,
        }));
    }
}
