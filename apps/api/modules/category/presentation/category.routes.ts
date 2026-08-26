import { Hono } from "hono";
import { authMiddleware } from "../../../middleware/auth";
import { adminMiddleware } from "../../../middleware/admin";
import { createCategoryModule } from "../category.module";

export const CategoryRoutes = new Hono();
const { categoryController } = createCategoryModule();

CategoryRoutes.post('/create', authMiddleware, adminMiddleware, categoryController.createCategory);
CategoryRoutes.delete('/', authMiddleware, adminMiddleware, categoryController.deleteCategory);
CategoryRoutes.get('/:id', categoryController.getCategory);
CategoryRoutes.get('/', categoryController.getPaginated);