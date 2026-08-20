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
        variants: {
            validIds: Id[];
            notFoundIds: Id[];
            deletedIds: Id[];
            nonActiveIds: Id[];
            variantReadModel: ProductVariantReadModel[];
        },
        products: {
            validIds: Id[];
            notFoundIds: Id[];
            deletedIds: Id[];
            blockedIds: Id[];
            productReadModel: ProductReadModel[];
        },
        vendors: {
            validIds: Id[];
            notFoundIds: Id[];
            deletedIds: Id[];
            nonVerifiedIds: Id[];
            vendorReadModel: VendorReadModel[];
        },
        owners: {
            validIds: Id[];
            notFoundIds: Id[];
            bannedIds: Id[];
            blockedIds: Id[];
            deletedIds: Id[];
            userReadModel: UserReadModel[];
        }
    ) {
        // ----- 1. Build direct error maps (ID → error code) -----
        const ownerErrors = new Map<string, string>();
        owners.notFoundIds.forEach(id => ownerErrors.set(id.value, 'NOT_FOUND'));
        owners.bannedIds.forEach(id => ownerErrors.set(id.value, 'BANNED'));
        owners.blockedIds.forEach(id => ownerErrors.set(id.value, 'BLOCKED'));
        owners.deletedIds.forEach(id => ownerErrors.set(id.value, 'DELETED'));

        const vendorErrors = new Map<string, string>();
        vendors.notFoundIds.forEach(id => vendorErrors.set(id.value, 'NOT_FOUND'));
        vendors.deletedIds.forEach(id => vendorErrors.set(id.value, 'DELETED'));
        vendors.nonVerifiedIds.forEach(id => vendorErrors.set(id.value, 'UNVERIFIED'));

        const productErrors = new Map<string, string>();
        products.notFoundIds.forEach(id => productErrors.set(id.value, 'NOT_FOUND'));
        products.deletedIds.forEach(id => productErrors.set(id.value, 'DELETED'));
        products.blockedIds.forEach(id => productErrors.set(id.value, 'BLOCKED'));

        const variantErrors = new Map<string, string>();
        variants.notFoundIds.forEach(id => variantErrors.set(id.value, 'NOT_FOUND'));
        variants.deletedIds.forEach(id => variantErrors.set(id.value, 'DELETED'));
        variants.nonActiveIds.forEach(id => variantErrors.set(id.value, 'INACTIVE'));

        // ----- 2. Build parent → child relationships (ID string → string[]) -----
        const productToVariants = new Map<string, string[]>();
        for (const v of variants.variantReadModel) {
            const key = Id.create(v.productId).value;
            const list = productToVariants.get(key) || [];
            list.push(Id.create(v.id).value);
            productToVariants.set(key, list);
        }

        const vendorToProducts = new Map<string, string[]>();
        for (const p of products.productReadModel) {
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

        // ----- 3. Propagate errors TOP‑DOWN (only if child doesn't already have a direct error) -----
        // Owner → Vendor
        for (const [ownerId, error] of ownerErrors) {
            const vendorsList = ownerToVendors.get(ownerId) || [];
            for (const vendorId of vendorsList) {
                if (!vendorErrors.has(vendorId)) {
                    vendorErrors.set(vendorId, `OWNER_${error}`);
                }
            }
        }

        // Vendor → Product
        for (const [vendorId, error] of vendorErrors) {
            const productsList = vendorToProducts.get(vendorId) || [];
            for (const productId of productsList) {
                if (!productErrors.has(productId)) {
                    productErrors.set(productId, `VENDOR_${error}`);
                }
            }
        }

        // Product → Variant
        for (const [productId, error] of productErrors) {
            const variantsList = productToVariants.get(productId) || [];
            for (const variantId of variantsList) {
                if (!variantErrors.has(variantId)) {
                    variantErrors.set(variantId, `PRODUCT_${error}`);
                }
            }
        }

        // ----- 4. Quick lookup Maps for product / vendor details (optional, for validation) -----
        const productMap = new Map<string, ProductReadModel>();
        for (const p of products.productReadModel) {
            productMap.set(Id.create(p.id).value, p);
        }

        const vendorMap = new Map<string, VendorReadModel>();
        for (const v of vendors.vendorReadModel) {
            vendorMap.set(Id.create(v.id).value, v);
        }

        // ----- 5. Generate report for each variant -----
        const report = [];
        for (const v of variants.variantReadModel) {
            const vid = Id.create(v.id).value;
            const pid = Id.create(v.productId).value;

            // Check if the variant has a final error (direct or propagated)
            let finalError = variantErrors.get(vid);

            // If no error, it's valid.
            const valid = !finalError;

            // Optional: If you still want to know which parent failed (for debugging),
            // you can keep the `reason` as the specific error code.
            report.push({
                id: v.id,
                productId: v.productId,
                valid,
                reason: finalError || null, // e.g., 'BLOCKED', 'VENDOR_DELETED', 'OWNER_BANNED', etc.
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
        const vendorIds = products.productReadModel.map((value) => Id.create((value.vendorId)));
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