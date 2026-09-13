import { describe, expect, it } from 'bun:test';
import { effectiveSyncIntervalMs } from '../stats-sync-interval';

const HOUR = 3_600_000;

describe('effectiveSyncIntervalMs', () => {
  it('uses the configured interval when it is shorter than the staleness ceiling', () => {
    expect(effectiveSyncIntervalMs(6, 24)).toBe(6 * HOUR);
  });

  it('caps long intervals at the max-staleness backstop', () => {
    expect(effectiveSyncIntervalMs(672, 24)).toBe(24 * HOUR);
  });

  it('never schedules sooner than one hour', () => {
    expect(effectiveSyncIntervalMs(0.5, 24)).toBe(HOUR);
  });
});
