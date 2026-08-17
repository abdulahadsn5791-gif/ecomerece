import { AggregateRoot } from '../../../core/domain/aggregate-root';
import { DeleteInfoVO } from '../../../core/domain/value-objects/delete-info.vo';
import { EffectiveDate } from '../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../core/domain/value-objects/id.vo';
import { Quantity } from '../../../core/domain/value-objects/quantity.vo';
import { Reason } from '../../../core/domain/value-objects/reason.vo';
import type { FullAddressVO } from '../../../core/domain/value-objects/street-address.vo';
import { OrderCancelledEvent } from './events/order-cancelled.event';
import { OrderCompletedEvent } from './events/order-completed.event';
import { OrderConfirmedEvent } from './events/order-confirm.event';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderRefundedEvent } from './events/order-refunded.event';
import { OrderReturnedEvent } from './events/order-returned.event';
import { OrderItem } from './value-objects/order-item.vo';
import { StatusVo } from './value-objects/status.vo';

export type createOrderPros = {
    id: Id;
    idempotentKey: Id,
    items: OrderItem[];
    buyerId: Id;
    address: FullAddressVO;
};

export class OrderAggregate extends AggregateRoot {
    constructor(
        private readonly _idempotentKey: Id,
        private readonly _id: Id,
        private readonly _buyerId: Id,
        private _items: OrderItem[],
        private _totalPrice: Quantity,
        private _status: StatusVo,
        private _address: FullAddressVO,
        private _delete: DeleteInfoVO,
        private readonly _version: Quantity,
        private readonly _createdAt: EffectiveDate,
    ) {
        super();
    }
    get idempotentKey() { return this._idempotentKey; }
    get id() { return this._id; }
    get buyerId() { return this._buyerId; }
    get items() { return this._items; }
    get totalPrice() { return this._totalPrice; }
    get status() { return this._status; }
    get address() { return this._address; }
    get delete() { return this._delete; }
    get version() { return this._version; }
    get createdAt() { return this._createdAt; }

    static create(data: createOrderPros): OrderAggregate {
        const total = data.items.reduce(
            (sum, item) => new Quantity(sum.value + item.totalPrice.value),
            new Quantity(0)
        );


        return new OrderAggregate(
            data.idempotentKey,
            data.id,
            data.buyerId,
            data.items,
            total,
            StatusVo.pending(),
            data.address,
            DeleteInfoVO.none(),
            Quantity.none(),
            EffectiveDate.today(),
        );

    }

    static rehydrate(
        _idempotentKey: Id,
        _id: Id,
        _buyerId: Id,
        _items: OrderItem[],
        _totalPrice: Quantity,
        _status: StatusVo,
        _address: FullAddressVO,
        _delete: DeleteInfoVO,
        _version: Quantity,
        _createdAt: EffectiveDate,
    ): OrderAggregate {
        return new OrderAggregate(
            _idempotentKey,
            _id,
            _buyerId,
            _items,
            _totalPrice,
            _status,
            _address,
            _delete,
            _version,
            _createdAt,
        );
    }
    createOrder() {
        this.raise(new OrderCreatedEvent({ orderId: this.id, actorId: this.buyerId }))
    }
    cancelOrder(actorId: Id, reason: Reason) {
        this._status = this._status.cancel();
        this.raise(new OrderCancelledEvent({ orderId: this._id, actorId, reason }));
    }

    confirmOrder(actorId: Id) {
        this._status = this._status.confirm();
        this.raise(new OrderConfirmedEvent({ orderId: this._id, actorId }));
    }

    returnOrder(actorId: Id, reason: Reason) {
        this._status = this._status.return();
        this.raise(new OrderReturnedEvent({ orderId: this._id, actorId, reason }));
    }

    refundOrder(actorId: Id, reason: Reason) {
        this._status = this._status.refund();
        this.raise(new OrderRefundedEvent({ orderId: this._id, actorId, reason }));
    }

    completeOrder(actorId: Id) {
        this._status = this._status.complete();
        this.raise(new OrderCompletedEvent({ orderId: this._id, actorId }));
    }
}
