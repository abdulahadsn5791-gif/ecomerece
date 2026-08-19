import { InMemoryEventBus } from "../../../core/domain/infrastructure/in-memory-event-bus";
import { InMemoryQueryBus } from "../../../core/domain/infrastructure/in-memory-query-bus";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { Quantity } from "../../../core/domain/value-objects/quantity.vo";
import { FullAddressVO } from "../../../core/domain/value-objects/street-address.vo";
import { BaseService } from "../../../core/services/base.services";
import { BadRequestError } from "../../../errors/app-error";
import { EnsureActiveAddressGetByIdQuery } from "../../address/application/queries/ensure-active-address-get-by-it.query";
import { AddressPersistence } from "../../address/infrastructure/address.models";
import { VerifyVariantsAndGetQuery } from "../../product-variant/application/queries/verify-variants-and-get.query";
import { ProductVariantReadModel } from "../../product-variant/domain/read-models/product-variant.read-model";
import { VerifyProductAndGetQuery } from "../../product/application/queries/verify-product-and-get.query";
import { ProductReadModel } from "../../product/domain/read-models/product.read-model";
import { EnsureActiveUserGetByIdQuery } from "../../user/application/queries/ensure-active-user-get-by-id.query";
import { VerifyUserAndGetQuery } from "../../user/application/queries/verify-user-and-get.query";
import { UserReadModel } from "../../user/domain/read-models/user.read-model";
import { UserPersistence } from "../../user/infrastructure/user.models";
import { VerifyVendorAndGetQuery } from "../../vendor/application/queries/verify-vendor-and-get.query";
import { VendorReadModel } from "../../vendor/domain/read-models/vendor-read-model";
import { OrderAggregate } from "../domain/order.aggregate";
import { OrderItem } from "../domain/value-objects/order-item.vo";
import { OrderMapper } from "../infrastructure/order.mapper";
import { OrderRepository } from "../infrastructure/order.repository";
import { createMyOrderDtoType } from "../presentation/dto/create-order.dto";
import { OrderMessages } from "../presentation/order.messages";




export class OrderApplicationService extends BaseService {

    constructor(private readonly orderRepo: OrderRepository,
        private readonly queryBus: InMemoryQueryBus,
        private readonly eventBus: InMemoryEventBus
    ) { super() }

    getReport(
        variants: { validIds: Id[]; invalidIds: Id[]; variantReadModel: ProductVariantReadModel[] },
        products: { validIds: Id[]; invalidIds: Id[]; products: ProductReadModel[] },
        vendors: { validIds: Id[]; invalidIds: Id[]; vendorReadModel: VendorReadModel[] },
        owners: { validIds: Id[]; invalidIds: Id[]; usersReadModel: UserReadModel[] }
    ) {
        // 1. Convert invalid IDs to their string values (Sets of strings)
        const invalidVariants = new Set(variants.invalidIds.map(id => id.value));
        const invalidProducts = new Set(products.invalidIds.map(id => id.value));
        const invalidVendors = new Set(vendors.invalidIds.map(id => id.value));
        const invalidOwners = new Set(owners.invalidIds.map(id => id.value));

        // 2. Build parent → child relationships using Maps with string keys
        const productToVariants = new Map<string, string[]>();
        for (const v of variants.variantReadModel) {
            const key = Id.create(v.productId).value;
            const list = productToVariants.get(key) || [];
            list.push(Id.create(v.id).value);
            productToVariants.set(key, list);
        }

        const vendorToProducts = new Map<string, string[]>();
        for (const p of products.products) {
            const key = Id.create(p.vendorId).value;
            const list = vendorToProducts.get(key) || [];
            list.push(Id.create(p.id).value);
            vendorToProducts.set(key, list);
        }

        const ownerToVendors = new Map<string, string[]>();
        for (const v of vendors.vendorReadModel) {
            const key = Id.create(v.ownerId).value;
            const list = ownerToVendors.get(key) || [];
            list.push(Id.create(v.id).value);
            ownerToVendors.set(key, list);
        }

        // 3. Propagate invalidity top‑down (owner → vendor → product → variant)
        for (const ownerId of invalidOwners) {
            const vendorsList = ownerToVendors.get(ownerId) || [];
            for (const vid of vendorsList) invalidVendors.add(vid);
        }
        for (const vendorId of invalidVendors) {
            const productsList = vendorToProducts.get(vendorId) || [];
            for (const pid of productsList) invalidProducts.add(pid);
        }
        for (const productId of invalidProducts) {
            const variantsList = productToVariants.get(productId) || [];
            for (const vid of variantsList) invalidVariants.add(vid);
        }

        // 4. Quick lookup Maps for product / vendor details (string keys)
        const productMap = new Map<string, ProductReadModel>();
        for (const p of products.products) {
            productMap.set(Id.create(p.id).value, p);
        }

        const vendorMap = new Map<string, VendorReadModel>();
        for (const v of vendors.vendorReadModel) {
            vendorMap.set(Id.create(v.id).value, v);
        }

        // 5. Generate report for each variant
        const report = [];
        for (const v of variants.variantReadModel) {
            let reason: string | null = null;
            const vid = Id.create(v.id).value;
            const pid = Id.create(v.productId).value;

            if (invalidVariants.has(vid)) {
                reason = 'variant';
            } else {
                const product = productMap.get(pid);
                if (!product || invalidProducts.has(Id.create(product.id).value)) {
                    reason = 'product';
                } else {
                    const vendor = vendorMap.get(Id.create(product.vendorId).value);
                    if (!vendor || invalidVendors.has(Id.create(vendor.id).value)) {
                        reason = 'vendor';
                    } else if (invalidOwners.has(Id.create(vendor.ownerId).value)) {
                        reason = 'owner';
                    }
                }
            }

            report.push({
                id: v.id,
                productId: v.productId,
                valid: reason === null,
                reason,
            });
        }

        return report;
    }





    async canCreateOrder(userId: Id, addressId: Id, orderItems: OrderItem[]) {
        const variantIds = orderItems.map((value) => (value._variantId))

        const address = await this.queryBus.execute(new EnsureActiveAddressGetByIdQuery({ addressId: addressId }));
        const user = await this.queryBus.execute(new EnsureActiveUserGetByIdQuery({ userId: userId }));
        const variants = await this.queryBus.execute(new VerifyVariantsAndGetQuery({ ids: variantIds }));
        const productsIds = variants.variantReadModel.map((value) => (value.productId));
        const products = await this.queryBus.execute(new VerifyProductAndGetQuery({ ids: productsIds }));
        const vendorIds = products.products.map((value) => Id.create((value.vendorId)));
        const vendors = await this.queryBus.execute(new VerifyVendorAndGetQuery({ ids: vendorIds }));
        const ownerIds = vendors.vendorReadModel.map((value) => Id.create((value.id)));
        const owners = await this.queryBus.execute(new VerifyUserAndGetQuery({ ids: ownerIds }));
        const report = this.getReport(variants, products, vendors, owners);

        console.log(report);

        if (!address.active) throw new BadRequestError("Address is not active");
        if (!address.address || !address) throw new BadRequestError("Address not found");
        if (!user.active) throw new BadRequestError("User is not active");
        if (!user.user) throw new BadRequestError("User not found");
        if (!address.address.fullAddress) throw new BadRequestError("Address details are incomplete");
        const fullAddress = FullAddressVO.create(address.address.fullAddress);


        return { fullAddress, user }
    }

    async createMyOrder(data: createMyOrderDtoType, actor: UserPersistence) {
        const orderId = Id.create();
        const idempotentKey = Id.create(data.idempotentKey);
        const addressId = Id.create(data.addressId);
        const actorId = Id.create(actor._id);
        const orderItems = data.items.map((value) => OrderItem.create({
            variantId: Id.create(value.variantId),
            quantity: Quantity.create(value.quantity),
            unitPrice: Quantity.create(value.unitPrice)
        }));
        const { fullAddress, user } = await this.canCreateOrder(actorId, addressId, orderItems)

        const order = OrderAggregate.create({
            idempotentKey: idempotentKey,
            id: orderId,
            items: orderItems,
            buyerId: actorId,
            address: fullAddress,
        });
        order.createOrder();
        await this.orderRepo.Create(order);
        await this.eventBus.publish(order.pullEvents());
        const response = OrderMapper.aggregateToResponseReadModel(order);
        return OrderMessages.orderCreated(orderId, actorId, addressId, response);
    }


}

// createOrder()
// cancelOrder(actorId: Id, reason: Reason)
// confirmOrder(actorId: Id)
// returnOrder(actorId: Id, reason: Reason)
// refundOrder(actorId: Id, reason: Reason)
// completeOrder(actorId: Id)