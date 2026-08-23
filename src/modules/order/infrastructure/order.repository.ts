import type { Id } from '../../../core/domain/value-objects/id.vo';
import { MongoRepository } from '../../../core/repository/mongo.repository';
import { BadRequestError, ConcurrencyError } from '../../../errors/app-error';
import type { OrderAggregate } from '../domain/order.aggregate';
import type { IOrderRepository } from '../domain/ports/i-order-repository';
import { OrderMapper } from './order.mapper';
import { OrderModel, type OrderPersistence } from './order.model';

export class OrderRepository extends MongoRepository<OrderPersistence> implements IOrderRepository {
    constructor() {
        super(OrderModel);
    }

    async FindById(id: Id): Promise<OrderAggregate | null> {
        const doc = await super.findById(id.value);
        if (!doc) return null;
        return OrderMapper.persistenceToAggregate(doc);
    }
    async FindByIdOrThrow(id: Id): Promise<OrderAggregate> {
        const doc = await super.findById(id.value);
        if (!doc) throw new BadRequestError('Order not found with this id');
        return OrderMapper.persistenceToAggregate(doc);
    }

    async Save(product: OrderAggregate): Promise<void> {

        const data = OrderMapper.aggregateToPersistence(product);

        const result = await super.updateOne(
            {
                _id: product.id.value,
                version: product.version.value,
            },
            {
                $set: data,
                $inc: { version: 1 },
            },
        );

        if (result.modifiedCount === 0) throw new ConcurrencyError();
    }
    async Delete(id: Id): Promise<void> {
        await super.findByIdAndDelete(id.value);
    }

    async Create(product: OrderAggregate): Promise<void> {
        console.log('1')
        const persistantProduct = OrderMapper.aggregateToPersistence(product);
        console.log('2')
        const productDoc = new OrderModel(persistantProduct);
        console.log('3');
        await super.create(productDoc);
        console.log('4')
    }

    async Exists(id: Id): Promise<boolean> {
        return !!(await super.exists({
            _id: id.value,
        }));
    }
}
