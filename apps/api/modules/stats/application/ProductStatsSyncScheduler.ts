import { ProductStatsDenormalizationRequestedEvent } from '@ecomerece/domain';
import { eventBus } from '../../../core/infrastructure/buses/in-memory-event-bus';
import { redis } from '../../../lib/redis';
import { statsSyncSettingsService } from './StatsSyncSettingsService';

const KEY_LOCK = 'stats:product:sync_lock';
const DEFAULT_TICK_MS = 60_000;

/**
 * Scheduler only *publishes* a denormalization event when work is due — it never
 * touches products or stats directly. All denormalization work happens in the
 * event handler, so a manual admin "data correction" can reuse the same pipeline.
 */
export class ProductStatsSyncScheduler {
  private timer: NodeJS.Timeout | null = null;

  start(tickMs = DEFAULT_TICK_MS): void {
    if (this.timer) return;
    this.timer = setInterval(() => void this.tick(), tickMs);
    this.timer.unref?.();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick(): Promise<void> {
    try {
      const { intervalHours, lastRun, autoDenormalizeEnabled } =
        await statsSyncSettingsService.getSettings();
      if (!autoDenormalizeEnabled) return;

      const now = Date.now();
      const intervalMs = intervalHours * 3_600_000;
      if (lastRun && now - lastRun < intervalMs) return;

      const acquired = await redis.set(KEY_LOCK, String(now), {
        NX: true,
        EX: Math.max(Math.round(intervalMs / 1000), 60),
      });
      if (!acquired) return;

      await eventBus.publish(new ProductStatsDenormalizationRequestedEvent({ force: false }));
      await statsSyncSettingsService.markRan(now);
    } catch (error) {
      console.error('[stats-sync] scheduler tick failed:', error);
    }
  }
}

export const productStatsSyncScheduler = new ProductStatsSyncScheduler();

/** Admin-triggered "data correction": publishes the same event with force:true. */
export async function triggerProductStatsDenormalization(force: boolean): Promise<void> {
  await eventBus.publish(new ProductStatsDenormalizationRequestedEvent({ force }));
  if (force) await statsSyncSettingsService.markRan();
}
