import { BadRequestError } from "../../../../apps/api/errors/app-error";
import { AggregateRoot } from "../../aggregate-root";
import { DeleteInfoVO, EffectiveDate, Id, Quantity, Reason } from "../../value-objects";


type createInventoryProps = {
    id: Id;
    variantId: Id;
    lowStockThreshold: Quantity;
    available: Quantity;
};

export class InventoryAggregate extends AggregateRoot {
    constructor(
        private readonly _id: Id,
        private readonly _variantId: Id,
        private _available: Quantity,
        private _reserved: Quantity,
        private _lowStockThreshold: Quantity,
        private _delete: DeleteInfoVO,
        private readonly _version: Quantity,
        private readonly _createdAt: EffectiveDate,
    ) {
        super();
    }

    get id() {
        return this._id;
    }
    get variantId() {
        return this._variantId;
    }
    get available() {
        return this._available;
    }
    get reserved() {
        return this._reserved;
    }
    get lowStockThreshold() {
        return this._lowStockThreshold;
    }
    get version() {
        return this._version;
    }
    get delete() {
        return this._delete;
    }
    get createdAt() {
        return this._createdAt;
    }

    static create(data: createInventoryProps): InventoryAggregate {
        return new InventoryAggregate(
            data.id,
            data.variantId,
            data.available,

            Quantity.none(),
            data.lowStockThreshold,
            DeleteInfoVO.none(),
            Quantity.none(),
            EffectiveDate.today(),
        );
    }

    static rehydrate(
        _id: Id,
        _variantId: Id,
        _available: Quantity,
        _reserved: Quantity,

        _lowStockThreshold: Quantity,
        _delete: DeleteInfoVO,
        _version: Quantity,
        _createdAt: EffectiveDate,
    ): InventoryAggregate {
        return new InventoryAggregate(
            _id,
            _variantId,
            _available,
            _reserved,

            _lowStockThreshold,
            _delete,
            _version,
            _createdAt,
        );
    }

    reserve(quantity: Quantity, actorId: Id) {
        this._reserved = this._reserved.increase(quantity.value);
        this._available = this._available.decrease(quantity.value);
    }

    complete(quantity: Quantity, actorId: Id) {
        this._reserved = this._reserved.decrease(quantity.value);
    }

    buy(quantity: Quantity, actorId: Id) {
        this._available = this._available.increase(quantity.value);
    }
    updateLowStockThreshold(quantity: Quantity, actorId: Id) {
        this._lowStockThreshold = quantity;
    }
    removeStock(quantity: Quantity, actorId: Id) {
        this._available = this._available.decrease(quantity.value);
    }
    deleteInventory(reason: Reason, actorId: Id) {
        if (!this._available.isZero)
            throw new BadRequestError('First clear the available stocks  to continue');
        if (!this._reserved.isZero)
            throw new BadRequestError('First clear the reserve stocks to continue');
        this._delete = DeleteInfoVO.create(actorId, reason);
    }
}
