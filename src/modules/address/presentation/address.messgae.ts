import { EffectiveDate } from "../../../core/domain/value-objects/effective-date.vo"
import { Id } from "../../../core/domain/value-objects/id.vo"
import { AddressResponseReadModel } from "../domain/read-models/address.response-read-models"

export type addressMessagesType = {
    updatedData?: AddressResponseReadModel,
    message: string
}
export const AddressMessages = {

    addressCreated(actorId: Id, addressId: Id, updatedData: AddressResponseReadModel) {
        return { updatedData, message: `Address ${addressId.value} has been created by ${actorId.value} on ${EffectiveDate.today().value}` }
    },
    addressDeleted(actorId: Id, addressId: Id): addressMessagesType {
        return { message: `Address ${addressId.value} has been deleted by ${actorId.value} on ${EffectiveDate.today().value}` }
    },
    addressRecovered(actorId: Id, addressId: Id, updatedData: AddressResponseReadModel): addressMessagesType {
        return { updatedData, message: `Address ${addressId.value} has been recovered by ${actorId.value} on ${EffectiveDate.today().value}` }
    },
    defaultAddress(actorId: Id, addressId: Id, updatedData: AddressResponseReadModel): addressMessagesType {
        return { updatedData, message: `Address ${addressId.value} has been setted as default by ${actorId.value} on ${EffectiveDate.today().value}` }
    }
}