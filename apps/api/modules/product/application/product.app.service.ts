import type { IQueryBus } from '@ecomerece/domain/query/query-bus.interface';
import { AltVO } from '@ecomerece/domain/value-objects/alt.vo';
import { Description } from '@ecomerece/domain/value-objects/description.vo';
import { Id } from '@ecomerece/domain/value-objects/id.vo';
import { ImageVO } from '@ecomerece/domain/value-objects/image.vo';
import { Name } from '@ecomerece/domain/value-objects/name.vo';
import { Quantity } from '@ecomerece/domain/value-objects/quantity.vo';
import { Reason } from '@ecomerece/domain/value-objects/reason.vo';
import { Title } from '@ecomerece/domain/value-objects/title.vo';
import { UrlVO } from '@ecomerece/domain/value-objects/url.vo';
import { BaseService } from '../../../core/services/base.services';
import type { UserPersistence } from '../../user/infrastructure/user.models';
import { GetVendorByUserIdQuery } from '../../vendor/application/queries/get-vendor-by-user-id.query';

import { ProductMapper } from '../infrastructure/product.mapper';
import type { ProductRepository } from '../infrastructure/product.repository';





import { productMessages, type productMessagesType } from '../presentation/product.messages';
import { blockLiftProductDtoType, blockProductDtoType, CreateMyProductDto, deafultImageDtoType, disclaimerItemsDtoType, imagesDtoType, ingredientsDtotype, productAppereanceDtoType, ProductResponseReadModel, recoverProductDtoType, softDeleteMyProductDtoType, toggleDiscalimerDtoType, toggleIngredientsDtoType, updateProductMetaDtoType } from '@ecomerece/shared';
import { DisclaimerVO, ImagesVO, IngredientsVO, ProductAggregate } from '@ecomerece/domain';

export class ProductApplicationService extends BaseService {
    constructor(
        private readonly queryBus: IQueryBus,
        private readonly productRepo: ProductRepository,
    ) {
        super();
    }

    async getProductById(id: string): Promise<ProductResponseReadModel> {
        const productId = Id.create(id);
        const product = await this.productRepo.FindByIdOrThrow(productId);
        return ProductMapper.aggregateToResponseReadModel(product);
    }

    async createMyProduct(
        data: CreateMyProductDto,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const id = Id.create();
        const actorId = Id.create(actor._id);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const images = ImagesVO.create(
            data.image.images.map((val) =>
                ImageVO.create(UrlVO.create(val.url), AltVO.create(val.alt), val.default),
            ),
        );
        const categoryId = Id.create(data.categoryId);
        const title = Title.create(data.title);
        const description = Description.create(data.description);
        const ingredients = IngredientsVO.create({
            isIngredients: data.ingredient.isIngredients,
            items: data.ingredient.ingredients.map((val) => Title.create(val)),
        });
        const disclaimer = DisclaimerVO.create({
            isDisclaimer: data.disclaimer.isDisclaimer,
            items: data.disclaimer.disclaimers.map((val) => ({
                name: Name.create(val.name),
                title: Title.create(val.title),
            })),
        });
        const product = ProductAggregate.create({
            id: id,
            categoryId: categoryId,
            vendorId: vendorId,
            images: images,
            title: title,
            description: description,
            ingredients: ingredients,
            disclaimer: disclaimer,
        });
        await this.productRepo.Create(product);
        return productMessages.productCreated(id, vendorId);
    }

    async softDeleteMyProduct(
        data: softDeleteMyProductDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        const reason = Reason.create(data.reason);
        product.deleteProduct(actorId, reason);
        await this.productRepo.Save(product);
        return productMessages.productDeleted(productId, actorId, reason);
    }

    async recoverMyProduct(
        data: recoverProductDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        product.recoverProduct();
        await this.productRepo.Save(product);
        return productMessages.productRecovered(productId, actorId);
    }

    async blockProduct(
        data: blockProductDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const reason = Reason.create(data.reason);
        const product = await this.productRepo.FindByIdOrThrow(productId);
        product.blockProduct(actorId, reason);
        await this.productRepo.Save(product);
        return productMessages.productBlocked(productId, actorId, reason);
    }

    async unBlockProduct(
        data: blockLiftProductDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const product = await this.productRepo.FindByIdOrThrow(productId);
        product.unBlockProduct(actorId);
        await this.productRepo.Save(product);
        return productMessages.productUnBlocked(productId, actorId);
    }

    async makeMyProductPublic(
        data: productAppereanceDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const productId = Id.create(data.productId);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        product.makeProductPublic();
        await this.productRepo.Save(product);
        return productMessages.productPublic(productId, actorId);
    }

    async makeMyProductPrivate(
        data: productAppereanceDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const productId = Id.create(data.productId);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        product.makeProductPrivate();
        await this.productRepo.Save(product);
        return productMessages.productPrivate(productId, actorId);
    }

    async updateMyProductMeta(
        data: updateProductMetaDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const title = Title.create(data.title);
        const description = Description.create(data.description);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        product.updateMeta(title, description, actorId);
        await this.productRepo.Save(product);
        return productMessages.metaUpdated(productId, actorId);
    }

    async toggleMyProductDisclaimer(
        data: toggleDiscalimerDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        if (data.enable) product.enableDisclaimer(actorId);
        else product.disableDisclaimer(actorId);
        await this.productRepo.Save(product);
        if (data.enable) return productMessages.disclaimerEnabled(productId, actorId);
        else return productMessages.disclaimerDisabled(productId, actorId);
    }

    async addMyProductDisclaimers(
        data: disclaimerItemsDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        product.addDisclaimers(data.items, actorId);
        await this.productRepo.Save(product);
        return productMessages.disclaimerUpdated(productId, actorId);
    }

    async removeMyProductDisclaimers(
        data: disclaimerItemsDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        product.removeDisclaimers(data.items, actorId);
        await this.productRepo.Save(product);
        return productMessages.disclaimerUpdated(productId, actorId);
    }

    async addMyProductImages(
        data: imagesDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        const images = data.images.map((value) =>
            ImageVO.create(UrlVO.create(value.url), AltVO.create(value.alt), value.isDefault),
        );
        product.addImages(images, actorId);
        await this.productRepo.Save(product);
        return productMessages.imageUpdated(productId, actorId);
    }
    async setMyProductDefaultImage(
        data: deafultImageDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        const index = Quantity.create(data.index);
        product.setDefault(index, actorId);
        await this.productRepo.Save(product);
        return productMessages.imageDefault(index, productId, actorId);
    }

    async removeMyProductImages(
        data: imagesDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        const urls = data.images.map((value) => UrlVO.create(value.url));
        product.removeImages(urls, actorId);
        await this.productRepo.Save(product);
        return productMessages.imageUpdated(productId, actorId);
    }

    async toggleMyProductIngredients(
        data: toggleIngredientsDtoType,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        if (data.enable) product.enableIngredients(actorId);
        else product.disableIngredients(actorId);
        await this.productRepo.Save(product);
        if (data.enable) return productMessages.ingredientsEnabled(productId, actorId);
        else return productMessages.ingredientsDisabled(productId, actorId);
    }

    async addMyProductIngredients(
        data: ingredientsDtotype,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        product.addIngredients(data.items, actorId);
        await this.productRepo.Save(product);
        return productMessages.ingredientsUpdated(productId, actorId);
    }

    async removeMyProductIngredients(
        data: ingredientsDtotype,
        actor: UserPersistence,
    ): Promise<productMessagesType> {
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const vendor = this.ensureFound(
            await this.queryBus.execute(new GetVendorByUserIdQuery({ userId: actorId })),
            'User don,t own an vendor',
        );
        const vendorId = Id.create(vendor.id);
        const product = await this.productRepo.EnsureOwnerShipOrThrow(productId, vendorId);
        product.removeIngredients(data.items, actorId);
        await this.productRepo.Save(product);
        return productMessages.ingredientsUpdated(productId, actorId);
    }
}
