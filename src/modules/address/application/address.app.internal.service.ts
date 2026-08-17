import { Id } from "../../../core/domain/value-objects/id.vo";
import { BaseService } from "../../../core/services/base.services";
import { AddressReadModel } from "../domain/read-models/address.read-models";
import { AddressMapper } from "../infrastructure/address.mapper";
import { AddressRepository } from "../infrastructure/address.repository";

export class AddressInternalService extends BaseService {
    constructor(private readonly addressRepo: AddressRepository) { super() }

    async ensureActiveAddressGetById(addressId: Id): Promise<{ address: AddressReadModel | null; active: boolean }> {
        const address = await this.addressRepo.FindById(addressId);
        if (!address) return { address: null, active: false };

        const AddressReadModel = AddressMapper.aggregateToReadModel(address);

        if (address.delete.isDeleted) return { address: AddressReadModel, active: false };

        return { address: AddressReadModel, active: true };
    }



}