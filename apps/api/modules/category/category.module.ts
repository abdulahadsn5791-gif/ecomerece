import { CategoryAppService } from "./application/category.app.service";
import { CategoryRepository } from "./infrastructure/category.repository";
import { CategoryController } from "./presentation/category.controller";

export function createCategoryModule() {
    const categoryRepository = new CategoryRepository()
    const categoryAppService = new CategoryAppService(categoryRepository);
    const categoryController = new CategoryController(categoryAppService);
return {categoryController}
}