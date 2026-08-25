import { Id, Title } from "../../../value-objects";
import { CategoryAggregate } from "../category.aggregate";

export interface ICategoryRepository {
    FindById(id: Id): Promise<CategoryAggregate | null>;
    FindByTitle(title: Title): Promise<CategoryAggregate | null>;
    FindByIdOrThrow(id: Id): Promise<CategoryAggregate>;
    FindByTitleOrThrow(title: Title): Promise<CategoryAggregate>;
    Save(category: CategoryAggregate): Promise<void>;
    Delete(id: Id): Promise<void>;
    Exists(id: Id): Promise<boolean>;
    Create(category: CategoryAggregate): Promise<void>;
}