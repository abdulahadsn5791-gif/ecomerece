import { Hono } from 'hono';
import { adminMiddleware } from '../../../middleware/admin';
import { authMiddleware } from '../../../middleware/auth';
import { createHomeModule } from '../home.module';

export const homeRoutes = new Hono();
const { homeController } = createHomeModule();

// Public Read
homeRoutes.get('/', homeController.getHome);

// Admin Writes (Protected)
homeRoutes.post('/categories', authMiddleware, adminMiddleware, homeController.addCategory);
homeRoutes.delete('/categories', authMiddleware, adminMiddleware, homeController.removeCategory);

homeRoutes.post('/slides', authMiddleware, adminMiddleware, homeController.addSlide);
homeRoutes.delete('/slides', authMiddleware, adminMiddleware, homeController.removeSlide);
homeRoutes.patch('/slides/reorder', authMiddleware, adminMiddleware, homeController.reorderSlides);

homeRoutes.post('/promos', authMiddleware, adminMiddleware, homeController.addPromo);
homeRoutes.delete('/promos', authMiddleware, adminMiddleware, homeController.removePromo);

homeRoutes.post('/containers', authMiddleware, adminMiddleware, homeController.addContainer);
homeRoutes.patch('/containers', authMiddleware, adminMiddleware, homeController.updateContainer);
homeRoutes.delete('/containers', authMiddleware, adminMiddleware, homeController.removeContainer);
homeRoutes.patch('/containers/reorder', authMiddleware, adminMiddleware, homeController.reorderContainers);

export default homeRoutes;