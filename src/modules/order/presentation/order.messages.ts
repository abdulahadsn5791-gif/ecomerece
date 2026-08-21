import { EffectiveDate } from '../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../core/domain/value-objects/id.vo';

import type { OrderResponseReadModel } from '../domain/read-models/order.response-read-model';

export type OrderMessagesType = {
    updatedData?: OrderResponseReadModel;
    message: string;
};

export const OrderMessages = {
    orderCreated(
        orderId: Id,
        actorId: Id,
        addressId: Id,
        updatedData: OrderResponseReadModel,
    ): OrderMessagesType {
        return {
            updatedData,
            message: `Order ${orderId.value} has been created by ${actorId.value} for addressId ${addressId.value} on ${EffectiveDate.today().value}`,
        };
    },
    orderDeleted(orderId: Id, actorId: Id, addressId: Id): OrderMessagesType {
        return {
            message: `Order ${orderId.value} has been deleted by ${actorId.value} for addressId ${addressId.value} on ${EffectiveDate.today().value}`,
        };
    },
};
