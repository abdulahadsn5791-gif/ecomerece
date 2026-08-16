import { AggregateRoot } from '../../../core/domain/aggregate-root';
import { Description } from '../../../core/domain/value-objects/description.vo';
import { EffectiveDate } from '../../../core/domain/value-objects/effective-date.vo';
import type { EmailVO } from '../../../core/domain/value-objects/email.vo';
import type { Id } from '../../../core/domain/value-objects/id.vo';

import type { PhoneNumber } from '../../../core/domain/value-objects/phone-no.vo';
import { Quantity } from '../../../core/domain/value-objects/quantity.vo';
import type { Reason } from '../../../core/domain/value-objects/reason.vo';
import { Slug } from '../../../core/domain/value-objects/slug.vo';
import type { AddressVO } from '../../../core/domain/value-objects/street-address.vo';
import { Title } from '../../../core/domain/value-objects/title.vo';
import type { UrlVO } from '../../../core/domain/value-objects/url.vo';
import { BadRequestError } from '../../../errors/app-error';
import { VendorCreatedEvent } from './events/create-vendor.event';
import { VendorDeletedEvent } from './events/delete-vendor.event';
import { VendorRecoverEvent } from './events/recover-vendor.event';
import { VendorVerificationRejectedEvent } from './events/reject-vendor.event';
import { VendorVerifiedEvent } from './events/verify-vendor.event';
import type { ContactInfoVO } from './value-objects/contact-info.vo';
import { DeleteInfoVO } from './value-objects/delete-info.vo';
import type { ImageInfoVO } from './value-objects/image-info.vo';

import { VerificationInfoVO } from './value-objects/verification-info.vo';

type CreateVendorProps = {
    id: Id;
    ownerId: Id;
    tittle: Title;
    description: Description;
    contacts: ContactInfoVO;
    image: ImageInfoVO;
    slug: Slug;
};

export class VendorAggregate extends AggregateRoot {
    constructor(
        private readonly _id: Id,
        private readonly _ownerId: Id,
        private _title: Title,
        private _slug: Slug,
        private _description: Description,
        private _verification: VerificationInfoVO,
        private _delete: DeleteInfoVO,
        private _image: ImageInfoVO,
        private _contact: ContactInfoVO,
        private _version: Quantity,
        private readonly _createdAt: EffectiveDate,
    ) {
        super();
    }

    get version() {
        return this._version;
    }

    get id() {
        return this._id;
    }

    get ownerId() {
        return this._ownerId;
    }

    get title() {
        return this._title;
    }

    get slug() {
        return this._slug;
    }

    get description() {
        return this._description;
    }

    get verification() {
        return this._verification;
    }

    get delete() {
        return this._delete;
    }

    get image() {
        return this._image;
    }

    get contact() {
        return this._contact;
    }
    get createdAt() {
        return this._createdAt;
    }

    static create(props: CreateVendorProps): VendorAggregate {
        return new VendorAggregate(
            props.id,
            props.ownerId,
            props.tittle,
            props.slug,
            props.description,

            VerificationInfoVO.none(),
            DeleteInfoVO.none(),
            props.image,
            props.contacts,
            new Quantity(0),
            EffectiveDate.today(),
        );
    }

    static rehydrate(
        id: Id,
        ownerId: Id,
        title: Title,
        slug: Slug,
        description: Description,

        verification: VerificationInfoVO,
        deleteInfo: DeleteInfoVO,
        image: ImageInfoVO,
        contact: ContactInfoVO,
        quantity: Quantity,
        createdAt: EffectiveDate,
    ): VendorAggregate {
        return new VendorAggregate(
            id,
            ownerId,
            title,
            slug,
            description,
            // stats,
            verification,
            deleteInfo,
            image,
            contact,
            quantity,
            createdAt,
        );
    }
    raiseCreated(id: Id, ownerId: Id, title: Title, slug: Slug) {
        this.raise(
            new VendorCreatedEvent({ vendorId: id, ownerId: ownerId, title: title, slug: slug }),
        );
    }

    verifyVendor(actor: Id) {
        if (this._ownerId === actor) throw new BadRequestError('Cannot verify your own vendor');
        if (this._delete.isDeleted) throw new BadRequestError('Cannot verify an in active vendor');
        this._verification = this._verification.verify(EffectiveDate.today());
        this.raise(
            new VendorVerifiedEvent({
                vendorId: this._id,
                verificationInfo: this.verification,
            }),
        );
    }

    rejectVerification(actor: Id, reason: Reason) {
        if (this._ownerId === actor)
            throw new BadRequestError('Cannot reject your own vendor verification');
        this._verification = this._verification.reject(reason);
        this.raise(
            new VendorVerificationRejectedEvent({
                vendorId: this._id,
                rejectionInfo: this._verification,
            }),
        );
    }

    updateImage(logo: UrlVO, banner: UrlVO) {
        this._image = this._image.changeBanner(banner);
        this._image = this.image.changeLogo(logo);
    }

    updateContact(phone: PhoneNumber, email: EmailVO, address: AddressVO) {
        this._contact = this._contact.changePhone(phone);
        this._contact = this._contact.changeEmail(email);
        this._contact = this._contact.changeAddress(address);
    }

    updatedMeta(title: Title, slug: Slug, description: Description): void {
        this._title = Title.create(title.value);
        this._slug = Slug.create(slug.value);
        this._description = Description.create(description.value);
    }

    deleteVendor(actor: Id, reason: Reason): void {
        if (this._delete.isDeleted) throw new BadRequestError('Vendor already deleted');
        this._delete = DeleteInfoVO.create(actor, reason);
        this.raise(new VendorDeletedEvent({ vendorId: this._id, deletionInfo: this._delete }));
    }

    recoverVendor(actor: Id) {
        if (this._ownerId === actor) throw new BadRequestError('Cannot recover your own vendor');
        this._delete = DeleteInfoVO.none();
        this.raise(
            new VendorRecoverEvent({
                vendorId: this._id,
                performedBy: actor,
            }),
        );
    }
}
