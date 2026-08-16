import { Context } from "hono";
import { BaseController } from "../../../core/controller/base.controller";
import { InventoryApplicationService } from "../application/inventory.app.service";
import { createMyInventoryDto } from "./dto/create-inventory.dto";
import { idSchema } from "../../../../shared/dtos/id-schema";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { buyMyInventoryStockDto } from "./dto/buy-inventory.dto";
import { updateMylowStockThresholdDto } from "./dto/lowStockThreshold-inventory.dto";
import { removeMyInventoryStockDto } from "./dto/drop-inventory.dto";

export class InventoryController extends BaseController<InventoryApplicationService> {


    createMyInventory = async (c: Context) => {
        const data = await this.body(c, createMyInventoryDto);
        const actor = c.get('user');
        return this.ok(c, await this.service.createMyInventory(data, actor))
    }
    buyMyInventory = async (c: Context) => {
        const data = await this.body(c, buyMyInventoryStockDto);
        const actor = c.get('user');
        const inventoryId = this.param(c, 'id', idSchema);
        return this.ok(c, await this.service.buyMyInventoryStock(data, inventoryId, actor));

    }
    updateMylowStockThreshold = async (c: Context) => {
        const data = await this.body(c, updateMylowStockThresholdDto);
        const actor = c.get('user');
        const inventoryId = this.param(c, 'id', idSchema);
        return this.ok(c, await this.service.updateMylowStockThreshold(data, inventoryId, actor));
    }
    removeMyInventoryStock = async (c: Context) => {
        const data = await this.body(c, removeMyInventoryStockDto);
        const actor = c.get('user');
        const inventoryId = this.param(c, 'id', idSchema);
        return this.ok(c, await this.service.removeMyInventoryStock(data, inventoryId, actor));
    }
    getInventoryByVarientId = async (c: Context) => {
        const id = this.param(c, 'id', idSchema);

        return this.ok(c, await this.service.getInventoryByVarientId(id))
    }
}