import { describe, expect, it } from 'bun:test';
import { Quantity } from '../quantity.vo';

describe('Quantity', () => {
    describe('constructor', () => {
        it('creates with a positive quantity', () => {
            expect(() => new Quantity(10)).not.toThrow();
        });

        it('creates with zero (valid empty stock)', () => {
            expect(() => new Quantity(0)).not.toThrow();
        });

        it('throws for a negative quantity', () => {
            expect(() => new Quantity(-1)).toThrow('Quantity cannot be negative.');
        });

        it('throws for a negative decimal', () => {
            expect(() => new Quantity(-0.5)).toThrow('Quantity cannot be negative.');
        });
    });

    describe('increase()', () => {
        it('returns a new Quantity increased by the given amount', () => {
            const qty = new Quantity(10);
            expect(qty.increase(5).value).toBe(15);
        });

        it('returns a new instance (immutability)', () => {
            const qty = new Quantity(10);
            const result = qty.increase(5);
            expect(result).not.toBe(qty);
        });

        it('does not mutate the original', () => {
            const qty = new Quantity(10);
            qty.increase(5);
            expect(qty.value).toBe(10);
        });

        it('increases by zero keeps the same value', () => {
            const qty = new Quantity(10);
            expect(qty.increase(0).value).toBe(10);
        });
    });

    describe('decrease()', () => {
        it('returns a new Quantity decreased by the given amount', () => {
            const qty = new Quantity(10);
            expect(qty.decrease(3).value).toBe(7);
        });

        it('returns a new instance (immutability)', () => {
            const qty = new Quantity(10);
            const result = qty.decrease(3);
            expect(result).not.toBe(qty);
        });

        it('does not mutate the original', () => {
            const qty = new Quantity(10);
            qty.decrease(3);
            expect(qty.value).toBe(10);
        });

        it('allows decreasing to exactly zero', () => {
            const qty = new Quantity(5);
            expect(qty.decrease(5).value).toBe(0);
        });

        it('throws when decrease amount exceeds the current quantity', () => {
            const qty = new Quantity(5);
            expect(() => qty.decrease(6)).toThrow('Insufficient quantity.');
        });

        it('throws when decreasing from zero', () => {
            const qty = new Quantity(0);
            expect(() => qty.decrease(1)).toThrow('Insufficient quantity.');
        });
    });

    describe('isZero', () => {
        it('returns true when quantity is zero', () => {
            const qty = new Quantity(0);
            expect(qty.isZero).toBe(true);
        });

        it('returns false when quantity is positive', () => {
            const qty = new Quantity(1);
            expect(qty.isZero).toBe(false);
        });
    });

    describe('inherited NumberVO behaviour', () => {
        it('value getter returns the raw quantity', () => {
            const qty = new Quantity(42);
            expect(qty.value).toBe(42);
        });

        it('equals() compares by value', () => {
            const a = new Quantity(10);
            const b = new Quantity(10);
            expect(a.equals(b)).toBe(true);
        });

        it('greaterThan() and lessThan() work as expected', () => {
            const qty = new Quantity(5);
            expect(qty.greaterThan(3)).toBe(true);
            expect(qty.lessThan(10)).toBe(true);
        });
    });
});
