
import { EffectiveDate } from '@ecomerece/domain/value-objects/effective-date.vo';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import { ReviewResponseReadModel } from '../../../../../packages/shared/types/responses-read-models/review.response-read-model';

export type ReviewMessagesType = {
    message: string,
    updatedData?: ReviewResponseReadModel
};

export const reviewMessages = {
    reviewCreated(reviewId: Id, actorId: Id, data: ReviewResponseReadModel): ReviewMessagesType {
        return {
            message: `Review with id ${reviewId.value} has been created by ${actorId.value} on ${EffectiveDate.today().value}`,
            updatedData: data
        };
    },

    reviewUpdated(reviewId: Id, actorId: Id): ReviewMessagesType {
        return {
            message: `Review with id ${reviewId.value} has been updated by ${actorId.value} on ${EffectiveDate.today().value}`,
        };
    },

    reviewDeleted(reviewId: Id, actorId: Id): ReviewMessagesType {
        return {
            message: `Review with id ${reviewId.value} has been deleted by ${actorId.value} on ${EffectiveDate.today().value}`,
        };
    },

    vendorReplyAdded(reviewId: Id, vendorId: Id): ReviewMessagesType {
        return {
            message: `Vendor reply added to review ${reviewId.value} by vendor ${vendorId.value} on ${EffectiveDate.today().value}`,
        };
    },

    reviewLiked(reviewId: Id): ReviewMessagesType {
        return {
            message: `Review with id ${reviewId.value} was liked on ${EffectiveDate.today().value}`,
        };
    },

    reviewDisliked(reviewId: Id): ReviewMessagesType {
        return {
            message: `Review with id ${reviewId.value} was disliked on ${EffectiveDate.today().value}`,
        };
    },

    reviewReported(reviewId: Id, actorId: Id): ReviewMessagesType {
        return {
            message: `Review with id ${reviewId.value} was reported by ${actorId.value} on ${EffectiveDate.today().value}`,
        };
    },

    reviewBlocked(reviewId: Id, actorId: Id): ReviewMessagesType {
        return {
            message: `Review with id ${reviewId.value} has been blocked by admin ${actorId.value} on ${EffectiveDate.today().value}`,
        };
    },
};