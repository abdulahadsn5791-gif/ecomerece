import { createCategoryDtoType } from "@ecomerece/shared";
import { BaseService } from "../../../core/services/base.services";
import { CategoryMessagesType, CategoryMessags } from "../presentation/category.messages";
import { UserPersistence } from "../../user/infrastructure/user.models";
import { CategoryAggregate, Id, Title } from "@ecomerece/domain";
import { CategoryRepository } from "../infrastructure/category.repository";

export class CategoryAppService extends BaseService {

    constructor(private readonly categoryRepo: CategoryRepository) { super(); }


    async createCategory(data: createCategoryDtoType, actor: UserPersistence): Promise<CategoryMessagesType> {
        const id = Id.create();
        const title = Title.create(data.title);
        const actorId = Id.create(actor._id);
        const category = CategoryAggregate.create({ title: title, id: id, createdBy: actorId });
        await this.categoryRepo.Create(category);
        return CategoryMessags.created(id, actorId);
    }

}