import { Hono } from "hono";
import { createProductVaraintModule } from "../product-variant.module";
import { authMiddleware } from "../../../middleware/auth";
import { adminMiddleware } from "../../../middleware/admin";

const { controller } = createProductVaraintModule();

export const productVariantRoutes = new Hono();


productVariantRoutes.get('/:id', controller.getVarientsByProductId);
productVariantRoutes.post('/my', authMiddleware, controller.createMyProductVariant);
productVariantRoutes.patch('/price/my', authMiddleware, controller.updateMyVariantPrice);
productVariantRoutes.patch('/meta/my', authMiddleware, controller.updateMyVariantMeta);
productVariantRoutes.patch('/appereance/toggle/my', authMiddleware, controller.toggleMyVaraintAppereance);
productVariantRoutes.delete('/delete/soft/my', authMiddleware, controller.softDeleteMyVariant);
productVariantRoutes.patch('/recover/:id', authMiddleware, adminMiddleware, controller.recoverVariant);


