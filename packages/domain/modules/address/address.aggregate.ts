import { BadRequestError } from "../../../../apps/api/errors/app-error";
import { AggregateRoot } from "../../aggregate-root";
import { AddressVO, CityVO, CountryVO, DeleteInfoVO, EffectiveDate, FullAddressVO, Id, PostalCodeVO, Quantity, Reason, StateVO, StreetAddressVO } from "../../value-objects";



export type createAddressProps = {
    _id: Id;
    _ownerId: Id;
    _streetAddress: StreetAddressVO;

    _city: CityVO;
    _state: StateVO;
    _postalCode: PostalCodeVO;
    _country: CountryVO;
};

export class AddressAggregate extends AggregateRoot {
    constructor(
        private readonly _id: Id,
        private readonly _ownerId: Id,
        private _defaultDate: EffectiveDate | null,
        private _address: AddressVO,
        private _delete: DeleteInfoVO,
        private _version: Quantity,
        private readonly _createdAt: EffectiveDate,
    ) {
        super();
    }

    get defaultDate() {
        return this._defaultDate;
    }
    get id() {
        return this._id;
    }
    get ownerId() {
        return this._ownerId;
    }
    get streetAddress() {
        return this._address.streetAddress;
    }
    get city() {
        return this._address.city;
    }
    get state() {
        return this._address.state;
    }
    get postalCode() {
        return this._address.postalCode;
    }
    get country() {
        return this._address.country;
    }
    get delete() {
        return this._delete;
    }
    get version() {
        return this._version;
    }
    get createdAt() {
        return this._createdAt;
    }
    get fullAddress(): FullAddressVO {
        return this._address.fullAddress;
    }

    static create(data: createAddressProps): AddressAggregate {
        return new AddressAggregate(
            data._id,
            data._ownerId,
            null,
            AddressVO.create(
                data._streetAddress,
                data._city,
                data._state,
                data._postalCode,
                data._country,
            ),
            DeleteInfoVO.none(),
            Quantity.none(),
            EffectiveDate.today(),
        );
    }

    static rehydrate(
        _id: Id,
        _ownerId: Id,
        _defaultDate: EffectiveDate | null,
        _address: AddressVO,
        _delete: DeleteInfoVO,
        _version: Quantity,
        _createdAt: EffectiveDate,
    ): AddressAggregate {
        return new AddressAggregate(
            _id,
            _ownerId,
            _defaultDate,
            _address,
            _delete,
            _version,
            _createdAt,
        );
    }

    updateAddress(data: AddressVO, actorId: Id) {
        this._address = data;
    }
    deleteAddress(reason: Reason, actorId: Id) {
        if (this._delete.isDeleted) throw new BadRequestError('Address was already removed');
        this._delete = DeleteInfoVO.create(actorId, reason);
    }
    recoverAddress(actorId: Id) {
        if (!this._delete.isDeleted) throw new BadRequestError('Address was already recovered');
        this._delete = DeleteInfoVO.none();
    }
    setAsDefault() {
        this._defaultDate = EffectiveDate.today();
    }

    toString(): string {
        return this.fullAddress.toString();
    }
}
