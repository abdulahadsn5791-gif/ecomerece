import type { Id } from '../../../core/domain/value-objects/id.vo';
import { MongoRepository } from '../../../core/repository/mongo.repository';
import { BadRequestError, ConcurrencyError } from '../../../errors/app-error';
import type { InventoryAggregate } from '../domain/inventory.aggregate';
import type { IIventoryRepository } from '../domain/ports/i-inventory-repository';
import { InventoryMapper } from './inventory.mapper';
import { InventoryModel, type InventoryPersistence } from './inventory.model';

export class InventoryReposityory
    extends MongoRepository<InventoryPersistence>
    implements IIventoryRepository
{
    constructor() {
        super(InventoryModel);
    }

    async FindById(id: Id): Promise<InventoryAggregate | null> {
        const doc = await super.findById(id.value);
        if (!doc) return null;
        return InventoryMapper.persistenceToAggregate(doc);
    }
    async FindByVariantIds(ids: Id[]): Promise<InventoryAggregate[]> {
        const variantIdValues = ids.map((id) => id.value);
        const docs = await super.find({ variantId: { $in: variantIdValues } });
        return docs.map((doc) => InventoryMapper.persistenceToAggregate(doc));
    }

    async FindByVariantId(id: Id): Promise<InventoryAggregate | null> {
        const doc = await super.findOne({ variantId: id.value });
        if (!doc) return null;
        return InventoryMapper.persistenceToAggregate(doc);
    }

    async FindByIdOrThrow(id: Id): Promise<InventoryAggregate> {
        const doc = await super.findById(id.value);
        if (!doc) throw new BadRequestError('Inventory not found with this id');
        return InventoryMapper.persistenceToAggregate(doc);
    }

    async FindByVariantIdOrThrow(id: Id): Promise<InventoryAggregate> {
        const doc = await super.findOne({ variantId: id.value });
        if (!doc) throw new BadRequestError('Variant dont own this id');
        return InventoryMapper.persistenceToAggregate(doc);
    }

    async Save(inventory: InventoryAggregate): Promise<void> {
        const data = InventoryMapper.aggregateToPersistence(inventory);
        const result = await super.updateOne(
            {
                _id: inventory.id.value,
                version: inventory.version.value,
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
        const doc = await super.findByIdAndDelete(id.value);
        if (!doc) throw new BadRequestError('Inventory not found with this id');
    }

    async Exists(id: Id): Promise<boolean> {
        return !!(await super.exists({
            _id: id.value,
        }));
    }

    async Create(inventory: InventoryAggregate): Promise<void> {
        const inventoryPersistence = InventoryMapper.aggregateToPersistence(inventory);
        const inventoryDoc = new InventoryModel(inventoryPersistence);
        await super.create(inventoryDoc);
    }
}
