import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { OrderAggregate } from '../order.aggregate';

export interface IOrderRepository {
    FindById(id: Id): Promise<OrderAggregate | null>;
    FindByIdOrThrow(id: Id): Promise<OrderAggregate>;
    Save(user: OrderAggregate): Promise<void>;
    Delete(id: Id): Promise<void>;
    Exists(id: Id): Promise<boolean>;
    Create(user: OrderAggregate): Promise<void>;
}
