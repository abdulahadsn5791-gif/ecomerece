import { queryBus } from "../../core/domain/infrastructure/in-memory-query-bus";
import { AddressApplicationService } from "./application/address.app.service";
import { AddressRepository } from "./infrastructure/address.repository";
import { AddressController } from "./presentation/address.controller";

export function createAddressModule() {


    const addressRepo = new AddressRepository();

    const addressApplicationService = new AddressApplicationService(addressRepo, queryBus);
    const addressController = new AddressController(addressApplicationService);



    return { addressController }




}