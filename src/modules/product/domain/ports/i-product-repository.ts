import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { ProductAggregate } from '../product.aggregate';

export interface IProductRepository {
    FindById(id: Id): Promise<ProductAggregate | null>;
    FindByVendorId(id: Id): Promise<ProductAggregate | null>;
    FindByIdOrThrow(id: Id): Promise<ProductAggregate>;
    FindByVendorIdOrThrow(id: Id): Promise<ProductAggregate>;
    Save(user: ProductAggregate): Promise<void>;
    Delete(id: Id): Promise<void>;
    Exists(id: Id): Promise<boolean>;
    Create(user: ProductAggregate): Promise<void>
}
