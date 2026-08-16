import type { EmailVO } from '../../../../core/domain/value-objects/email.vo';
import type { PhoneNumber } from '../../../../core/domain/value-objects/phone-no.vo';
import type { AddressVO } from '../../../../core/domain/value-objects/street-address.vo';

export class ContactInfoVO {
    private constructor(
        readonly phone: PhoneNumber,
        readonly email: EmailVO,
        readonly address: AddressVO,
    ) {}

    static create(phone: PhoneNumber, email: EmailVO, address: AddressVO): ContactInfoVO {
        return new ContactInfoVO(phone, email, address);
    }

    static rehydrate(phone: PhoneNumber, email: EmailVO, address: AddressVO): ContactInfoVO {
        return new ContactInfoVO(phone, email, address);
    }

    changePhone(phone: PhoneNumber): ContactInfoVO {
        return new ContactInfoVO(phone, this.email, this.address);
    }

    changeEmail(email: EmailVO): ContactInfoVO {
        return new ContactInfoVO(this.phone, email, this.address);
    }

    changeAddress(address: AddressVO): ContactInfoVO {
        return new ContactInfoVO(this.phone, this.email, address);
    }

    equals(other: ContactInfoVO): boolean {
        return (
            this.phone.equals(other.phone) &&
            this.email.equals(other.email) &&
            this.address.equals(other.address)
        );
    }
}
