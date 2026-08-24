

import { PhoneNumber } from "@clerk/backend";
import { AddressVO, EmailVO } from "../../../value-objects";

export class ContactInfoVO {
    private constructor(
        readonly phone: PhoneNumber,
        readonly email: EmailVO,
        readonly address: AddressVO,
    ) { }

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


}
