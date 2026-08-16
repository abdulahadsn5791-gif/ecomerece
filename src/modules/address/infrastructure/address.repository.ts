import { Id } from "../../../core/domain/value-objects/id.vo";
import { MongoRepository } from "../../../core/repository/mongo.repository";
import { BadRequestError, ConcurrencyError } from "../../../errors/app-error";
import { AddressAggregate } from "../domain/address.aggregate";
import { IAddressRepository } from "../domain/ports/i-address-repository";
import { AddressMapper } from "./address.mapper";
import { AddressModel, AddressPersistence } from "./address.models";

export class AddressRepository extends MongoRepository<AddressPersistence> implements IAddressRepository {
    constructor() {
        super(AddressModel)
    }

    async FindById(id: Id): Promise<AddressAggregate | null> {
        const doc = await super.findById(id.value);
        if (!doc) return null;
        return AddressMapper.persistenceToAggregate(doc);
    }

    async FindByIdOrThrow(id: Id): Promise<AddressAggregate> {
        const doc = await super.findById(id.value);
        if (!doc) throw new BadRequestError("Address not found with this id");
        return AddressMapper.persistenceToAggregate(doc);
    }

    async FindByOwnerId(id: Id): Promise<AddressAggregate[] | null> {
        const docs = await super.find({
            ownerId: id.value,
            "deleted.deleted": false
        });
        if (!docs || docs.length === 0) return null;
        return docs.map((doc) => AddressMapper.persistenceToAggregate(doc));
    }


    async Save(product: AddressAggregate): Promise<void> {
        const data = AddressMapper.aggregateToPersistence(product);
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

        if (result.modifiedCount === 0) {
            throw new ConcurrencyError();
        }
    }

    async Delete(id: Id): Promise<void> {
        await super.findByIdAndDelete(id.value);
    }

    async Create(add: AddressAggregate): Promise<void> {
        const persistantProduct = AddressMapper.aggregateToPersistence(add);
        const productDoc = new AddressModel(persistantProduct);

        await super.create(productDoc)
    }

    async Exists(id: Id): Promise<boolean> {
        return !!(await super.exists({
            _id: id.value,
        }));
    }

}