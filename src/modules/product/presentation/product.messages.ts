import { EffectiveDate } from "../../../core/domain/value-objects/effective-date.vo";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { Quantity } from "../../../core/domain/value-objects/quantity.vo";
import { Reason } from "../../../core/domain/value-objects/reason.vo";
export type productMessagesType = {
    message: string
}
export const productMessages = {

    productCreated(productId: Id, actorId: Id): productMessagesType {
        return { message: `Product with id ${productId} has been created by ${actorId} on ${EffectiveDate.today().value}` }
    },
    productUpdated(productId: Id, actorId: Id): productMessagesType {
        return { message: `Product with id ${productId} has been updated by ${actorId} on ${EffectiveDate.today().value}` }
    },
    productDeleted(productId: Id, actorId: Id, reason: Reason): productMessagesType {
        return { message: `Product wiht id ${productId} has been deleted by ${actorId} due to reason : ${reason} on ${EffectiveDate.today().value}` }
    },
    productBlocked(productId: Id, actorId: Id, reason: Reason): productMessagesType {
        return { message: `Product with id ${productId} has been blocked by ${actorId} due to reason : ${reason} on ${EffectiveDate.today().value}` }
    },
    productUnBlocked(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} has been un-blocked by ${actorId}  ${EffectiveDate.today().value}` }
    },

    productRecovered(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} has been recovered by ${actorId} on ${EffectiveDate.today().value}` }
    },
    productPublic(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} has been become public by ${actorId} on ${EffectiveDate.today().value}` }
    },
    productPrivate(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} has been become private by ${actorId} on ${EffectiveDate.today().value}` }
    },
    metaUpdated(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} meta has been updated meta by ${actorId} on ${EffectiveDate.today().value}` }
    },
    disclaimerEnabled(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} desclaimer has been enabled by ${actorId} on ${EffectiveDate.today().value}` }
    },
    disclaimerDisabled(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} desclaimer has been disabled by ${actorId} on ${EffectiveDate.today().value}` }
    },
    disclaimerUpdated(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} desclaimer has been updated by ${actorId} on ${EffectiveDate.today().value}` }
    },
    imageUpdated(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} image has been updated by ${actorId} on ${EffectiveDate.today().value} ` }
    },
    imageDefault(index: Quantity, productId: Id, actorId: Id): productMessagesType {
        return { message: `Product with id ${productId} has set deafult image of no ${index.increase(1).value} by ${actorId} on ${EffectiveDate.today().value}` }
    },
    ingredientsEnabled(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} ingrediants has been enabled by ${actorId} on ${EffectiveDate.today().value}` }
    },
    ingredientsDisabled(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} ingrediants has been disabled by ${actorId} on ${EffectiveDate.today().value}` }
    },
    ingredientsUpdated(productId: Id, actorId: Id,): productMessagesType {
        return { message: `Product with id ${productId} ingrediants has been updated by ${actorId} on ${EffectiveDate.today().value}` }
    },

}




