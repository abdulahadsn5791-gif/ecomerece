import { Id } from "../../../core/domain/value-objects/id.vo";
import { ProductVariantAggregate } from "../domain/product-variant.aggregate";
import { ProductVariantPersistence } from "./product-variant.model";
import { Money } from "../../../core/domain/value-objects/money.vo";
import { Title } from "../../../core/domain/value-objects/title.vo";
import { DeleteInfoVO } from "../../../core/domain/value-objects/delete-info.vo";
import { Reason } from "../../../core/domain/value-objects/reason.vo";
import { EffectiveDate } from "../../../core/domain/value-objects/effective-date.vo";
import { Quantity } from "../../../core/domain/value-objects/quantity.vo";
import { ProductVariantReadModel } from "../domain/read-models/product-variant.read-model";
import { ProductVariantResponseReadModel } from "../domain/read-models/product-variant.response-read-model";

export const productVariantMapper = {

    persistenceToAggregate(doc: ProductVariantPersistence): ProductVariantAggregate {
        return ProductVariantAggregate.rehydrate(
            Id.rehydrate(doc._id),
            Id.rehydrate(doc.productId),

            Money.rehydrate(doc.discountedPrice),
            Money.rehydrate(doc.price),
            doc.active,
            Title.rehydrate(doc.title),
            DeleteInfoVO.rehydrate(
                doc.deleted.deletedBy ? Id.rehydrate(doc.deleted.deletedBy) : null,
                doc.deleted.deleted,
                doc.deleted.deletedFrom ? EffectiveDate.rehydrate(doc.deleted.deletedFrom) : null,
                doc.deleted.reason ? Reason.rehydrate(doc.deleted.reason) : null,
            ),
            Quantity.rehydrate(doc.version),
            EffectiveDate.rehydrate(doc.createdAt))
    },

    aggregateToPersistence(product: ProductVariantAggregate) {
        return {
            _id: product.id.value,
            productId: product.productId.value,

            discountedPrice: product.discountedPrice.value,
            price: product.price.value,
            title: product.title.value,
            deleted: {
                deleted: product.delete.deleted,
                deletedFrom: product.delete.from?.value ?? null,
                deletedBy: product.delete.performedBy?.value ?? null,
                reason: product.delete.reason?.value ?? null,
            },
            active: product.active,
            createdAt: product.createdAt.value,
            updatedAt: EffectiveDate.today().value,

        }

    },

    aggregateToReadModel(product: ProductVariantAggregate): ProductVariantReadModel {
        return {
            productId: product.productId.value,
            id: product.id.value,
            discountedPrice: product.discountedPrice.value,
            price: product.price.value,
            active: product.active,
            title: product.title.value,
            deleted: {
                deleted: product.delete.deleted,
                deletedFrom: product.delete.from?.value ?? null,
                deletedBy: product.delete.performedBy?.value ?? null,
                reason: product.delete.reason?.value ?? null,
            },
            createdAt: product.createdAt.value,
        }
    },

    aggregateToResponseReadModel(product: ProductVariantAggregate): ProductVariantResponseReadModel {
        return {
            productId: product.productId.value,
            id: product.id.value,
            discountedPrice: product.discountedPrice.value,
            price: product.price.value,
            active: product.active,
            title: product.title.value,
            createdAt: product.createdAt.value,
        }

    }


}


