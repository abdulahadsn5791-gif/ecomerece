import { EffectiveDate } from '@ecomerece/domain/value-objects/effective-date.vo';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { Money } from '@ecomerece/domain/value-objects/money.vo';
export type ProductVaraintMessagesType = { message: string };
export const productVaraintMessages = {
    varaintCreated(variantId: Id, productId: Id, actorId: Id): ProductVaraintMessagesType {
        return {
            message: `Varaint with id ${variantId} has been created for product ${productId} by ${actorId} on ${EffectiveDate.today().value}`,
        };
    },
    priceUpdated(
        price: Money,
        discountedPrice: Money,
        actorId: Id,
        variantId: Id,
    ): ProductVaraintMessagesType {
        return {
            message: `Varaint with id ${variantId.value} has updated its price ${price.value} and discounted price ${discountedPrice.value} by ${actorId.value} on ${EffectiveDate.today().value}`,
        };
    },
    metaUpdated(variantId: Id, actorId: Id): ProductVaraintMessagesType {
        return {
            message: `Varaint with id ${variantId.value} has updated its meta  by ${actorId.value} on ${EffectiveDate.today().value}`,
        };
    },
    variantDisabled(variantId: Id, actorId: Id): ProductVaraintMessagesType {
        return {
            message: `Variant with id ${variantId.value} has been disabled by ${actorId} on ${EffectiveDate.today().value}`,
        };
    },
    variantActivated(variantId: Id, actorId: Id): ProductVaraintMessagesType {
        return {
            message: `Variant with id ${variantId.value} has been activated by ${actorId} on ${EffectiveDate.today().value}`,
        };
    },
    variantDeleted(variantId: Id, actorId: Id): ProductVaraintMessagesType {
        return {
            message: `Variant with id ${variantId.value} has been deleted by ${actorId} on ${EffectiveDate.today().value}`,
        };
    },
    variantRecovered(variantId: Id, actorId: Id): ProductVaraintMessagesType {
        return {
            message: `Variant with id ${variantId.value} has been recovered by ${actorId} on ${EffectiveDate.today().value}`,
        };
    },
};
