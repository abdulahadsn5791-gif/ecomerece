import { BaseService } from "../../../core/services/base.services";
import { InventoryReposityory } from "../infrastructure/inventory.repository";

export class InventoryInternalServcie extends BaseService {
    constructor(private readonly inventoryRepo: InventoryReposityory) { super(); }


    verifyInventroiesGetById() {

    }



}