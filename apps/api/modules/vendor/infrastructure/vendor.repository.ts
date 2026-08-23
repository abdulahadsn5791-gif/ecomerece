import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import { MongoRepository } from '../../../core/repository/mongo.repository';
import { BadRequestError, ConcurrencyError, NotFoundError } from '../../../errors/app-error';
import type { IVendorRepository } from '@ecomerece/domain/modules/address/ports/i-vendor-repository';

import type { VendorAggregate } from '@ecomerece/domain/modules/address/vendor.aggregate';
import { VendorMapper } from './vendor.mapper';

import { VendorModel, type VendorPersistence } from './vendor.models';

export class VendorRepository
    extends MongoRepository<VendorPersistence>
    implements IVendorRepository
{
    constructor() {
        super(VendorModel);
    }

    async FindByOwnerId(id: Id): Promise<VendorAggregate | null> {
        const doc = await super.findOne({ ownerId: id });
        if (!doc) return null;
        return VendorMapper.persistenceToAggregate(doc);
    }
    async EnsureOwnershipOrThrow(vendorId: Id, userId: Id): Promise<VendorAggregate> {
        const doc = await super.findOne({ _id: vendorId, ownerId: userId });
        if (!doc) throw new BadRequestError('User dont own this vendor');
        return VendorMapper.persistenceToAggregate(doc);
    }

    async FindById(id: Id): Promise<VendorAggregate | null> {
        const doc = await super.findById(id.value);
        if (!doc) return null;
        return VendorMapper.persistenceToAggregate(doc);
    }
    async FindByIds(id: Id[]): Promise<VendorAggregate[]> {
        const ids = id.map((value) => value.value);
        const filter = {
            _id: { $in: ids },
        };

        const docs = await super.find(filter);
        return docs.map((value) => VendorMapper.persistenceToAggregate(value));
    }

    async FindByIdOrThrow(id: Id): Promise<VendorAggregate> {
        const doc = await super.findById(id.value);

        if (!doc) {
            throw new NotFoundError('Vendor not found with this Id');
        }

        return VendorMapper.persistenceToAggregate(doc);
    }
    async FindByOwnerIdOrThrow(id: Id): Promise<VendorAggregate> {
        const doc = await super.findOne({ ownerId: id });

        if (!doc) {
            throw new NotFoundError('Vendor not found with this Id');
        }

        return VendorMapper.persistenceToAggregate(doc);
    }

    async Create(vendor: VendorAggregate): Promise<void> {
        const data = VendorMapper.aggregateToPersistence(vendor);

        await VendorModel.create({
            ...data,
        });
    }
    async Save(vendor: VendorAggregate): Promise<void> {
        const data = VendorMapper.aggregateToPersistence(vendor);

        const result = await VendorModel.updateOne(
            {
                _id: vendor.id.value,
                version: vendor.version,
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

    async Exists(id: Id): Promise<boolean> {
        return !!(await super.exists({
            _id: id.value,
        }));
    }
}
