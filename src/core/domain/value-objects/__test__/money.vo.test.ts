import { describe, expect, it } from 'bun:test';
import { Money } from '../money.vo';

describe('Money', () => {
    describe('constructor', () => {
        it('creates with a positive amount', () => {
            expect(() => new Money(100)).not.toThrow();
        });

        it('creates with zero (free items)', () => {
            expect(() => new Money(0)).not.toThrow();
        });

        it('creates with a decimal amount', () => {
            expect(() => new Money(9.99)).not.toThrow();
        });

        it('throws for a negative amount', () => {
            expect(() => new Money(-1)).toThrow('Money cannot be negative.');
        });

        it('throws for -0.01 (negative cent)', () => {
            expect(() => new Money(-0.01)).toThrow('Money cannot be negative.');
        });
    });

    describe('addMoney()', () => {
        it('returns a new Money with the sum of both amounts', () => {
            const a = new Money(100);
            const b = new Money(50);
            const result = a.addMoney(b);
            expect(result.value).toBe(150);
        });

        it('adding zero returns the same amount', () => {
            const a = new Money(100);
            const b = new Money(0);
            expect(a.addMoney(b).value).toBe(100);
        });

        it('returns a new instance (immutability)', () => {
            const a = new Money(100);
            const b = new Money(50);
            const result = a.addMoney(b);
            expect(result).not.toBe(a);
        });

        it('does not mutate the original value', () => {
            const a = new Money(100);
            a.addMoney(new Money(50));
            expect(a.value).toBe(100);
        });

        it('handles decimal precision', () => {
            const a = new Money(1.1);
            const b = new Money(2.2);
            expect(a.addMoney(b).value).toBeCloseTo(3.3, 10);
        });
    });

    describe('subtractMoney()', () => {
        it('returns a new Money with the difference', () => {
            const a = new Money(100);
            const b = new Money(40);
            expect(a.subtractMoney(b).value).toBe(60);
        });

        it('returns zero when amounts are equal', () => {
            const a = new Money(50);
            const b = new Money(50);
            expect(a.subtractMoney(b).value).toBe(0);
        });

        it('throws when result would be negative', () => {
            const a = new Money(10);
            const b = new Money(20);
            expect(() => a.subtractMoney(b)).toThrow('Money cannot be negative.');
        });

        it('returns a new instance (immutability)', () => {
            const a = new Money(100);
            const b = new Money(50);
            const result = a.subtractMoney(b);
            expect(result).not.toBe(a);
        });
    });

    describe('times()', () => {
        it('multiplies the amount by the given quantity', () => {
            const price = new Money(10);
            expect(price.times(3).value).toBe(30);
        });

        it('multiplying by zero returns zero', () => {
            const price = new Money(99.99);
            expect(price.times(0).value).toBe(0);
        });

        it('multiplying by 1 returns the same amount', () => {
            const price = new Money(25);
            expect(price.times(1).value).toBe(25);
        });

        it('throws when result would be negative (negative quantity)', () => {
            const price = new Money(10);
            expect(() => price.times(-1)).toThrow('Money cannot be negative.');
        });

        it('returns a new instance (immutability)', () => {
            const price = new Money(10);
            const result = price.times(2);
            expect(result).not.toBe(price);
        });
    });

    describe('isZero', () => {
        it('returns true when amount is zero', () => {
            const money = new Money(0);
            expect(money.isZero).toBe(true);
        });

        it('returns false when amount is positive', () => {
            const money = new Money(0.01);
            expect(money.isZero).toBe(false);
        });
    });

    describe('inherited NumberVO behaviour', () => {
        it('value getter returns the raw amount', () => {
            const money = new Money(99.99);
            expect(money.value).toBe(99.99);
        });

        it('equals() compares by amount', () => {
            const a = new Money(100);
            const b = new Money(100);
            expect(a.equals(b)).toBe(true);
        });

        it('equals() returns false for different amounts', () => {
            const a = new Money(100);
            const b = new Money(200);
            expect(a.equals(b)).toBe(false);
        });

        it('greaterThan() compares amounts', () => {
            const money = new Money(100);
            expect(money.greaterThan(50)).toBe(true);
            expect(money.greaterThan(100)).toBe(false);
        });
    });
});
