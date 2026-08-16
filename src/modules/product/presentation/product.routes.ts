import { Hono } from 'hono';
import { adminMiddleware } from '../../../middleware/admin';
import { authMiddleware } from '../../../middleware/auth';
import { createProductModule } from '../product.module';

export const productRoutes = new Hono();

const { productController } = createProductModule();

productRoutes.get('/:id', productController.getProductById);
productRoutes.post(`/my`, authMiddleware, productController.createMyProudct);
productRoutes.delete(`/my`, authMiddleware, productController.softDeleteMyProduct);
productRoutes.patch(`/recover/my`, authMiddleware, productController.recoverMyProduct);
productRoutes.post(`/block`, authMiddleware, adminMiddleware, productController.blockProduct);
productRoutes.post(`/unblock`, authMiddleware, adminMiddleware, productController.unBlockProduct);
productRoutes.patch(`/state/public/my`, authMiddleware, productController.makeMyProductPublic);
productRoutes.patch(`/state/private/my`, authMiddleware, productController.makeMyProductPrivate);
productRoutes.patch(`/meta/my`, authMiddleware, productController.updateMyProductMeta);
productRoutes.patch(
    `/disclaimer/toggle/my`,
    authMiddleware,
    productController.toggleMyProductDisclaimer,
);
productRoutes.patch(
    `/disclaimer/add/my`,
    authMiddleware,
    productController.addMyProductDisclaimers,
);
productRoutes.patch(
    `/disclaimer/remove/my`,
    authMiddleware,
    productController.removeMyProductDisclaimers,
);
productRoutes.patch(`/images/add/my`, authMiddleware, productController.addMyProductImages);
productRoutes.patch(`/images/remove/my`, authMiddleware, productController.removeMyProductImages);
productRoutes.patch(
    `/images/default/my`,
    authMiddleware,
    productController.setMyProductDefaultImage,
);
productRoutes.patch(
    `/ingrediants/toggle/my`,
    authMiddleware,
    productController.toggleMyProductIngredients,
);
productRoutes.patch(
    `/ingrediants/add/my`,
    authMiddleware,
    productController.addMyProductIngredients,
);
productRoutes.patch(
    `/ingrediants/remove/my`,
    authMiddleware,
    productController.removeMyProductIngredients,
);
