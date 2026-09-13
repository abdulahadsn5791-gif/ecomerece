/**
 * Effective denormalization cadence = min(configured interval, max staleness).
 *
 * This is the "staleness backstop": even if the admin sets a very long
 * `intervalHours` (up to 672h), a full denormalization still runs at least every
 * `maxStalenessHours` (default 24h) so dashboards never show stale data.
 */
export function effectiveSyncIntervalMs(intervalHours: number, maxStalenessHours: number): number {
  const effectiveHours = Math.max(1, Math.min(intervalHours, maxStalenessHours));
  return effectiveHours * 3_600_000;
}
