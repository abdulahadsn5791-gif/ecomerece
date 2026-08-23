import { describe, expect, it } from 'bun:test';
import { Percentage } from '../percentage.vo';

describe('Percentage', () => {
    describe('constructor — valid values', () => {
        it('creates with exactly 0 (minimum)', () => {
            expect(() => new Percentage(0)).not.toThrow();
        });

        it('creates with exactly 100 (maximum)', () => {
            expect(() => new Percentage(100)).not.toThrow();
        });

        it('creates with a mid-range value', () => {
            expect(() => new Percentage(50)).not.toThrow();
        });

        it('creates with a decimal value', () => {
            expect(() => new Percentage(33.33)).not.toThrow();
        });

        it('creates with 1 (smallest practical positive)', () => {
            expect(() => new Percentage(1)).not.toThrow();
        });

        it('creates with 99 (just below maximum)', () => {
            expect(() => new Percentage(99)).not.toThrow();
        });
    });

    describe('constructor — out-of-range values', () => {
        it('throws for a value below 0', () => {
            expect(() => new Percentage(-1)).toThrow('Percentage must be between 0 and 100.');
        });

        it('throws for a value above 100', () => {
            expect(() => new Percentage(101)).toThrow('Percentage must be between 0 and 100.');
        });

        it('throws for a large negative number', () => {
            expect(() => new Percentage(-100)).toThrow('Percentage must be between 0 and 100.');
        });

        it('throws for a small decimal below 0', () => {
            expect(() => new Percentage(-0.01)).toThrow('Percentage must be between 0 and 100.');
        });

        it('throws for 100.01 (just above maximum)', () => {
            expect(() => new Percentage(100.01)).toThrow('Percentage must be between 0 and 100.');
        });
    });

    describe('apply()', () => {
        it('calculates 50% of 200', () => {
            const pct = new Percentage(50);
            expect(pct.apply(200)).toBe(100);
        });

        it('calculates 10% of 500', () => {
            const pct = new Percentage(10);
            expect(pct.apply(500)).toBe(50);
        });

        it('returns 0 for 0% of any amount', () => {
            const pct = new Percentage(0);
            expect(pct.apply(1000)).toBe(0);
        });

        it('returns the full amount for 100%', () => {
            const pct = new Percentage(100);
            expect(pct.apply(250)).toBe(250);
        });

        it('applies 0% to zero returns 0', () => {
            const pct = new Percentage(0);
            expect(pct.apply(0)).toBe(0);
        });

        it('handles decimal percentages', () => {
            const pct = new Percentage(33.33);
            expect(pct.apply(300)).toBeCloseTo(99.99, 2);
        });
    });

    describe('inherited NumberVO behaviour', () => {
        it('value getter returns the raw percentage number', () => {
            const pct = new Percentage(75);
            expect(pct.value).toBe(75);
        });

        it('equals() compares percentage values', () => {
            const a = new Percentage(50);
            const b = new Percentage(50);
            expect(a.equals(b)).toBe(true);
        });

        it('greaterThan() works as expected', () => {
            const pct = new Percentage(80);
            expect(pct.greaterThan(50)).toBe(true);
            expect(pct.greaterThan(80)).toBe(false);
        });
    });
});
