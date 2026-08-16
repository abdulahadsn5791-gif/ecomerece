import type { Id } from '../../../../core/domain/value-objects/id.vo';

export interface IOrderRepository {
    FindById(id: Id): Promise<InventoryAggregate | null>;
    FindByVariantId(id: Id): Promise<InventoryAggregate | null>;
    FindByIdOrThrow(id: Id): Promise<InventoryAggregate>;
    FindByVariantIdOrThrow(id: Id): Promise<InventoryAggregate>;
    Save(user: InventoryAggregate): Promise<void>;
    Delete(id: Id): Promise<void>;
    Exists(id: Id): Promise<boolean>;
    Create(user: InventoryAggregate): Promise<void>;
}
