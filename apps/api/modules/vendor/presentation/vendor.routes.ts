import { Hono } from 'hono';
import { adminMiddleware } from '../../../middleware/admin';
import { authMiddleware } from '../../../middleware/auth';
import { CreateVendorModule } from '../vendor.module';

const { vendorController } = CreateVendorModule();
const vendorRoutes = new Hono();

vendorRoutes.post('/my', authMiddleware, vendorController.createMyVendor);
vendorRoutes.delete('/my', authMiddleware, vendorController.deleteMyVendor);
vendorRoutes.delete('/soft', authMiddleware, adminMiddleware, vendorController.softDeleteVendor);
vendorRoutes.patch('/recover', authMiddleware, adminMiddleware, vendorController.recoverVendor);
vendorRoutes.patch('/verify', authMiddleware, adminMiddleware, vendorController.verifyVendor);
vendorRoutes.patch(
    '/reject',
    authMiddleware,
    adminMiddleware,
    vendorController.rejectVendorVerification,
);
vendorRoutes.get('/:id', vendorController.getVendorById);
export default vendorRoutes;
