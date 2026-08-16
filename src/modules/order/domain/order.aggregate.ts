import { AggregateRoot } from '../../../core/domain/aggregate-root';
import { DeleteInfoVO } from '../../../core/domain/value-objects/delete-info.vo';
import { EffectiveDate } from '../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../core/domain/value-objects/id.vo';
import { Quantity } from '../../../core/domain/value-objects/quantity.vo';
import { Reason } from '../../../core/domain/value-objects/reason.vo';
import type { FullAddressVO } from '../../../core/domain/value-objects/street-address.vo';
import { OrderCancelledEvent } from './events/order-cancelled.event';
import { OrderCompletedEvent } from './events/order-completed.event';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderRefundedEvent } from './events/order-refunded.event';
import { OrderReturnedEvent } from './events/order-returned.event';
import { StatusVo } from './value-objects/status.vo';

export type createOrderPros = {
    id: Id;
    variantId: Id;
    buyerId: Id;
    price: Quantity;
    status: StatusVo;
    address: FullAddressVO;
};

export class OrderAggregate extends AggregateRoot {
    constructor(
        private readonly _id: Id,
        private readonly _variantId: Id,
        private readonly _buyerId: Id,
        private _price: Quantity,
        private _status: StatusVo,
        private _address: FullAddressVO,
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
    get buyerId() {
        return this._buyerId;
    }
    get price() {
        return this._price;
    }
    get status() {
        return this._status;
    }
    get address() {
        return this._address;
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

    create(data: createOrderPros): OrderAggregate {
        this.raise(new OrderCreatedEvent({ orderId: data.id, actorId: data.buyerId }))
        return new OrderAggregate(
            data.id,
            data.variantId,
            data.buyerId,
            data.price,
            data.status,
            data.address,
            DeleteInfoVO.none(),
            Quantity.none(),

            EffectiveDate.today(),
        );

    }

    rehydrate(
        _id: Id,
        _variantId: Id,
        _buyerId: Id,
        _price: Quantity,
        _status: StatusVo,
        _address: FullAddressVO,
        _delete: DeleteInfoVO,
        _version: Quantity,
        _createdAt: EffectiveDate,
    ): OrderAggregate {
        return new OrderAggregate(
            _id,
            _variantId,
            _buyerId,
            _price,
            _status,
            _address,
            _delete,
            _version,
            _createdAt,
        );
    }

    cancelOrder(actorId: Id, reason: Reason) {
        this.raise(new OrderCancelledEvent({ orderId: this._id, actorId: actorId, reason: reason }));
    }
    confirmOrder(actorId: Id) {
        this.raise(new OrderCo)
    }
    returnOrder(actorId: Id, reason: Reason) {
        this.raise(new OrderReturnedEvent({ orderId: this._id, actorId: actorId, reason: reason }))
    }
    refundOrder(actorId: Id, reason: Reason) {
        this.raise(new OrderRefundedEvent({ orderId: this._id, actorId: actorId, reason: reason }))
    }
    completeOrder(actroId: Id) {
        this.raise(new OrderCompletedEvent({ orderId: this._id, actorId: actorId, reason: reason }))
    }
}

