import type {
    CategoryAggregate,
    ICategoryRepository,
    Id,
    Quantity,
    Title,
} from '@ecomerece/domain';
import { FilterQuery } from 'mongoose';
import { CursorMeta } from '../../../core/repository/base.repository';
import { MongoRepository } from '../../../core/repository/mongo.repository';
import { BadRequestError, ConcurrencyError } from '../../../errors/app-error';
import { CategoryMapper } from './category.mapper';
import { CategoryModel, type CategoryPersistence } from './category.models';

export class CategoryRepository
    extends MongoRepository<CategoryPersistence>
    implements ICategoryRepository
{
    constructor() {
        super(CategoryModel);
    }

    async FindById(id: Id): Promise<CategoryAggregate | null> {
        const doc = await super.findById(id.value);
        if (!doc) return null;
        return CategoryMapper.persistenceToAggregate(doc);
    }

    async FindByTitle(title: Title): Promise<CategoryAggregate | null> {
        const doc = await super.findOne({ title: title });
        if (!doc) return null;
        return CategoryMapper.persistenceToAggregate(doc);
    }

    async FindByIdOrThrow(id: Id): Promise<CategoryAggregate> {
        const doc = await super.findById(id.value);
        if (!doc) throw new BadRequestError('Category not found');
        return CategoryMapper.persistenceToAggregate(doc);
    }

    async FindByTitleOrThrow(title: Title): Promise<CategoryAggregate> {
        const doc = await super.findOne({ title: title });
        if (!doc) throw new BadRequestError('Category not found');
        return CategoryMapper.persistenceToAggregate(doc);
    }

    async FindPaginated(params: {
        cursor?: Id;
        limit?: Quantity;
        direction?: 'next' | 'prev';
    }): Promise<{
        data: any;
        meta: {
            nextCursor: string | null;
            prevCursor: string | null;
            hasMore: boolean;
        };
    }> {
        const info = {
            cursor: params.cursor?.value,
            limit: params.limit?.value,
            direction: params.direction,
        };
        const result = await this.paginateByCursor(info);
        return {
            data: result,
            meta: result.meta,
        };
    }

    async Save(category: CategoryAggregate): Promise<void> {
        const data = CategoryMapper.aggregateToPersistence(category);
        const result = await super.updateOne(
            {
                _id: category.id.value,
                version: category.version.value,
            },
            {
                $set: data,
                $inc: { version: 1 },
            },
        );

        if (result.modifiedCount === 0) {
            throw new ConcurrencyError();
        }
    }

    async Delete(id: Id): Promise<void> {
        const doc = await super.findByIdAndDelete(id.value);
        if (!doc) throw new BadRequestError('Inventory not found with this id');
    }

    async Exists(id: Id): Promise<boolean> {
        return !!(await super.exists({
            _id: id.value,
        }));
    }

    async Create(category: CategoryAggregate): Promise<void> {
        const categoryPersistence = CategoryMapper.aggregateToPersistence(category);
        const catagoryDoc = new CategoryModel(categoryPersistence);
        await super.create(catagoryDoc);
    }
}
