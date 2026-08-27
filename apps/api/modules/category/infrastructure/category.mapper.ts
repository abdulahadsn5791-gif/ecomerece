import { BlockInfoVO, CategoryAggregate, categoryReadModels, DeleteInfoVO, EffectiveDate, Id, Quantity, Reason, Title, UrlVO } from "@ecomerece/domain";
import { CategoryPersistence } from "./category.models";
import { categoryResponseReadModels } from "@ecomerece/shared";

export const CategoryMapper = {

    persistenceToAggregate(doc: CategoryPersistence): CategoryAggregate {
        return CategoryAggregate.rehydrate(
            Id.rehydrate(doc._id),
            Title.rehydrate(doc.title),
            Id.rehydrate(doc.createdBy),
            DeleteInfoVO.rehydrate(
                doc.deleted.deletedBy ? Id.create(doc.deleted.deletedBy) : null,
                doc.deleted.deleted,
                doc.deleted.deletedFrom ? EffectiveDate.create(doc.deleted.deletedFrom) : null,
                doc.deleted.reason ? Reason.create(doc.deleted.reason) : null,
            ),
            UrlVO.rehydrate(doc.image),
            BlockInfoVO.rehydrate(
                doc.block.blockedBy ? Id.create(doc.block.blockedBy) : null,
                doc.block?.blocked,
                doc.block.blockedFrom ? EffectiveDate.create(doc.block.blockedFrom) : null,
                doc.block.reason ? Reason.create(doc.block.reason) : null,
            ),
            Quantity.rehydrate(doc.version),
            EffectiveDate.rehydrate(doc.createdAt))
    },
    aggregateToPersistence(category: CategoryAggregate) {
        return {
            _id: category.id.value,
            deleted: {
                deleted: category.delete.deleted,
                deletedFrom: category.delete.from?.value ?? null,
                deletedBy: category.delete.performedBy?.value ?? null,
                reason: category.delete.reason?.value ?? null,
            },
            image: category.image.value,
            title: category.title.value,
            createdBy: category.createdBy.value,
            block: {
                blocked: category.block.blocked,
                blockedFrom: category.block.from?.value ?? null,
                blockedBy: category.block.performedBy?.value ?? null,
                reason: category.block.reason?.toString() ?? null,
            },
            createdAt: category.createdAt.value,

        }
    },

    aggregateToReadModel(category: CategoryAggregate): categoryReadModels {
        return {
            id: category.id.value,
            title: category.title.value,
            image: category.image.value,
            createdBy: category.createdBy.value,
            isDeleted: category.delete.isDeleted,
            idBlocked: category.block.isBlocked,
            createdAt: category.createdAt.value,
        }
    },
    persistenceToReadModel(doc: CategoryPersistence): categoryReadModels {
        return {
            id: doc._id,
            image: doc.image,
            title: doc.title,
            createdBy: doc.createdBy,
            isDeleted: doc.deleted.deleted,
            idBlocked: doc.block.blocked,
            createdAt: doc.createdAt,
        }
    },
    aggregateToResponseReadModel(category: CategoryAggregate): categoryResponseReadModels {
        return {
            id: category.id.value,
            image: category.image.value,
            title: category.title.value,
            createdAt: category.createdAt.value,
        }
    }

}