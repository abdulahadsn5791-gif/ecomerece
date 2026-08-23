import { describe, expect, it } from 'bun:test';
import { EffectiveDate } from '../effective-date.vo';

const DAY_MS = 24 * 60 * 60 * 1000;
const yesterday = () => new Date(Date.now() - DAY_MS);
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS);
const daysFromNow = (n: number) => new Date(Date.now() + n * DAY_MS);

describe('EffectiveDate', () => {
    describe('constructor', () => {
        it('accepts a past date', () => {
            expect(() => new EffectiveDate(daysAgo(30))).not.toThrow();
        });

        it('accepts yesterday', () => {
            expect(() => new EffectiveDate(yesterday())).not.toThrow();
        });

        it('throws for a date in the future', () => {
            expect(() => new EffectiveDate(daysFromNow(1))).toThrow(
                'Effective date cannot be in the future.',
            );
        });

        it('throws for a far-future date', () => {
            expect(() => new EffectiveDate(daysFromNow(365))).toThrow(
                'Effective date cannot be in the future.',
            );
        });
    });

    describe('static create()', () => {
        it('creates an EffectiveDate from a past date', () => {
            const date = daysAgo(10);
            const ed = EffectiveDate.create(date);
            expect(ed).toBeInstanceOf(EffectiveDate);
            expect(ed.value.getTime()).toBe(date.getTime());
        });

        it('throws for a future date', () => {
            expect(() => EffectiveDate.create(daysFromNow(1))).toThrow(
                'Effective date cannot be in the future.',
            );
        });
    });

    describe('static today()', () => {
        it('creates an EffectiveDate without throwing', () => {
            expect(() => EffectiveDate.today()).not.toThrow();
        });

        it('returns a date that is approximately now', () => {
            const ed = EffectiveDate.today();
            const now = Date.now();
            expect(Math.abs(ed.value.getTime() - now)).toBeLessThan(1000); // within 1s
        });
    });

    describe('static fromDaysAgo()', () => {
        it('creates an EffectiveDate N days in the past', () => {
            const ed = EffectiveDate.fromDaysAgo(7);
            expect(ed).toBeInstanceOf(EffectiveDate);
        });

        it('creates a date approximately N days ago', () => {
            const ed = EffectiveDate.fromDaysAgo(5);
            const expectedTime = Date.now() - 5 * DAY_MS;
            expect(Math.abs(ed.value.getTime() - expectedTime)).toBeLessThan(1000);
        });

        it('accepts 0 days ago (today)', () => {
            expect(() => EffectiveDate.fromDaysAgo(0)).not.toThrow();
        });

        it('throws for a negative number of days', () => {
            expect(() => EffectiveDate.fromDaysAgo(-1)).toThrow('Days cannot be negative.');
        });

        it('throws for -100 days (large negative)', () => {
            expect(() => EffectiveDate.fromDaysAgo(-100)).toThrow('Days cannot be negative.');
        });
    });

    describe('subtractDays()', () => {
        it('returns a new EffectiveDate moved further into the past', () => {
            const base = EffectiveDate.fromDaysAgo(10);
            const result = base.subtractDays(5);
            expect(result).toBeInstanceOf(EffectiveDate);
        });

        it('resulting date is earlier than the original', () => {
            const base = EffectiveDate.fromDaysAgo(10);
            const result = base.subtractDays(3);
            expect(result.value.getTime()).toBeLessThan(base.value.getTime());
        });

        it('throws for 0 days', () => {
            const base = EffectiveDate.fromDaysAgo(10);
            expect(() => base.subtractDays(0)).toThrow('Days must be greater than 0.');
        });

        it('throws for negative days', () => {
            const base = EffectiveDate.fromDaysAgo(10);
            expect(() => base.subtractDays(-5)).toThrow('Days must be greater than 0.');
        });

        it('returns a new instance (immutability)', () => {
            const base = EffectiveDate.fromDaysAgo(10);
            const result = base.subtractDays(3);
            expect(result).not.toBe(base);
        });
    });

    describe('addDays()', () => {
        it('returns a new EffectiveDate moved forward in time (still in the past)', () => {
            const base = EffectiveDate.fromDaysAgo(20);
            const result = base.addDays(10); // 10 days ago — still past
            expect(result).toBeInstanceOf(EffectiveDate);
        });

        it('resulting date is later than the original', () => {
            const base = EffectiveDate.fromDaysAgo(20);
            const result = base.addDays(5);
            expect(result.value.getTime()).toBeGreaterThan(base.value.getTime());
        });

        it('throws for 0 days', () => {
            const base = EffectiveDate.fromDaysAgo(10);
            expect(() => base.addDays(0)).toThrow('Days must be greater than 0.');
        });

        it('throws for negative days', () => {
            const base = EffectiveDate.fromDaysAgo(10);
            expect(() => base.addDays(-3)).toThrow('Days must be greater than 0.');
        });

        it('throws when the result would be in the future', () => {
            const base = EffectiveDate.fromDaysAgo(3);
            // adding 10 days to 3-days-ago = 7 days in future → invalid
            expect(() => base.addDays(10)).toThrow('Effective date cannot be in the future.');
        });

        it('returns a new instance (immutability)', () => {
            const base = EffectiveDate.fromDaysAgo(20);
            const result = base.addDays(5);
            expect(result).not.toBe(base);
        });
    });

    describe('daysSince getter', () => {
        it('returns approximately N days for a date N days ago', () => {
            const ed = EffectiveDate.fromDaysAgo(5);
            expect(ed.daysSince).toBeGreaterThanOrEqual(4);
            expect(ed.daysSince).toBeLessThanOrEqual(6);
        });

        it('returns 0 for today', () => {
            const ed = EffectiveDate.today();
            expect(ed.daysSince).toBe(0);
        });

        it('returns a positive number for any past date', () => {
            const ed = EffectiveDate.fromDaysAgo(30);
            expect(ed.daysSince).toBeGreaterThanOrEqual(29);
        });
    });

    describe('hasPassedDays()', () => {
        it('returns true when daysSince >= N', () => {
            const ed = EffectiveDate.fromDaysAgo(10);
            expect(ed.hasPassedDays(10)).toBe(true);
            expect(ed.hasPassedDays(5)).toBe(true);
        });

        it('returns false when daysSince < N', () => {
            const ed = EffectiveDate.fromDaysAgo(3);
            expect(ed.hasPassedDays(10)).toBe(false);
        });

        it('returns true for 0 days (always passed 0 days)', () => {
            const ed = EffectiveDate.today();
            expect(ed.hasPassedDays(0)).toBe(true);
        });
    });

    describe('isBefore() / isAfter()', () => {
        it('isBefore returns true when this date is earlier', () => {
            const earlier = EffectiveDate.fromDaysAgo(10);
            const later = EffectiveDate.fromDaysAgo(3);
            expect(earlier.isBefore(later)).toBe(true);
        });

        it('isBefore returns false when this date is later', () => {
            const earlier = EffectiveDate.fromDaysAgo(10);
            const later = EffectiveDate.fromDaysAgo(3);
            expect(later.isBefore(earlier)).toBe(false);
        });

        it('isAfter returns true when this date is later', () => {
            const earlier = EffectiveDate.fromDaysAgo(10);
            const later = EffectiveDate.fromDaysAgo(3);
            expect(later.isAfter(earlier)).toBe(true);
        });

        it('isAfter returns false when this date is earlier', () => {
            const earlier = EffectiveDate.fromDaysAgo(10);
            const later = EffectiveDate.fromDaysAgo(3);
            expect(earlier.isAfter(later)).toBe(false);
        });

        it('isBefore returns false for two identical dates', () => {
            const ts = Date.now() - DAY_MS * 5;
            const a = new EffectiveDate(new Date(ts));
            const b = new EffectiveDate(new Date(ts));
            expect(a.isBefore(b)).toBe(false);
        });

        it('isAfter returns false for two identical dates', () => {
            const ts = Date.now() - DAY_MS * 5;
            const a = new EffectiveDate(new Date(ts));
            const b = new EffectiveDate(new Date(ts));
            expect(a.isAfter(b)).toBe(false);
        });
    });

    describe('differenceInDays()', () => {
        it('returns the approximate number of days between two dates', () => {
            const earlier = EffectiveDate.fromDaysAgo(10);
            const later = EffectiveDate.fromDaysAgo(3);
            const diff = earlier.differenceInDays(later);
            expect(diff).toBeGreaterThanOrEqual(6);
            expect(diff).toBeLessThanOrEqual(8);
        });

        it('is symmetric (absolute difference)', () => {
            const a = EffectiveDate.fromDaysAgo(10);
            const b = EffectiveDate.fromDaysAgo(3);
            expect(a.differenceInDays(b)).toBe(b.differenceInDays(a));
        });

        it('returns 0 for two identical dates', () => {
            const ts = Date.now() - DAY_MS * 5;
            const a = new EffectiveDate(new Date(ts));
            const b = new EffectiveDate(new Date(ts));
            expect(a.differenceInDays(b)).toBe(0);
        });
    });

    describe('inherited DateVO behaviour', () => {
        it('equals() compares timestamps', () => {
            const ts = Date.now() - 5 * DAY_MS;
            const a = new EffectiveDate(new Date(ts));
            const b = new EffectiveDate(new Date(ts));
            expect(a.equals(b)).toBe(true);
        });

        it('isPast is always true for a valid EffectiveDate', () => {
            const ed = EffectiveDate.fromDaysAgo(1);
            expect(ed.isPast).toBe(true);
        });

        it('toISOString() returns a valid ISO string', () => {
            const ed = EffectiveDate.fromDaysAgo(5);
            expect(ed.toISOString()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });
    });
});
