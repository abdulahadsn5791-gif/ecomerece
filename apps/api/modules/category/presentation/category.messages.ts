import { EffectiveDate, Id } from "@ecomerece/domain";
import { categoryResponseReadModels } from "@ecomerece/shared";

export type CategoryMessagesType = {
    updatedData?: categoryResponseReadModels;
    message: string;
};
export const CategoryMessags = {


    created(id: Id, actorId: Id): CategoryMessagesType {
        return {
            message: `Category ${id.value} has been created by ${actorId.value} on ${EffectiveDate.today().value}`
        }
    }




}