import { EffectiveDate } from '@ecomerece/domain/value-objects/effective-date.vo';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { OrderResponseReadModel } from '@ecomerece/shared';

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
