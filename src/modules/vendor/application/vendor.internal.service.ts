import type { IQueryBus } from '../../../core/domain/query/query-bus.interface';
import type { Id } from '../../../core/domain/value-objects/id.vo';
import { BaseService } from '../../../core/services/base.services';
import { BadRequestError } from '../../../errors/app-error';
import { EnsureActiveQuery } from '../../user/application/queries/ensure-active.query';
import type { IVendorRepository } from '../domain/ports/i-vendor-repository';
import type { VendorReadModel } from '../domain/read-models/vendor-read-model';
import { VendorMapper } from '../infrastructure/vendor.mapper';

export class VendorInternalService extends BaseService {
    constructor(
        private readonly vendorRepo: IVendorRepository,
        private readonly queryBus: IQueryBus,
    ) {
        super();
    }
    async canCreateVendor(id: Id) {
        const user = await this.queryBus.execute(new EnsureActiveQuery({ userId: id }));

        if (!user) throw new BadRequestError('User is not active');
        const vendor = await this.vendorRepo.FindByOwnerId(id);
        if (vendor) throw new BadRequestError('User cannot create more than one vendor');
    }
    async getVendorByUserId(id: Id): Promise<VendorReadModel | null> {
        const vendor = await this.vendorRepo.FindByOwnerId(id);
        if (!vendor) return null;
        return VendorMapper.aggregateToReadModel(vendor);
    }

    async ensureActiveVendor(userId: Id, vendorId: Id): Promise<VendorReadModel> {
        const user = await this.queryBus.execute(new EnsureActiveQuery({ userId: userId }));
        if (!user) throw new BadRequestError('User is not active');
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        if (vendor.ownerId !== userId) throw new BadRequestError('Owner dont own that vendor');
        if (vendor.delete.isDeleted) throw new BadRequestError('Vendor was removed');
        if (!vendor.verification.isVerified) throw new BadRequestError('Vendor is not verified');
        return VendorMapper.aggregateToReadModel(vendor);
    }

    async ensureActiveVendorGetById(
        vendorId: Id,
    ): Promise<{ vendor: VendorReadModel | null; active: boolean }> {
        const vendor = await this.vendorRepo.FindById(vendorId);

        if (!vendor) return { vendor: null, active: false };

        if (
            vendor.delete.isDeleted ||
            !vendor.verification.isVerified ||
            vendor.verification.isRejected
        )
            return { vendor: VendorMapper.aggregateToReadModel(vendor), active: false };
        return { vendor: VendorMapper.aggregateToReadModel(vendor), active: true };
    }

    async verifyVendorAndGet(ids: Id[]): Promise<{
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        nonVerifiedIds: Id[];
        vendorReadModel: VendorReadModel[];
    }> {
        const vendors = await this.vendorRepo.FindByIds(ids);
        const validVendors = vendors.filter(
            (v) => !v.delete.isDeleted && v.verification.isVerified,
        );
        const validIdValues = new Set(validVendors.map((v) => v.id.value));
        const existingVendorIds = new Set(vendors.map((v) => v.id.value));
        const foundIds = ids.filter((id) => existingVendorIds.has(id.value));
        const notFoundIds = ids.filter((id) => !existingVendorIds.has(id.value));
        const deletedIds = vendors.filter((v) => v.delete.isDeleted).map((v) => v.id);
        const nonVerifiedIds = vendors.filter((v) => !v.verification.isVerified).map((v) => v.id);
        const validIds = foundIds.filter((id) => validIdValues.has(id.value));
        const vendorReadModel = validVendors.map((v) => VendorMapper.aggregateToReadModel(v));
        return { validIds, notFoundIds, deletedIds, nonVerifiedIds, vendorReadModel };
    }
}
