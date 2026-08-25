import { Hono } from "hono";
import { authMiddleware } from "../../../middleware/auth";
import { adminMiddleware } from "../../../middleware/admin";
import { createCategoryModule } from "../category.module";

const CategoryRoutes = new Hono();
const { categoryController } = createCategoryModule();
CategoryRoutes.post('/create', authMiddleware, adminMiddleware, categoryController.createCategory);