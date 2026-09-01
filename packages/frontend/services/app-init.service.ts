import { BaseService } from './base.service';
import { storageAdapter } from '@ecomerece/frontend/storage';


export class AppInitService extends BaseService {
    constructor() {
        super('app-init-service');
    }

    private get statusContainer() {
        return this.getContainer<{ isReady: boolean }>('status', { autoError: true });
    }

    public async bootstrap(tasks: Array<() => Promise<any>>): Promise<void> {
        const container = this.statusContainer;

        // Prevent double-booting if already ready or loading
        if (container.getState().isLoading || container.getState().data?.isReady) {
            return;
        }

        container.setLoading(true);

        try {
            await storageAdapter.ensureReady();
            // Run all async boot tasks (auth sync, theme load, etc.) concurrently
            await Promise.allSettled(tasks.map((task) => task()));
            container.setData({ isReady: true });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Application initialization failed';
            container.setError(message);
        } finally {
            container.setLoading(false);
        }
    }
}