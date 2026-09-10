import { BadRequestError } from '../../../../apps/api/errors/app-error';
import { AggregateRoot } from '../../aggregate-root';
import {
    AppearanceVO,
    BlockInfoVO,
    DeleteInfoVO,
    Description,
    EffectiveDate,
    Id,
    PersonName,
    Quantity,
    Reason,
    Title,
    UrlVO,
} from '../../value-objects';

type CreateReviewProps = {
    id: Id;
    productId: Id;
    authorId: Id;
    authorName: PersonName;
    authorAvatar: UrlVO;
    orderId?: Id | null;
    rating: Quantity;
    title: Title;
    comment: Description;
    images?: UrlVO[];
    isVerifiedPurchase?: boolean;
};

export class ReviewAggregate extends AggregateRoot {
    private constructor(
        private readonly _id: Id,
        private readonly _productId: Id,
        private readonly _authorId: Id,
        private readonly _orderId: Id | null,
        private readonly _authorName: PersonName,
        private readonly _authorAvatar: UrlVO,
        private _reportCount: Quantity,
        private _reportReasons: Reason[],
        private _rating: Quantity,
        private _title: Title,
        private _dislikes: Quantity,
        private _likes: Quantity,
        private _comment: Description,
        private _images: UrlVO[],
        private readonly _isVerifiedPurchase: boolean,
        private _vendorReply: Description | null,
        private _delete: DeleteInfoVO,
        private readonly _createdAt: EffectiveDate,
        private _version: Quantity,
        private _updatedAt: EffectiveDate,
    ) {
        super();
    }


    public static create(props: CreateReviewProps): ReviewAggregate {
        const now = EffectiveDate.today();

        const review = new ReviewAggregate(
            props.id,
            props.productId,
            props.authorId,
            props.orderId ?? null,
            props.authorName,
            props.authorAvatar,
            Quantity.create(0),
            [],
            props.rating,
            props.title,
            Quantity.create(0),
            Quantity.create(0),
            props.comment,
            props.images ?? [],
            props.isVerifiedPurchase ?? false,
            null,
            DeleteInfoVO.none(),

            now,
            Quantity.zero(),
            now,
        );


        return review;
    }

    public static rehydrate(_id: Id,
        _productId: Id,
        _authorId: Id,
        _orderId: Id | null,
        _authorName: PersonName,
        _authorAvatar: UrlVO,
        _reportCount: Quantity,
        _reportReasons: Reason[],
        _rating: Quantity,
        _title: Title,
        _dislikes: Quantity,
        _likes: Quantity,
        _comment: Description,
        _images: UrlVO[],
        _isVerifiedPurchase: boolean,
        _vendorReply: Description | null,
        _delete: DeleteInfoVO,
        _createdAt: EffectiveDate,
        _version: Quantity,
        _updatedAt: EffectiveDate,) {
        return new ReviewAggregate(_id,
            _productId,
            _authorId,
            _orderId,
            _authorName,
            _authorAvatar,
            _reportCount,
            _reportReasons,
            _rating,
            _title,
            _dislikes,
            _likes,
            _comment,
            _images,
            _isVerifiedPurchase,
            _vendorReply,
            _delete,
            _createdAt,
            _version,
            _updatedAt,)
    }

    public updateContent(title: Title, comment: Description, images: UrlVO[], rating: Quantity): void {
        this.ensureNotDeleted();
        this._title = title;
        this._comment = comment;
        this._images = images;
        this._rating = rating;
        this.touch();
    }

    public addVendorReply(reply: Description): void {
        this.ensureNotDeleted();
        if (this._vendorReply !== null) {
            throw new BadRequestError('Vendor reply has already been submitted for this review.');
        }
        this._vendorReply = reply;
        this.touch();
    }

    public like(): void {
        this.ensureNotDeleted();
        this._likes = this._likes.increase(1);
        this.touch();
    }

    public dislike(): void {
        this.ensureNotDeleted();
        this._dislikes = this._dislikes.increase(1);
        this.touch();
    }

    public report(reason: Reason): void {
        this.ensureNotDeleted();
        this._reportReasons.push(reason);
        this._reportCount = this._reportCount.increase(1);
        this.touch();
    }


    public deleteReview(deleteInfo: DeleteInfoVO): void {
        if (this._delete.isDeleted) {
            throw new BadRequestError('Review is already deleted.');
        }
        this._delete = deleteInfo;
        this.touch();
    }

    public get version(): Quantity {
        return this._version
    }
    public get id(): Id {
        return this._id;
    }

    public get productId(): Id {
        return this._productId;
    }

    public get authorId(): Id {
        return this._authorId;
    }

    public get orderId(): Id | null {
        return this._orderId;
    }

    public get authorName(): PersonName {
        return this._authorName;
    }

    public get authorAvatar(): UrlVO {
        return this._authorAvatar;
    }

    public get reportCount(): Quantity {
        return this._reportCount;
    }

    public get reportReasons(): Reason[] {
        return [...this._reportReasons];
    }

    public get rating(): Quantity {
        return this._rating;
    }

    public get title(): Title {
        return this._title;
    }

    public get dislikes(): Quantity {
        return this._dislikes;
    }

    public get likes(): Quantity {
        return this._likes;
    }

    public get comment(): Description {
        return this._comment;
    }

    public get images(): UrlVO[] {
        return [...this._images];
    }

    public get isVerifiedPurchase(): boolean {
        return this._isVerifiedPurchase;
    }

    public get vendorReply(): Description | null {
        return this._vendorReply;
    }

    public get delete(): DeleteInfoVO {
        return this._delete;
    }



    public get createdAt(): EffectiveDate {
        return this._createdAt;
    }

    public get updatedAt(): EffectiveDate {
        return this._updatedAt;
    }


    private touch(): void {
        this._updatedAt = EffectiveDate.today();
    }

    private ensureNotDeleted(): void {
        if (this._delete.isDeleted) {
            throw new BadRequestError('Cannot perform operation on a deleted review.');
        }

    }
}