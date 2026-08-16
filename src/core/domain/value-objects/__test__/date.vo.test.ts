import { describe, expect, it } from 'bun:test';
import { DateVO } from '../date.vo';

class ConcreteDateVO extends DateVO {}

const PAST_DATE = new Date('2000-01-01T00:00:00.000Z');
const FUTURE_DATE = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000); // 10 years from now

describe('DateVO', () => {
    describe('value getter', () => {
        it('returns the stored Date object', () => {
            const vo = new ConcreteDateVO(PAST_DATE);
            expect(vo.value).toEqual(PAST_DATE);
        });
    });

    describe('equals()', () => {
        it('returns true for two dates with the same timestamp', () => {
            const d = new Date('2023-06-15T12:00:00.000Z');
            const a = new ConcreteDateVO(d);
            const b = new ConcreteDateVO(new Date(d.getTime()));
            expect(a.equals(b)).toBe(true);
        });

        it('returns false for different timestamps', () => {
            const a = new ConcreteDateVO(new Date('2023-01-01'));
            const b = new ConcreteDateVO(new Date('2023-01-02'));
            expect(a.equals(b)).toBe(false);
        });

        it('compares by time, not by object reference', () => {
            const time = Date.now();
            const a = new ConcreteDateVO(new Date(time));
            const b = new ConcreteDateVO(new Date(time));
            expect(a.equals(b)).toBe(true);
        });
    });

    describe('before()', () => {
        it('returns true when the date is before the given date', () => {
            const vo = new ConcreteDateVO(PAST_DATE);
            expect(vo.before(new Date())).toBe(true);
        });

        it('returns false when the date is after the given date', () => {
            const vo = new ConcreteDateVO(FUTURE_DATE);
            expect(vo.before(new Date())).toBe(false);
        });

        it('returns false when dates are equal', () => {
            const d = new Date('2023-06-15T12:00:00.000Z');
            const vo = new ConcreteDateVO(d);
            expect(vo.before(d)).toBe(false);
        });
    });

    describe('after()', () => {
        it('returns true when the date is after the given date', () => {
            const vo = new ConcreteDateVO(FUTURE_DATE);
            expect(vo.after(new Date())).toBe(true);
        });

        it('returns false when the date is before the given date', () => {
            const vo = new ConcreteDateVO(PAST_DATE);
            expect(vo.after(new Date())).toBe(false);
        });

        it('returns false when dates are equal', () => {
            const d = new Date('2023-06-15T12:00:00.000Z');
            const vo = new ConcreteDateVO(d);
            expect(vo.after(d)).toBe(false);
        });
    });

    describe('isPast', () => {
        it('returns true for a date in the past', () => {
            const vo = new ConcreteDateVO(PAST_DATE);
            expect(vo.isPast).toBe(true);
        });

        it('returns false for a date in the future', () => {
            const vo = new ConcreteDateVO(FUTURE_DATE);
            expect(vo.isPast).toBe(false);
        });
    });

    describe('isFuture', () => {
        it('returns true for a date in the future', () => {
            const vo = new ConcreteDateVO(FUTURE_DATE);
            expect(vo.isFuture).toBe(true);
        });

        it('returns false for a date in the past', () => {
            const vo = new ConcreteDateVO(PAST_DATE);
            expect(vo.isFuture).toBe(false);
        });
    });

    describe('timestamp', () => {
        it('returns the milliseconds since epoch', () => {
            const d = new Date('2023-06-15T12:00:00.000Z');
            const vo = new ConcreteDateVO(d);
            expect(vo.timestamp).toBe(d.getTime());
        });
    });

    describe('toISOString()', () => {
        it('returns an ISO 8601 formatted string', () => {
            const d = new Date('2023-06-15T12:00:00.000Z');
            const vo = new ConcreteDateVO(d);
            expect(vo.toISOString()).toBe('2023-06-15T12:00:00.000Z');
        });
    });
});
