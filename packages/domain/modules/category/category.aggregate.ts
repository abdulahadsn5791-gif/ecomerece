
import { AggregateRoot } from "../../aggregate-root";
import { BlockInfoVO, DeleteInfoVO, EffectiveDate, Id, Quantity, Reason, Title } from "../../value-objects";

export type createCategoryProps = {
    id: Id,
    title: Title,
    createdBy: Id,
}

export class CategoryAggregate extends AggregateRoot {

    constructor(
        private readonly _id: Id,
        private _title: Title,
        private readonly _createdBy: Id,
        private _delete: DeleteInfoVO,
        private _block: BlockInfoVO,
        private readonly _version: Quantity,
        private readonly _createdAt: EffectiveDate,
    ) { super(); }

    get id() {
        return this._id;
    }
    get title() {
        return this._title;
    }
    get createdBy() {
        return this._createdBy;
    }
    get delete() {
        return this._delete;
    }
    get block() {
        return this._block;
    }
    get version() {
        return this._version;
    }
    get createdAt() {
        return this._createdAt;
    }

    static create(data: createCategoryProps): CategoryAggregate {
        return new CategoryAggregate(data.id, data.title, data.createdBy, DeleteInfoVO.none(), BlockInfoVO.none(), Quantity.create(0), EffectiveDate.today());

    }
    static rehydrate(_id: Id, title: Title, _createdBy: Id, _delete: DeleteInfoVO, _block: BlockInfoVO, _version: Quantity, _createdAt: EffectiveDate,): CategoryAggregate {
        return new CategoryAggregate(_id, title, _createdBy, _delete, _block, _version, _createdAt)
    }

    updateMeta(title: Title, actorId: Id) {
        this._title = title;
    }

    deleteCategory(reason: Reason, actorId: Id) {
        this._delete = DeleteInfoVO.create(actorId, reason);
    }
    recoverCategory(actorId: Id) {
        this._delete = DeleteInfoVO.none();
    }
    blockCategory(reason: Reason, actorId: Id) {
        this._block = BlockInfoVO.create(actorId, reason);
    }

}