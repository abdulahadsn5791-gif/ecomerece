import { DeleteInfoVO } from "../../../core/domain/value-objects/delete-info.vo";
import { EffectiveDate } from "../../../core/domain/value-objects/effective-date.vo";
import { ExpirationDate } from "../../../core/domain/value-objects/expiration-date.vo";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { Money } from "../../../core/domain/value-objects/money.vo";
import { Quantity } from "../../../core/domain/value-objects/quantity.vo";
import { Reason } from "../../../core/domain/value-objects/reason.vo";
import { OrderItemsAggregate } from "../domain/order-items.aggregate";
import { OrderItemReadModel } from "../domain/read-models/order-items.read-model";
import { OrderItemResponseReadModel } from "../domain/read-models/order-items.response-read-model";
import { StatusVo } from "../domain/value-objects/status.vo";
import { OrderItemsPersistence } from "./order-item.model";

export const OrderItemsMapper = {

    persistenceToAggregate(doc: OrderItemsPersistence): OrderItemsAggregate {
        return OrderItemsAggregate.rehydrate(
            Id.rehydrate(doc._id),
            Id.rehydrate(doc.orderId),
            Id.rehydrate(doc.vendorId),
            Id.rehydrate(doc.variantId),
            Quantity.rehydrate(doc.quantity),
            ExpirationDate.rehydrate(doc.waitingTime),
            StatusVo.rehydrate(doc.status),
            Money.rehydrate(doc.totalPrice),
            Money.rehydrate(doc.price),
            DeleteInfoVO.rehydrate(
                doc.deleted.deletedBy ? Id.create(doc.deleted.deletedBy) : null,
                doc.deleted.deleted,
                doc.deleted.deletedFrom ? EffectiveDate.create(doc.deleted.deletedFrom) : null,
                doc.deleted.reason ? Reason.create(doc.deleted.reason) : null,
            ),

            Quantity.rehydrate(doc.version),
            EffectiveDate.rehydrate(doc.createdAt)
        );

    },
    aggregateToPersistence(items: OrderItemsAggregate) {
        return {
            _id: items.id.value,
            quantity: items.quantity.value,
            waitingTime: items.waitingTime.value,
            status: items.status.toStatusType(),
            totalPrice: items.totalPrice.value,
            price: items.price.value,
            orderId: items.orderId.value,
            vendorId: items.vendorId.value,
            variantId: items.variantId.value,
            version: items.version.value,
            deleted: {
                deleted: items.delete.deleted,
                deletedFrom: items.delete.from?.value ?? null,
                deletedBy: items.delete.performedBy?.value ?? null,
                reason: items.delete.reason?.value ?? null,
            },
            createdAt: items.createdAt.value,


        }
    },
    aggregateToReadModel(items: OrderItemsAggregate): OrderItemReadModel {
        return {
            _id: items.id.value,
            orderId: items.orderId.value,
            vendorId: items.vendorId.value,
            variantId: items.variantId.value,
            quantity: items.quantity.value,
            waitingTime: items.waitingTime.value,
            status: items.status.value,
            totalPrice: items.totalPrice.value,
            price: items.price.value,
            delete: {
                deleted: items.delete.deleted,
                deletedFrom: items.delete.from?.value ?? null,
                deletedBy: items.delete.performedBy?.value ?? null,
                reason: items.delete.reason?.value ?? null,
            },
            createdAt: items.createdAt.value,
        }
    }
    ,

    persistenceToReadModel(doc: OrderItemsPersistence): OrderItemReadModel {
        return {
            _id: doc._id,
            orderId: doc.orderId,
            vendorId: doc.vendorId,
            variantId: doc.variantId,
            quantity: doc.quantity,
            waitingTime: doc.waitingTime,
            status: doc.status,
            totalPrice: doc.totalPrice,
            price: doc.price,
            delete: {
                deleted: doc.deleted.deleted,
                deletedFrom: doc.deleted.deletedFrom ?? null,
                deletedBy: doc.deleted.deletedBy ?? null,
                reason: doc.deleted.reason ?? null,
            },
            createdAt: doc.createdAt,
        }
    },


    aggregateToResponseReadModel(items: OrderItemsAggregate): OrderItemResponseReadModel {
        return {
            _id: items.id.value,
            orderId: items.orderId.value,
            vendorId: items.vendorId.value,
            variantId: items.variantId.value,
            quantity: items.quantity.value,
            waitingTime: items.waitingTime.value,
            status: items.status.value,
            totalPrice: items.totalPrice.value,
            price: items.price.value,

            createdAt: items.createdAt.value,
        }
    }
}