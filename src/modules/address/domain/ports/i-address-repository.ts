import { Id } from "../../../../core/domain/value-objects/id.vo";
import { AddressAggregate } from "../address.aggregate";

export interface IAddressRepository {
    FindById(id: Id): Promise<AddressAggregate | null>;
    FindByIdOrThrow(id: Id): Promise<AddressAggregate>;
    FindByOwnerId(id: Id): Promise<AddressAggregate[] | null>;
    Create(user: AddressAggregate): Promise<void>;
    Save(user: AddressAggregate): Promise<void>;
    Delete(id: Id): Promise<void>;
    Exists(id: Id): Promise<boolean>;
}