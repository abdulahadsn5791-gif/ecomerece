
import type { IQueryBus } from '@ecomerece/domain/query/query-bus.interface';
import { DeleteInfoVO } from '@ecomerece/domain/value-objects/delete-info.vo';
import { Description } from '@ecomerece/domain/value-objects/description.vo';
import { Id } from '@ecomerece/domain/value-objects/id.vo';
import { Quantity } from '@ecomerece/domain/value-objects/quantity.vo';
import { Reason } from '@ecomerece/domain/value-objects/reason.vo';
import { Title } from '@ecomerece/domain/value-objects/title.vo';
import { UrlVO } from '@ecomerece/domain/value-objects/url.vo';
import { BaseService } from '../../../core/services/base.services';
import { BadRequestError } from '../../../errors/app-error';
import type { UserPersistence } from '../../user/infrastructure/user.models';
import { GetVendorByUserIdQuery } from '../../vendor/application/queries/get-vendor-by-user-id.query';
import { reviewMapper } from '../infrastructure/review.mapper';
import type { ReviewRepository } from '../infrastructure/review.repository';
import { ReviewResponseReadModel } from '../../../../../packages/shared/types/responses-read-models/review.response-read-model';
import { reviewMessages, ReviewMessagesType } from '../presentation/review.messages';
import { PersonName } from '@ecomerece/domain';
import { ReviewAggregate } from '@ecomerece/domain/modules/reviews/reviews.aggregate';
import { createMyReviewDtoType } from '../../../../../packages/shared/request-dtos/review/create-my-review.dto';
import { EnsureActiveOrderGetByIdHandler } from '../../order/application/query-handler/ensure-active-order-get-by-id.query-handler';
import { EnsureActiveOrderGetByIdQuery } from '../../order/application/queries/ensure-active-order-get-by-id.query';

export class ReviewApplicationService extends BaseService {
    constructor(
        private readonly queryBus: IQueryBus,
        private readonly reviewRepo: ReviewRepository,
    ) {
        super();
    }

    async getReviewById(id: string): Promise<ReviewResponseReadModel> {
        const reviewId = Id.create(id);
        const review = await this.reviewRepo.FindByIdOrThrow(reviewId);
        return reviewMapper.aggregateToResponseReadModel(review);
    }

    async getReviewsByProductId(productId: string): Promise<ReviewResponseReadModel[]> {
        const pId = Id.create(productId);
        const reviews = await this.reviewRepo.FindByProductId(pId);
        return reviews.map((review) => reviewMapper.aggregateToResponseReadModel(review));
    }
    async queryReviews(data: get) {


        if (data.cursor) cursor = Id.create(data.cursor);
        if (data.limit) limit = Quantity.create(data.limit);
        if (data.direction) direction = data.direction;
        const categories = await this.reviewRepo.FindPaginated({});
    }

    async createReview(data: createMyReviewDtoType, actor: UserPersistence): Promise<ReviewMessagesType> {
        const reviewId = Id.create();
        const actorId = Id.create(actor._id);
        const productId = Id.create(data.productId);
        const orderId = data.orderId ? Id.create(data.orderId) : null;
        const rating = Quantity.create(data.rating);
        const title = Title.create(data.title);
        const comment = Description.create(data.comment);
        const authorAvatar = UrlVO.create(actor.image);
        const images = data.images ? data.images.map((value) => (UrlVO.create(value))) : []
        const authorName = PersonName.create(actor.name.fullName)
        let verified = false;
        if (orderId) {
            const activeOrder = await this.queryBus.execute(new EnsureActiveOrderGetByIdQuery({ orderId: orderId }))

            if (activeOrder.active) if (activeOrder.order?.buyerId == actorId.value) verified = true
        }
        const review = ReviewAggregate.create({
            id: reviewId,
            productId: productId,
            authorId: actorId,
            authorName: authorName,
            authorAvatar: authorAvatar,
            orderId: orderId ?? null,
            rating: rating,
            title: title,
            comment: comment,
            images: images,
            isVerifiedPurchase: verified
        });
        await this.reviewRepo.Create(review);
        return reviewMessages.reviewCreated(reviewId, actorId, reviewMapper.aggregateToResponseReadModel(review))
    }



}