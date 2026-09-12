import { Hono } from 'hono';
import { CreateStatsModule } from '../stats.module';

const { statsController } = CreateStatsModule();

export const statsRouter = new Hono();

statsRouter.post('/products/:productId/view', statsController.recordProductView);
statsRouter.post('/products/:productId/click', statsController.recordProductClick);
statsRouter.post('/categories/:categoryId/view', statsController.recordCategoryView);
statsRouter.post('/pages/:pageKey/view', statsController.recordPageView);

statsRouter.get('/:entityType/:entityId/lifetime', statsController.getLifetimeStats);
statsRouter.get('/:entityType/:entityId/timeseries', statsController.getTimeSeries);
statsRouter.get('/:entityType/top', statsController.getTopEntities);

statsRouter.get('/_health', statsController.getHealth);
