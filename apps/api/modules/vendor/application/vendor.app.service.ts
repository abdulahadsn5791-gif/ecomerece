import { ContactInfoVO, ImageInfoVO, VendorAggregate } from '@ecomerece/domain';
import { Description } from '@ecomerece/domain/value-objects/description.vo';
import { EmailVO } from '@ecomerece/domain/value-objects/email.vo';
import { Id } from '@ecomerece/domain/value-objects/id.vo';
import { PhoneNumber } from '@ecomerece/domain/value-objects/phone-no.vo';
import { Reason } from '@ecomerece/domain/value-objects/reason.vo';
import { Slug } from '@ecomerece/domain/value-objects/slug.vo';
import {
    AddressVO,
    CityVO,
    CountryVO,
    PostalCodeVO,
    StateVO,
    StreetAddressVO,
} from '@ecomerece/domain/value-objects/street-address.vo';
import { Title } from '@ecomerece/domain/value-objects/title.vo';
import { UrlVO } from '@ecomerece/domain/value-objects/url.vo';
import { Quantity } from '@ecomerece/domain/value-objects/quantity.vo';
import type { FilterQuery } from 'mongoose';
import type {
    CreateVendorDto,
    DeleteMyVendorDto,
    DeleteVendorDto,
    GetPaginatedVendorsQueryDto,
    RecoverVendorDto,
    RejectVendorDto,
    VendorListItemReadModel,
    VendorResponseReadModel,
    VerifyVendorDto,
} from '@ecomerece/shared';
import type { InMemoryEventBus } from '../../../core/infrastructure/buses/in-memory-event-bus';
import { BaseService } from '../../../core/services/base.services';
import { VendorMapper } from '../infrastructure/vendor.mapper';
import type { VendorRepository } from '../infrastructure/vendor.repository';
import type { VendorPersistence } from '../infrastructure/vendor.models';
import type { UserPersistence } from '../../user/infrastructure/user.models';
import { VendorMessages, type VendorMessagesType } from '../presentation/vendor.messages';
import type { VendorInternalService } from './vendor.internal.service';

const VENDOR_COLLATION = { locale: 'en', strength: 2 };

const escapeRegex = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class VendorAppService extends BaseService {
    constructor(
        private readonly vendorRepo: VendorRepository,
        private readonly eventBus: InMemoryEventBus,
        private readonly internalService: VendorInternalService,
    ) {
        super();
    }

    async createMyVendor(
        data: CreateVendorDto,
        actor: UserPersistence,
    ): Promise<VendorMessagesType> {
        const actorId = Id.create(actor._id);
        await this.internalService.canCreateVendor(actorId);

        const id = Id.create();
        const address = AddressVO.create(
            StreetAddressVO.create(data.contacts.address.streetAddress),
            CityVO.create(data.contacts.address.city),
            StateVO.create(data.contacts.address.state),
            PostalCodeVO.create(data.contacts.address.postalCode),
            CountryVO.create(data.contacts.address.country),
        );
        const contacts = ContactInfoVO.create(
            PhoneNumber.create(data.contacts.phone),
            EmailVO.create(data.contacts.email),
            address,
        );
        const tittle = Title.create(data.title);
        const description = Description.create(data.description);
        const image = ImageInfoVO.create(
            UrlVO.create(data.image.logo),
            UrlVO.create(data.image.banner),
        );
        const slug = Slug.create(data.slug);
        const newVendor = VendorAggregate.create({
            id: id,
            ownerId: actorId,
            contacts,
            tittle,
            description,
            image,
            slug,
        });
        newVendor.raiseCreated(id, actorId, tittle, slug);
        await this.vendorRepo.Create(newVendor);

        return VendorMessages.createdVendor(id, actorId);
    }

    async getVendorById(id: string): Promise<VendorResponseReadModel> {
        const vendorId = Id.create(id);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        return VendorMapper.aggregateToResponseReadModel(vendor);
    }

    async findPaginatedVendors(query: GetPaginatedVendorsQueryDto) {
        const filter: FilterQuery<VendorPersistence> = {
            'deleted.deleted': false,
        };
        if (query.search) {
            filter.title = { $regex: `^${escapeRegex(query.search)}` };
        }

        const cursor = query.cursor ? Id.create(query.cursor) : undefined;
        const limit = query.limit ? Quantity.create(query.limit) : undefined;

        const result = await this.vendorRepo.FindPaginated({
            filter,
            cursor,
            limit,
            direction: query.direction,
            collation: VENDOR_COLLATION,
        });

        const data: VendorListItemReadModel[] = result.data.map((aggregate) => ({
            id: aggregate.id.value,
            title: aggregate.title.value,
            slug: aggregate.slug.value,
        }));

        return {
            data,
            meta: result.meta,
        };
    }

    async deleteMyVendor(data: DeleteMyVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const reason = Reason.create(data.reason);
        const vendor = await this.vendorRepo.FindByOwnerIdOrThrow(actorId);
        vendor.deleteVendor(actorId, reason);
        await this.vendorRepo.Save(vendor);

        return VendorMessages.deletedVendor(vendor.id, actorId);
    }
    async softDeleteVendor(data: DeleteVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const vendorId = Id.create(data.vendorId);
        const reason = Reason.create(data.reason);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        vendor.deleteVendor(actorId, reason);
        await this.vendorRepo.Save(vendor);

        return VendorMessages.deletedVendor(vendor.id, actorId);
    }

    async recoverVendor(data: RecoverVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const vendorId = Id.create(data.vendorId);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        vendor.recoverVendor(actorId);
        await this.vendorRepo.Save(vendor);

        return VendorMessages.recoveredVendor(vendor.id, actorId);
    }

    async verifyVendor(data: VerifyVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const vendorId = Id.create(data.vendorId);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        vendor.verifyVendor(actorId);
        await this.vendorRepo.Save(vendor);

        return VendorMessages.verifiedVendor(vendor.id, actorId);
    }

    async rejectVendorVerification(data: RejectVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const vendorId = Id.create(data.vendorId);
        const reason = Reason.create(data.reason);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        vendor.rejectVerification(actorId, reason);
        await this.vendorRepo.Save(vendor);

        return VendorMessages.rejectVendorVerification(vendor.id, actorId);
    }
}
