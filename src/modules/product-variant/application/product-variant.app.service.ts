
import { InMemoryQueryBus } from "../../../core/domain/infrastructure/in-memory-query-bus";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { Money } from "../../../core/domain/value-objects/money.vo";
import { Title } from "../../../core/domain/value-objects/title.vo";
import { BaseService } from "../../../core/services/base.services";
import { BadRequestError } from "../../../errors/app-error";
import { EnsureActiveProductGetByIdQuery } from "../../product/application/queries/ensure-active-product-get-by-id.query";
import { EnsureActiveUserGetByIdQuery } from "../../user/application/queries/ensure-active-user-get-by-id.query";
import { UserPersistence } from "../../user/infrastructure/user.models";
import { EnsureActiveVendorGetByIdQuery } from "../../vendor/application/queries/ensure-active-vendor-get-by-id.query";
import { ProductVariantAggregate } from "../domain/product-variant.aggregate";
import { ProductVariantRepository } from "../infrastructure/product-variant.repository";
import { createMyProductVariantDtoType } from "../presentation/dto/create-product-variant";
import { productVaraintMessages, ProductVaraintMessagesType } from "../presentation/product-variant.messages";
import { ProductVariantResponseReadModel } from "../domain/read-models/product-variant.response-read-model";
import { productVariantMapper } from "../infrastructure/product-variant.mapper";
import { idType } from "../../../../shared/dtos/id-schema";
import { updateMyVariatPriceDtoType } from "../presentation/dto/variant-price.dto";
import { upadteMyVariantMetaDtoType } from "../presentation/dto/variant-meta.dto";
import { toggleVariantApperaaracneDtoType } from "../presentation/dto/variant-appearance.dto";
import { softDeleteMyVariantDtoType } from "../presentation/dto/delete-varient.dto";
import { Reason } from "../../../core/domain/value-objects/reason.vo";

export class productVariantApplicationService extends BaseService {

    constructor(private readonly vairiantRepo: ProductVariantRepository,
        private readonly queryBus: InMemoryQueryBus
    ) { super(); }

    async canActorEditProductVaraintOrThrow(productId: Id, actorId: Id): Promise<void> {

        const activeUser = await this.queryBus.execute(new EnsureActiveUserGetByIdQuery({ userId: actorId }));
        if (!activeUser.user) throw new BadRequestError("User is not found");
        if (!activeUser.active) throw new BadRequestError("User is not active");
        const activeProduct = await this.queryBus.execute(new EnsureActiveProductGetByIdQuery({ productId: productId }));
        if (!activeProduct.product) throw new BadRequestError("Product not found");
        if (!activeProduct.active) throw new BadRequestError("Product is not active");
        const vendorId = Id.create(activeProduct.product.vendorId);
        const activeVendor = await this.queryBus.execute(new EnsureActiveVendorGetByIdQuery({ vendorId: vendorId }));
        if (!activeVendor.vendor) throw new BadRequestError("Vendor not found");
        if (!activeVendor.active) throw new BadRequestError("Vendor is not active");
        if (activeVendor.vendor.ownerId !== actorId.value) throw new BadRequestError("Owner don`t that variant");
    }

    async createMyProductVariant(data: createMyProductVariantDtoType, actor: UserPersistence): Promise<ProductVaraintMessagesType> {
        const varaintId = Id.create();
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const discountedPrice = Money.create(data.discountedPrice);
        const price = Money.create(data.price);
        const title = Title.create(data.title);
        await this.canActorEditProductVaraintOrThrow(productId, actorId);
        const varaint = ProductVariantAggregate.create({
            id: varaintId,
            productId: productId,
            discountedPrice: discountedPrice,
            price: price,
            title: title,
            active: data.active
        });
        await this.vairiantRepo.Create(varaint)
        return productVaraintMessages.varaintCreated(varaintId, productId, actorId);
    }

    async getVarientsByProductId(id: idType): Promise<ProductVariantResponseReadModel[] | null> {
        const productId = Id.create(id);
        const activeProduct = await this.queryBus.execute(new EnsureActiveProductGetByIdQuery({ productId: productId }));
        if (!activeProduct.product) throw new BadRequestError("Product not found");
        if (!activeProduct.active) throw new BadRequestError("Product is not active");
        const varaints = await this.vairiantRepo.FindByProductId(productId);
        if (!varaints) return null
        const response = varaints.map((value) => (productVariantMapper.aggregateToResponseReadModel(value)));
        return response;
    }

    async updateMyVariantPrice(data: updateMyVariatPriceDtoType, actor: UserPersistence): Promise<ProductVaraintMessagesType> {
        const actorId = Id.create(actor._id);
        const price = Money.create(data.price);
        const discountedPrice = Money.create(data.discountedPrice);
        const productId = Id.create(data.productId);
        const variantId = Id.create(data.variantId);
        const variant = await this.vairiantRepo.EnsureOwnerShipGetByIdOrThrow(productId, variantId);
        await this.canActorEditProductVaraintOrThrow(productId, actorId);
        variant.updatePrice(price, discountedPrice, actorId);
        await this.vairiantRepo.Save(variant);
        return productVaraintMessages.priceUpdated(price, discountedPrice, actorId, variantId);

    }

    async updateMyVariantMeta(data: upadteMyVariantMetaDtoType, actor: UserPersistence): Promise<ProductVaraintMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const variantId = Id.create(data.variantId);
        const title = Title.create(data.title);
        const variant = await this.vairiantRepo.EnsureOwnerShipGetByIdOrThrow(productId, variantId);
        await this.canActorEditProductVaraintOrThrow(productId, actorId);
        variant.updateMeta(title, actorId);
        await this.vairiantRepo.Save(variant);
        return productVaraintMessages.metaUpdated(variantId, actorId);
    }

    async toggleMyVaraintAppereance(data: toggleVariantApperaaracneDtoType, actor: UserPersistence): Promise<ProductVaraintMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const variantId = Id.create(data.variantId);
        const variant = await this.vairiantRepo.EnsureOwnerShipGetByIdOrThrow(productId, variantId);
        await this.canActorEditProductVaraintOrThrow(productId, actorId);
        if (data.appearance) {
            variant.activate(actorId);
            this.vairiantRepo.Save(variant);
            return productVaraintMessages.variantActivated(variantId, actorId);
        }
        else {
            variant.deActivate(actorId);
            this.vairiantRepo.Save(variant);
            return productVaraintMessages.variantDisabled(variantId, actorId);
        }
    }

    async softDeleteMyVariant(data: softDeleteMyVariantDtoType, actor: UserPersistence): Promise<ProductVaraintMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const variantId = Id.create(data.variantId);
        const reason = Reason.create(data.reason);
        const variant = await this.vairiantRepo.EnsureOwnerShipGetByIdOrThrow(productId, variantId);
        await this.canActorEditProductVaraintOrThrow(productId, actorId);
        variant.deleteProduct(actorId, reason);
        await this.vairiantRepo.Save(variant);
        return productVaraintMessages.variantDeleted(variantId, actorId);
    }

    async recoverVariant(id: idType, actor: UserPersistence): Promise<ProductVaraintMessagesType> {
        const actorId = Id.create(actor._id);
        const variantId = Id.create(id);
        const variant = await this.vairiantRepo.FindByIdOrThrow(variantId);
        variant.recoverProduct(actorId);
        await this.vairiantRepo.Save(variant);
        return productVaraintMessages.variantRecovered(variantId, actorId);
    }

}