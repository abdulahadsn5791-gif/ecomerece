import { CategoryAggregate } from "@ecomerece/domain";
import { MongoRepository } from "../../../core/repository/mongo.repository";

export class CategoryRepository extends MongoRepository<> implements {

    async FindById(id: Id): Promise<CategoryAggregate | null> { }
async FindByTitle(ids: Id[]): Promise<CategoryAggregate | null> { }
  async FindByIdOrThrow(id: Id): Promise<CategoryAggregate> { }
   async FindByTitleOrThrow(ids: Id[]): Promise<CategoryAggregate> { }
 async Save(category: CategoryAggregate): Promise<void> { }
  async Delete(id: Id): Promise<void> { }
  async Exists(id: Id): Promise<boolean> { }
  async Create(category: CategoryAggregate): Promise<void> { }
}