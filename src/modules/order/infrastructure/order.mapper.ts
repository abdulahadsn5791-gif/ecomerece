import { DeleteInfoVO } from "../../../core/domain/value-objects/delete-info.vo";
import { EffectiveDate } from "../../../core/domain/value-objects/effective-date.vo";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { Quantity } from "../../../core/domain/value-objects/quantity.vo";
import { Reason } from "../../../core/domain/value-objects/reason.vo";
import { FullAddressVO } from "../../../core/domain/value-objects/street-address.vo";
import { OrderAggregate } from "../domain/order.aggregate";
import { OrderItem } from "../domain/value-objects/order-item.vo";
import { StatusVo } from "../domain/value-objects/status.vo";
import { OrderPersistence } from "./order.model";

export const OrderMapper = {

    persistenceToAggregate(doc: OrderPersistence): OrderAggregate {
        return OrderAggregate.rehydrate(
            Id.create(doc._id),
            Id.create(doc.buyerId),
            doc.items.map((value) => OrderItem.rehydrate(
                Id.rehydrate(value.variantId),
                Quantity.rehydrate(value.quantity),
                Quantity.rehydrate(value.unitPrice))),
            Quantity.rehydrate(doc.totalPrice),
            StatusVo.rehydrate(doc.status),
            FullAddressVO.create(doc.address),
            DeleteInfoVO.rehydrate(
                doc.deleted.deletedBy ? Id.create(doc.deleted.deletedBy) : null,
                doc.deleted.deleted,
                doc.deleted.deletedFrom ? EffectiveDate.create(doc.deleted.deletedFrom) : null,
                doc.deleted.reason ? Reason.create(doc.deleted.reason) : null,
            ),
            Quantity.rehydrate(doc.version),
            EffectiveDate.rehydrate(doc.createdAt)

        )
    },
    aggregateToPersistence(order: OrderAggregate): OrderPersistence {
        return {
            _id: order.id.value,
            version: order.version.value,
            buyerId: order.buyerId.value,
            totalPrice: order.totalPrice.value,
            status: order.status.toStatusType(),
            address: order.address.value,
            deleted: {
                deleted: order.delete.deleted,
                deletedFrom: order.delete.from?.value ?? null,
                deletedBy: order.delete.performedBy?.value ?? null,
                reason: order.delete.reason?.value ?? null,
            },
            items: order.items.map((value) -=),
            version: order.version.value,
            createdAt: order.createdAt.value,
            updatedAt: EffectiveDate.today().value,
        }
    }
