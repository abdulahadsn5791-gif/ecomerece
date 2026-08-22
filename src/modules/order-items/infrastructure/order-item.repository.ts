import { MongoRepository } from "../../../core/repository/mongo.repository";
import { IOrderItemsRepository } from "../domain/ports/i-order-items.repository";
import { OrderItemsModel, OrderItemsPersistence } from "./order-item.model";






export class OrderItemsRepository
    extends MongoRepository<OrderItemsPersistence>
    implements IOrderItemsRepository {

    constructor() { super(OrderItemsModel); }



    FindById(id: Id): Promise<OrderItemsAggregate | null> { }
    FindByIdOrThrow(id: Id): Promise<OrderItemsAggregate> { }
    Save(user: OrderItemsAggregate): Promise<void> { }
    SaveMany(user: OrderItemsAggregate[]): Promise<void> { }
    Delete(id: Id): Promise<void> { }
    Exists(id: Id): Promise<boolean> { }
    Create(user: OrderItemsAggregate): Promise<void> { }
    CreateMany(user: OrderItemsAggregate[]): Promise<void> { }

}
