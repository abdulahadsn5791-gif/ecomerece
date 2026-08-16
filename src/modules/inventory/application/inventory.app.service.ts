import { idType } from "../../../../shared/dtos/id-schema";
import { InMemoryQueryBus } from "../../../core/domain/infrastructure/in-memory-query-bus";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { Quantity } from "../../../core/domain/value-objects/quantity.vo";
import { BaseService } from "../../../core/services/base.services";
import { BadRequestError } from "../../../errors/app-error";
import { EnsureActiveVariantGetByIdQuery } from "../../product-variant/application/queries/ensure-active-variant-get-by-id.query";
import { EnsureActiveProductGetByIdQuery } from "../../product/application/queries/ensure-active-product-get-by-id.query";
import { EnsureActiveUserGetByIdQuery } from "../../user/application/queries/ensure-active-user-get-by-id.query";
import { UserPersistence } from "../../user/infrastructure/user.models";
import { EnsureActiveVendorGetByIdQuery } from "../../vendor/application/queries/ensure-active-vendor-get-by-id.query";
import { InventoryAggregate } from "../domain/inventory.aggregate";
import { InventoryResponseReadModel } from "../domain/read-models/inventory.response-read-model";
import { InventoryMapper } from "../infrastructure/inventory.mapper";
import { InventoryReposityory } from "../infrastructure/inventory.repository";
import { buyMyInventoryStockDtoType } from "../presentation/dto/buy-inventory.dto";
import { createMyInventoryDtoType } from "../presentation/dto/create-inventory.dto";
import { removeMyInventoryStockDtoType } from "../presentation/dto/drop-inventory.dto";
import { updateMylowStockThresholdDtoType } from "../presentation/dto/lowStockThreshold-inventory.dto";
import { InventoryMessages, inventoryMessagesType } from "../presentation/inventory.messages";

export class InventoryApplicationService extends BaseService {
    constructor(private readonly inventoryRepo: InventoryReposityory,
        private readonly queryBus: InMemoryQueryBus
    ) { super(); }

    async canActorEditInventory(variantId: Id, actorId: Id): Promise<void> {
        const activeVariant = await this.queryBus.execute(new EnsureActiveVariantGetByIdQuery({ variantId: variantId }));
        if (!activeVariant.variant) throw new BadRequestError("Variant is not found");
        if (!activeVariant.active) throw new BadRequestError("Variant is not active");
        const productId = Id.create(activeVariant.variant.productId);
        const activeProduct = await this.queryBus.execute(new EnsureActiveProductGetByIdQuery({ productId: productId }));
        if (!activeProduct.product) throw new BadRequestError("Product not found");
        if (!activeProduct.active) throw new BadRequestError("Product is not active");
        const vendorId = Id.create(activeProduct.product.vendorId);
        const activeVendor = await this.queryBus.execute(new EnsureActiveVendorGetByIdQuery({ vendorId: vendorId }));
        if (!activeVendor.vendor) throw new BadRequestError("Vendor not found");
        if (!activeVendor.active) throw new BadRequestError("Vendor is not active");
        if (activeVendor.vendor.ownerId !== actorId.value) throw new BadRequestError("Owner don`t that variant");
        const userId = Id.create(activeVendor.vendor.ownerId);
        const activeUser = await this.queryBus.execute(new EnsureActiveUserGetByIdQuery({ userId: userId }));
        if (!activeUser.user) throw new BadRequestError("User is not found");
        if (!activeUser.active) throw new BadRequestError("User is not active");
    }

    async createMyInventory(data: createMyInventoryDtoType, actor: UserPersistence): Promise<inventoryMessagesType> {
        const inventoryId = Id.create();
        const actorId = Id.create(actor._id);
        const variantId = Id.create(data.variantId);
        const lowStockThreshold = Quantity.create(data.lowStockThreshold);
        const available = Quantity.create(data.available);
        await this.canActorEditInventory(variantId, actorId);
        const inventory = InventoryAggregate.create({ id: inventoryId, variantId, lowStockThreshold, available });
        await this.inventoryRepo.Create(inventory);
        const inventoryReaponseReadModel = InventoryMapper.aggregateToResponseReadModel(inventory);
        return InventoryMessages.inventoryCreated(inventoryId, actorId, inventoryReaponseReadModel);
    }

    async buyMyInventoryStock(data: buyMyInventoryStockDtoType, id: idType, actor: UserPersistence): Promise<inventoryMessagesType> {
        const inventoryId = Id.create(id);
        const actorId = Id.create(actor._id);
        const quantity = Quantity.create(data.quantity);
        const inventory = await this.inventoryRepo.FindByIdOrThrow(inventoryId);
        await this.canActorEditInventory(inventory.variantId, actorId);
        inventory.buy(quantity, actorId);
        await this.inventoryRepo.Save(inventory);
        const inventoryReaponseReadModel = InventoryMapper.aggregateToResponseReadModel(inventory);
        return InventoryMessages.inventoryBought(inventoryId, quantity, actorId, inventoryReaponseReadModel);

    }
    async removeMyInventoryStock(data: removeMyInventoryStockDtoType, id: idType, actor: UserPersistence): Promise<inventoryMessagesType> {
        const inventoryId = Id.create(id);
        const actorId = Id.create(actor._id);
        const quantity = Quantity.create(data.quantity);
        const inventory = await this.inventoryRepo.FindByIdOrThrow(inventoryId);
        await this.canActorEditInventory(inventory.variantId, actorId);
        inventory.removeStock(quantity, actorId);
        await this.inventoryRepo.Save(inventory);
        const inventoryReaponseReadModel = InventoryMapper.aggregateToResponseReadModel(inventory);
        return InventoryMessages.inventoryRemoved(inventoryId, quantity, actorId, inventoryReaponseReadModel);
    }

    async updateMylowStockThreshold(data: updateMylowStockThresholdDtoType, id: idType, actor: UserPersistence): Promise<inventoryMessagesType> {
        const inventoryId = Id.create(id);
        const actorId = Id.create(actor._id);
        const lowStockThreshold = Quantity.create(data.lowStockThreshold);
        const inventory = await this.inventoryRepo.FindByIdOrThrow(inventoryId);
        await this.canActorEditInventory(inventory.variantId, actorId);
        inventory.updateLowStockThreshold(lowStockThreshold, actorId);
        await this.inventoryRepo.Save(inventory);
        const inventoryReaponseReadModel = InventoryMapper.aggregateToResponseReadModel(inventory);
        return InventoryMessages.lowStockThresholdUpdated(inventoryId, lowStockThreshold, actorId, inventoryReaponseReadModel);

    }

    async getInventoryByVarientId(id: string): Promise<InventoryResponseReadModel> {
        const variantId = Id.create(id);
        const varinat = await this.inventoryRepo.FindByVariantIdOrThrow(variantId);
        return InventoryMapper.aggregateToResponseReadModel(varinat);
    }


}
