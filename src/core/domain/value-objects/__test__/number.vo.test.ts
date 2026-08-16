import { describe, expect, it } from 'bun:test';
import { NumberVO } from '../number.vo';

class ConcreteNumberVO extends NumberVO {}

describe('NumberVO', () => {
    describe('value getter', () => {
        it('returns the stored number', () => {
            const vo = new ConcreteNumberVO(42);
            expect(vo.value).toBe(42);
        });

        it('stores zero', () => {
            const vo = new ConcreteNumberVO(0);
            expect(vo.value).toBe(0);
        });

        it('stores negative numbers', () => {
            const vo = new ConcreteNumberVO(-10);
            expect(vo.value).toBe(-10);
        });

        it('stores decimal numbers', () => {
            const vo = new ConcreteNumberVO(3.14);
            expect(vo.value).toBe(3.14);
        });
    });

    describe('equals()', () => {
        it('returns true for the same numeric value', () => {
            const a = new ConcreteNumberVO(10);
            const b = new ConcreteNumberVO(10);
            expect(a.equals(b)).toBe(true);
        });

        it('returns false for different numeric values', () => {
            const a = new ConcreteNumberVO(10);
            const b = new ConcreteNumberVO(20);
            expect(a.equals(b)).toBe(false);
        });

        it('returns true for two zeros', () => {
            const a = new ConcreteNumberVO(0);
            const b = new ConcreteNumberVO(0);
            expect(a.equals(b)).toBe(true);
        });

        it('distinguishes between positive and negative', () => {
            const a = new ConcreteNumberVO(5);
            const b = new ConcreteNumberVO(-5);
            expect(a.equals(b)).toBe(false);
        });
    });

    describe('greaterThan()', () => {
        it('returns true when value is strictly greater', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.greaterThan(5)).toBe(true);
        });

        it('returns false when value is equal', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.greaterThan(10)).toBe(false);
        });

        it('returns false when value is less', () => {
            const vo = new ConcreteNumberVO(5);
            expect(vo.greaterThan(10)).toBe(false);
        });
    });

    describe('lessThan()', () => {
        it('returns true when value is strictly less', () => {
            const vo = new ConcreteNumberVO(5);
            expect(vo.lessThan(10)).toBe(true);
        });

        it('returns false when value is equal', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.lessThan(10)).toBe(false);
        });

        it('returns false when value is greater', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.lessThan(5)).toBe(false);
        });
    });

    describe('add()', () => {
        it('returns the sum', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.add(5)).toBe(15);
        });

        it('adds a negative number (subtraction)', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.add(-3)).toBe(7);
        });

        it('adds zero without change', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.add(0)).toBe(10);
        });
    });

    describe('subtract()', () => {
        it('returns the difference', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.subtract(3)).toBe(7);
        });

        it('returns negative when subtracting a larger number', () => {
            const vo = new ConcreteNumberVO(5);
            expect(vo.subtract(10)).toBe(-5);
        });

        it('returns zero when subtracting the same value', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.subtract(10)).toBe(0);
        });
    });

    describe('multiply()', () => {
        it('returns the product', () => {
            const vo = new ConcreteNumberVO(4);
            expect(vo.multiply(3)).toBe(12);
        });

        it('multiplies by zero returns zero', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.multiply(0)).toBe(0);
        });

        it('multiplies by negative inverts sign', () => {
            const vo = new ConcreteNumberVO(5);
            expect(vo.multiply(-2)).toBe(-10);
        });
    });

    describe('divide()', () => {
        it('returns the quotient', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.divide(2)).toBe(5);
        });

        it('returns a decimal for non-integer division', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.divide(3)).toBeCloseTo(3.333, 3);
        });

        it('returns Infinity when dividing by zero', () => {
            const vo = new ConcreteNumberVO(10);
            expect(vo.divide(0)).toBe(Infinity);
        });
    });

    describe('toString()', () => {
        it('returns the numeric value as a string', () => {
            const vo = new ConcreteNumberVO(42);
            expect(vo.toString()).toBe('42');
        });

        it('converts zero to "0"', () => {
            const vo = new ConcreteNumberVO(0);
            expect(vo.toString()).toBe('0');
        });

        it('converts decimals correctly', () => {
            const vo = new ConcreteNumberVO(3.14);
            expect(vo.toString()).toBe('3.14');
        });
    });
});
