import { CategoryAggregate, Id, Quantity, Reason, Title, UrlVO } from '@ecomerece/domain';
import type { IEventBus } from '@ecomerece/domain/events/event-bus.interface';
import {
    type createCategoryDtoType,
    type deleteCategoryType,
    type getPaginatedDtoType,
    type GetAdminPaginatedCategoriesDto,
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
    constructor(
        private readonly categoryRepo: CategoryRepository,
        private readonly eventBus: IEventBus,
    ) {
        super();
    }

    private async publishEvents(category: CategoryAggregate): Promise<void> {
        const events = category.pullEvents();
        if (events.length > 0) {
            await this.eventBus.publish(events);
        }
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
        await this.publishEvents(category);
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
        await this.publishEvents(category);
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
        // Public: non-deleted, non-blocked categories
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

    async getAdminPaginatedCategories(data: GetAdminPaginatedCategoriesDto): Promise<{
        data: any;
        meta: {
            nextCursor: string | null;
            prevCursor: string | null;
            hasMore: boolean;
        };
    }> {
        // Admin: all categories — no baseline restrictions
        const filter: FilterQuery<CategoryPersistence> = {};
        if (data.search) {
            filter.title = { $regex: `^${escapeRegex(data.search)}` };
        }
        if (data.deleted !== undefined) filter['deleted.deleted'] = data.deleted;
        if (data.blocked !== undefined) filter['block.blocked'] = data.blocked;
        return this.categoryRepo.FindPaginated({
            filter,
            cursor: data.cursor ? Id.create(data.cursor) : undefined,
            limit: data.limit ? Quantity.create(data.limit) : undefined,
            direction: data.direction,
            collation: CATEGORY_COLLATION,
        });
    }
}
