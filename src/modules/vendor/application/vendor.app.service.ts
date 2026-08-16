import type { InMemoryEventBus } from '../../../core/domain/infrastructure/in-memory-event-bus';

import { Description } from '../../../core/domain/value-objects/description.vo';
import { EmailVO } from '../../../core/domain/value-objects/email.vo';
import { Id } from '../../../core/domain/value-objects/id.vo';
import { PhoneNumber } from '../../../core/domain/value-objects/phone-no.vo';
import { Reason } from '../../../core/domain/value-objects/reason.vo';
import { Slug } from '../../../core/domain/value-objects/slug.vo';
import {
    AddressVO,
    CityVO,
    CountryVO,
    PostalCodeVO,
    StateVO,
    StreetAddressVO,
} from '../../../core/domain/value-objects/street-address.vo';
import { Title } from '../../../core/domain/value-objects/title.vo';
import { UrlVO } from '../../../core/domain/value-objects/url.vo';
import { BaseService } from '../../../core/services/base.services';
import type { UserPersistence } from '../../user/infrastructure/user.models';
import type { IVendorRepository } from '../domain/ports/i-vendor-repository';
import type { VendorResponseReadModel } from '../domain/read-models/vendor-response-read-model';
import { ContactInfoVO } from '../domain/value-objects/contact-info.vo';
import { ImageInfoVO } from '../domain/value-objects/image-info.vo';
import { VendorAggregate } from '../domain/vendor.aggregate';
import { VendorMapper } from '../infrastructure/vendor.mapper';
import type { CreateVendorDto } from '../presentation/dto/create-vendorDto';
import type { DeleteMyVendorDto, DeleteVendorDto } from '../presentation/dto/delete-vendor.dto';
import type { RecoverVendorDto } from '../presentation/dto/recover-vendor.dto';
import type { RejectVendorDto } from '../presentation/dto/reject-vendor.dto';
import type { VerifyVendorDto } from '../presentation/dto/verify-vendor.dto';
import { VendorMessages, type VendorMessagesType } from '../presentation/vendor.messages';
import type { VendorInternalService } from './vendor.internal.service';

export class VendorAppService extends BaseService {
    constructor(
        private readonly vendorRepo: IVendorRepository,
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
        await this.eventBus.publish(newVendor.pullEvents());
        return VendorMessages.createdVendor(id, actorId);
    }

    async getVendorById(id: string): Promise<VendorResponseReadModel> {
        const vendorId = Id.create(id);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        return VendorMapper.aggregateToResponseReadModel(vendor);
    }

    async deleteMyVendor(data: DeleteMyVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const reason = Reason.create(data.reason);
        const vendor = await this.vendorRepo.FindByOwnerIdOrThrow(actorId);
        vendor.deleteVendor(actorId, reason);
        await this.vendorRepo.Save(vendor);
        await this.eventBus.publish(vendor.pullEvents());
        return VendorMessages.deletedVendor(vendor.id, actorId);
    }
    async softDeleteVendor(data: DeleteVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const vendorId = Id.create(data.vendorId);
        const reason = Reason.create(data.reason);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        vendor.deleteVendor(actorId, reason);
        await this.vendorRepo.Save(vendor);
        await this.eventBus.publish(vendor.pullEvents());
        return VendorMessages.deletedVendor(vendor.id, actorId);
    }

    async recoverVendor(data: RecoverVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const vendorId = Id.create(data.vendorId);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        vendor.recoverVendor(actorId);
        await this.vendorRepo.Save(vendor);
        await this.eventBus.publish(vendor.pullEvents());
        return VendorMessages.recoveredVendor(vendor.id, actorId);
    }

    async verifyVendor(data: VerifyVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const vendorId = Id.create(data.vendorId);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        vendor.verifyVendor(actorId);
        await this.vendorRepo.Save(vendor);
        await this.eventBus.publish(vendor.pullEvents());
        return VendorMessages.verifiedVendor(vendor.id, actorId);
    }

    async rejectVendorVerification(data: RejectVendorDto, actor: UserPersistence) {
        const actorId = Id.create(actor._id);
        const vendorId = Id.create(data.vendorId);
        const reason = Reason.create(data.reason);
        const vendor = await this.vendorRepo.FindByIdOrThrow(vendorId);
        vendor.rejectVerification(actorId, reason);
        await this.vendorRepo.Save(vendor);
        await this.eventBus.publish(vendor.pullEvents());
        return VendorMessages.rejectVendorVerification(vendor.id, actorId);
    }
}
