import { Id } from "../../../value-objects";
import { CategoryAggregate } from "../category.aggregate";

export interface ICategoryRepository {
    FindById(id: Id): Promise<CategoryAggregate | null>;
    FindByTitle(ids: Id[]): Promise<CategoryAggregate | null>;
    FindByIdOrThrow(id: Id): Promise<CategoryAggregate>;
    FindByTitleOrThrow(ids: Id[]): Promise<CategoryAggregate>;
    Save(category: CategoryAggregate): Promise<void>;
    Delete(id: Id): Promise<void>;
    Exists(id: Id): Promise<boolean>;
    Create(category: CategoryAggregate): Promise<void>;
}