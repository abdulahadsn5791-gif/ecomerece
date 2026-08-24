
import { AggregateRoot } from "../../aggregate-root";
import { DeleteInfoVO, EffectiveDate, ExpirationDate, Id, Money, Quantity } from "../../value-objects";
import { StatusVo } from "./value-objects/status.vo";

export type cretaeOrderProps = {
    id: Id,
    orderId: Id,
    vendorId: Id,
    variantId: Id,
    quantity: Quantity,
    waitingTime: ExpirationDate,
    price: Money
}

export class OrderItemsAggregate extends AggregateRoot {
    constructor(
        private readonly _id: Id,
        private readonly _orderId: Id,
        private readonly _vendorId: Id,
        private readonly _variantId: Id,
        private _quantity: Quantity,
        private _waitingTime: ExpirationDate,
        private _status: StatusVo,
        private _totalPrice: Money,
        private _price: Money,
        private _delete: DeleteInfoVO,
        private readonly _version: Quantity,
        private readonly _createdAt: EffectiveDate,


    ) { super(); }

    get id() { return this._id }
    get orderId() { return this._orderId; }
    get vendorId() { return this._vendorId; }
    get variantId() { return this._variantId }
    get quantity() { return this._quantity; }
    get waitingTime() { return this._waitingTime; }
    get status() { return this._status; }
    get totalPrice() { return this._totalPrice; }
    get price() { return this._price; }
    get delete() { return this._delete; }
    get version() { return this._version; }
    get createdAt() { return this._createdAt; }



    static create(props: cretaeOrderProps): OrderItemsAggregate {
        const totalPrice = Money.create(props.quantity.value * props.price.value);
        return new OrderItemsAggregate(
            props.id,
            props.orderId,
            props.vendorId,
            props.variantId,
            props.quantity,
            props.waitingTime,
            StatusVo.pending(),
            totalPrice,
            props.price,
            DeleteInfoVO.none(),
            Quantity.create(1),
            EffectiveDate.today()
        )
    }

    static rehydrate(
        _id: Id,
        _orderId: Id,
        _vendorId: Id,
        _variantId: Id,
        _quantity: Quantity,
        _waitingTime: ExpirationDate,
        _status: StatusVo,
        _totalPrice: Money,
        _price: Money,
        _delete: DeleteInfoVO,
        _version: Quantity,
        _createdAt: EffectiveDate,) {
        return new OrderItemsAggregate(
            _id,
            _orderId,
            _vendorId,
            _variantId,
            _quantity,
            _waitingTime,
            _status,
            _totalPrice,
            _price,
            _delete,
            _version,
            _createdAt,)
    }









}