import { AltVO } from '@ecomerece/domain/value-objects/alt.vo';
import { AppearanceVO } from '@ecomerece/domain/value-objects/appearance.vo';
import { BlockInfoVO } from '@ecomerece/domain/value-objects/block-info.vo';
import { DeleteInfoVO } from '@ecomerece/domain/value-objects/delete-info.vo';
import { Description } from '@ecomerece/domain/value-objects/description.vo';
import { EffectiveDate } from '@ecomerece/domain/value-objects/effective-date.vo';
import { Id } from '@ecomerece/domain/value-objects/id.vo';
import { ImageVO } from '@ecomerece/domain/value-objects/image.vo';
import { Name } from '@ecomerece/domain/value-objects/name.vo';
import { Quantity } from '@ecomerece/domain/value-objects/quantity.vo';
import { Reason } from '@ecomerece/domain/value-objects/reason.vo';
import { Title } from '@ecomerece/domain/value-objects/title.vo';
import { UrlVO } from '@ecomerece/domain/value-objects/url.vo';

import type { ProductPersistence } from './product.model';
import { DisclaimerVO, ImagesVO, IngredientsVO, ProductAggregate, ProductReadModel } from '@ecomerece/domain';
import { ProductResponseReadModel } from '@ecomerece/shared';

export const ProductMapper = {
    persistenceToAggregate(doc: ProductPersistence): ProductAggregate {
        return ProductAggregate.rehydrate(
            Id.create(doc._id.toString()),
            Id.create(doc.vendorId),
            Id.create(doc.categoryId),
            Title.create(doc.title),
            Description.create(doc.description),
            IngredientsVO.rehydrate(
                doc.ingredient.isIngredients,
                doc.ingredient.ingredients.map((value) => Title.rehydrate(value)),
            ),
            DisclaimerVO.rehydrate(
                doc.disclaimer.isDisclaimer,
                (doc.disclaimer.disclaimers || []).map((value) => ({
                    name: Name.create(value.name),
                    title: Title.rehydrate(value.title),
                })),
            ),

            ImagesVO.rehydrate(
                doc.image.images.map((image) =>
                    ImageVO.rehydrate(
                        UrlVO.create(image.url),
                        AltVO.create(image.alt),
                        image.default,
                    ),
                ),
            ),
            DeleteInfoVO.rehydrate(
                doc.deleted.deletedBy ? Id.create(doc.deleted.deletedBy) : null,
                doc.deleted.deleted,
                doc.deleted.deletedFrom ? EffectiveDate.create(doc.deleted.deletedFrom) : null,
                doc.deleted.reason ? Reason.create(doc.deleted.reason) : null,
            ),
            BlockInfoVO.rehydrate(
                doc.block.blockedBy ? Id.create(doc.block.blockedBy) : null,
                doc.block.blocked,
                doc.block.blockedFrom ? EffectiveDate.create(doc.block.blockedFrom) : null,
                doc.block.reason ? Reason.create(doc.block.reason) : null,
            ),
            AppearanceVO.create(doc.appearance),
            Quantity.rehydrate(doc.version),
            EffectiveDate.create(doc.createdAt),
        );
    },

    aggregateToPersistence(product: ProductAggregate) {
        return {
            _id: product.id.value,
            vendorId: product.vendorId.value,

            title: product.title.value,
            description: product.description.value,
            ingredient: {
                isIngredients: product.ingredients.isIngredients,
                ingredients: product.ingredients.value.map((value) => value.value),
            },
            disclaimer: {
                isDisclaimer: product.disclaimer.isDisclaimer,
                disclaimers: product.disclaimer.items.map((d) => ({
                    name: d.name.value,
                    title: d.title.value,
                })),
            },
            image: {
                images: product.images.value.map((value) => value.toObject()),
            },
            deleted: {
                deleted: product.delete.deleted,
                deletedFrom: product.delete.from?.value ?? null,
                deletedBy: product.delete.performedBy?.value ?? null,
                reason: product.delete.reason?.value ?? null,
            },
            block: {
                blocked: product.block.isBlocked,
                blockedFrom: product.block.from?.value ?? null,
                blockedBy: product.block.performedBy?.value ?? null,
                reason: product.block.reason?.value ?? null,
            },
            appearance: product.appearance.value,
            version: product.version.value,
            createdAt: product.createdAt.value,
            updatedAt: EffectiveDate.today().value,
        };
    },

    aggregateToReadModel(product: ProductAggregate): ProductReadModel {
        return {
            id: product.id.value,
            categoryId: product.categoryId.value,
            version: product.version.value,
            title: product.title.value,
            appearance: product.appearance.value,
            description: product.description.value,
            vendorId: product.vendorId.value,
            ingredient: {
                isIngredients: product.ingredients.isIngredients,
                ingredients: product.ingredients.value.map((val) => val.value),
            },
            disclaimer: {
                isDisclaimer: product.disclaimer.isDisclaimer,
                disclaimers: product.disclaimer.items.map((d) => ({
                    name: d.name.value,
                    title: d.title.value,
                })),
            },
            image: {
                images: product.images.value.map((val) => val.toObject()),
            },
            block: {
                blocked: product.block.isBlocked,
                blockedFrom: product.block.from?.value ?? null,
                blockedBy: product.block.performedBy?.value ?? null,
                reason: product.block.reason?.value ?? null,
            },
            deleted: {
                deleted: product.delete.deleted,
                deletedFrom: product.delete.from?.value ?? null,
                deletedBy: product.delete.performedBy?.value ?? null,
                reason: product.delete.reason?.value ?? null,
            },
            createdAt: product.createdAt.value,
        };
    },

    persistenceToReadModel(doc: ProductPersistence): ProductReadModel {
        return {
            id: doc._id.toString(),
            categoryId: doc.categoryId,
            version: doc.version,
            title: doc.title,
            appearance: doc.appearance,
            description: doc.description,
            vendorId: doc.vendorId,
            ingredient: {
                isIngredients: doc.ingredient.isIngredients,
                ingredients: doc.ingredient.ingredients,
            },
            disclaimer: {
                isDisclaimer: doc.disclaimer.isDisclaimer,
                disclaimers: doc.disclaimer.disclaimers.map((d) => ({
                    name: d.name,
                    title: d.title,
                })),
            },
            image: {
                images: doc.image.images.map((img) => ({
                    url: img.url,
                    alt: img.alt,
                    default: img.default,
                })),
            },
            block: {
                blocked: doc.block.blocked,
                blockedFrom: doc.block.blockedFrom ?? null,
                blockedBy: doc.block.blockedBy ?? null,
                reason: doc.block.reason ?? null,
            },
            deleted: {
                deleted: doc.deleted.deleted,
                deletedFrom: doc.deleted.deletedFrom ?? null,
                deletedBy: doc.deleted.deletedBy ?? null,
                reason: doc.deleted.reason ?? null,
            },
            createdAt: doc.createdAt,
        };
    },

    aggregateToResponseReadModel(product: ProductAggregate): ProductResponseReadModel {
        return {
            id: product.id.value,
            categoryId: product.categoryId,
            version: product.version.value,
            title: product.title.value,
            appearance: product.appearance.value,
            description: product.description.value,
            vendorId: product.vendorId.value,
            ingredient: {
                isIngredients: product.ingredients.isIngredients,
                ingredients: product.ingredients.value.map((val) => val.value),
            },
            disclaimer: {
                isDisclaimer: product.disclaimer.isDisclaimer,
                disclaimers: product.disclaimer.items.map((d) => ({
                    name: d.name.value,
                    title: d.title.value,
                })),
            },
            image: {
                images: product.images.value.map((val) => val.toObject()),
            },
            createdAt: product.createdAt.value,
        };
    },
};
