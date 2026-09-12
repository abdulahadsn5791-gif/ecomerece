import { redis } from '../../../lib/redis';

const KEY_INTERVAL = 'stats:product:sync_interval_hours';
const KEY_LAST_RUN = 'stats:product:sync_last_run';
const KEY_AUTO_ENABLED = 'stats:product:sync_auto_enabled';

const DEFAULT_INTERVAL_HOURS = 6;

export interface StatsSyncSettings {
  intervalHours: number;
  lastRun: number | null;
  autoDenormalizeEnabled: boolean;
}

export class StatsSyncSettingsService {
  async getSettings(): Promise<StatsSyncSettings> {
    const [intervalHoursRaw, lastRunRaw, autoEnabledRaw] = await Promise.all([
      redis.get(KEY_INTERVAL),
      redis.get(KEY_LAST_RUN),
      redis.get(KEY_AUTO_ENABLED),
    ]);

    const intervalHours = intervalHoursRaw ? Number(intervalHoursRaw) : DEFAULT_INTERVAL_HOURS;
    const lastRun = lastRunRaw ? Number(lastRunRaw) : null;
    const autoDenormalizeEnabled = autoEnabledRaw === null ? true : autoEnabledRaw === '1';

    return { intervalHours, lastRun, autoDenormalizeEnabled };
  }

  async update(input: {
    intervalHours?: number;
    autoDenormalizeEnabled?: boolean;
  }): Promise<StatsSyncSettings> {
    const current = await this.getSettings();
    const next = {
      intervalHours: input.intervalHours ?? current.intervalHours,
      autoDenormalizeEnabled: input.autoDenormalizeEnabled ?? current.autoDenormalizeEnabled,
    };

    await Promise.all([
      redis.set(KEY_INTERVAL, String(next.intervalHours)),
      redis.set(KEY_AUTO_ENABLED, next.autoDenormalizeEnabled ? '1' : '0'),
    ]);

    return { ...next, lastRun: current.lastRun };
  }

  async markRan(timestamp = Date.now()): Promise<void> {
    await redis.set(KEY_LAST_RUN, String(timestamp));
  }
}

export const statsSyncSettingsService = new StatsSyncSettingsService();
