import { buildStatKey, expandToStatEvents } from '@ecomerece/domain';
import type { StatEvent, TrackInput } from '@ecomerece/shared';
import { statsRepository } from '../infrastructure/StatsRepository';

// Safety valve: if the buffer grows past this because the DB is slow/down,
// force an early flush instead of letting memory grow unbounded.
const MAX_BUFFER_SIZE = 50_000;

export class StatsBufferService {
  private buffer = new Map<string, StatEvent>();
  private flushTimer: NodeJS.Timeout | null = null;
  private flushing = false;

  /**
   * Single entry point for the rest of the app. Fans out across every
   * aggregation level automatically — callers never think about hourly vs.
   * daily vs. lifetime, they just describe what happened.
   */
  public track(input: TrackInput): void {
    for (const event of expandToStatEvents(input)) {
      this.accumulate(event);
    }

    if (this.buffer.size >= MAX_BUFFER_SIZE) {
      void this.flush(); // apply backpressure rather than growing further
    }
  }

  private accumulate(event: StatEvent): void {
    const key = buildStatKey(event);
    const existing = this.buffer.get(key);

    if (!existing) {
      this.buffer.set(key, { ...event, metrics: { ...event.metrics } });
      return;
    }

    for (const [metric, value] of Object.entries(event.metrics)) {
      const k = metric as keyof StatEvent['metrics'];
      existing.metrics[k] = (existing.metrics[k] || 0) + (value || 0);
    }
  }

  public async flush(): Promise<void> {
    if (this.flushing || this.buffer.size === 0) return;
    this.flushing = true;

    // Swap the map reference (not clear()) so any track() calls that happen
    // while the write is in flight land in a brand-new buffer instead of
    // racing with the batch currently being persisted.
    const batch = this.buffer;
    this.buffer = new Map();

    try {
      await statsRepository.bulkUpsert(Array.from(batch.values()));
    } catch (error) {
      console.error('[stats] flush failed, re-queuing batch for retry on next tick:', error);
      // Zero data loss: merge the failed batch back into the live buffer
      // instead of dropping it, so the next flush attempt picks it up.
      for (const event of batch.values()) this.accumulate(event);
    } finally {
      this.flushing = false;
    }
  }

  public startBackgroundFlushing(intervalMs = 5000): void {
    if (this.flushTimer) return;
    this.flushTimer = setInterval(() => void this.flush(), intervalMs);
    this.flushTimer.unref?.(); // don't keep the process alive just for this timer
  }

  public stopBackgroundFlushing(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /** Call during graceful shutdown (SIGTERM/SIGINT) so nothing in memory is lost. */
  public async shutdown(): Promise<void> {
    this.stopBackgroundFlushing();
    await this.flush();
  }

  /** Exposed for a health/metrics endpoint — lets you see buffer pressure in prod. */
  public get pendingCount(): number {
    return this.buffer.size;
  }
}

// Singleton: the whole app shares one buffer so increments actually accumulate.
export const statsBufferService = new StatsBufferService();
