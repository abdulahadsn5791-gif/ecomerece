import { CategoryAggregate, Id, Quantity, Reason, Title, UrlVO } from '@ecomerece/domain';
import {
    type createCategoryDtoType,
    type deleteCategoryType,
    type getPaginatedDtoType,
} from '@ecomerece/shared';
import type { FilterQuery } from 'mongoose';
import { BaseService } from '../../../core/services/base.services';
import type { UserPersistence } from '../../user/infrastructure/user.models';
import { CategoryMapper } from '../infrastructure/category.mapper';
import type { CategoryRepository } from '../infrastructure/category.repository';
import type { CategoryPersistence } from '../infrastructure/category.models';
import { type CategoryMessagesType, CategoryMessags } from '../presentation/category.messages';

const CATEGORY_COLLATION = { locale: 'en', strength: 2 };

const escapeRegex = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class CategoryAppService extends BaseService {
    constructor(private readonly categoryRepo: CategoryRepository) {
        super();
    }

    async createCategory(
        data: createCategoryDtoType,
        actor: UserPersistence,
    ): Promise<CategoryMessagesType> {
        const id = Id.create();
        const title = Title.create(data.title);
        const actorId = Id.create(actor._id);
        const image = UrlVO.create(data.image);
        const category = CategoryAggregate.create({
            title: title,
            id: id,
            image: image,
            createdBy: actorId,
        });
        await this.categoryRepo.Create(category);
        return CategoryMessags.created(id, actorId);
    }

    async deleteCategoryById(
        data: deleteCategoryType,
        actor: UserPersistence,
    ): Promise<CategoryMessagesType> {
        const id = Id.create(data.id);
        const actorId = Id.create(actor._id);
        const reason = Reason.create(data.reason);
        const category = await this.categoryRepo.FindByIdOrThrow(id);
        category.deleteCategory(reason, actorId);
        await this.categoryRepo.Save(category);
        return CategoryMessags.deleted(id, actorId);
    }

    async getCategoryById(id: string) {
        const categoryId = Id.create(id);
        const category = await this.categoryRepo.FindByIdOrThrow(categoryId);
        return CategoryMapper.aggregateToReadModel(category);
    }

    async getPaginatedCategories(data: getPaginatedDtoType): Promise<{
        data: any;
        meta: {
            nextCursor: string | null;
            prevCursor: string | null;
            hasMore: boolean;
        };
    }> {
        const filter: FilterQuery<CategoryPersistence> = {
            'deleted.deleted': false,
            'block.blocked': false,
        };
        if (data.search) {
            filter.title = { $regex: `^${escapeRegex(data.search)}` };
        }
        return this.categoryRepo.FindPaginated({
            filter,
            cursor: data.cursor ? Id.create(data.cursor) : undefined,
            limit: data.limit ? Quantity.create(data.limit) : undefined,
            direction: data.direction,
            collation: CATEGORY_COLLATION,
        });
    }
}
