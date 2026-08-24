import { describe, expect, it } from 'bun:test';

import { Identifier } from '../identifier-vo';
import { BadRequestError } from '../../../../apps/api/errors/app-error';

class StringIdentifier extends Identifier<string> {
    constructor(value: string) {
        super(value);
    }
}

class NumberIdentifier extends Identifier<number> {
    constructor(value: number) {
        super(value);
    }
}

class AnotherStringIdentifier extends Identifier<string> {
    constructor(value: string) {
        super(value);
    }
}

describe('Identifier', () => {
    describe('constructor', () => {
        it('creates successfully with a non-empty string', () => {
            expect(() => new StringIdentifier('abc123')).not.toThrow();
        });

        it('creates successfully with a positive number', () => {
            expect(() => new NumberIdentifier(42)).not.toThrow();
        });

        it('throws for an empty string', () => {
            expect(() => new StringIdentifier('')).toThrow(BadRequestError);
            expect(() => new StringIdentifier('')).toThrow('Identifier cannot be empty.');
        });

        it('throws when null is passed', () => {
            // Bypass TypeScript to test runtime validation
            expect(() => new StringIdentifier(null as unknown as string)).toThrow(BadRequestError);
        });

        it('throws when undefined is passed', () => {
            expect(() => new StringIdentifier(undefined as unknown as string)).toThrow(
                BadRequestError,
            );
        });

        it('allows zero as a numeric identifier', () => {
            expect(() => new NumberIdentifier(0)).not.toThrow();
        });
    });

    describe('value getter', () => {
        it('returns the stored string value', () => {
            const id = new StringIdentifier('abc');
            expect(id.value).toBe('abc');
        });

        it('returns the stored numeric value', () => {
            const id = new NumberIdentifier(99);
            expect(id.value).toBe(99);
        });
    });

    describe('equals()', () => {
        it('returns true for same constructor and same value', () => {
            const a = new StringIdentifier('abc');
            const b = new StringIdentifier('abc');
            expect(a.equals(b)).toBe(true);
        });

        it('returns false for same constructor but different value', () => {
            const a = new StringIdentifier('abc');
            const b = new StringIdentifier('xyz');
            expect(a.equals(b)).toBe(false);
        });

        it('returns false for different constructors even with same value', () => {
            const a = new StringIdentifier('abc');
            const b = new AnotherStringIdentifier('abc');
            expect(a.equals(b)).toBe(false);
        });

        it('returns false when compared to null', () => {
            const id = new StringIdentifier('abc');
            expect(id.equals(null)).toBe(false);
        });

        it('returns false when compared to undefined', () => {
            const id = new StringIdentifier('abc');
            expect(id.equals(undefined)).toBe(false);
        });

        it('returns false when compared with a plain object', () => {
            const id = new StringIdentifier('abc');
            expect(id.equals({ value: 'abc' })).toBe(false);
        });

        it('returns false when compared with a primitive string', () => {
            const id = new StringIdentifier('abc');
            expect(id.equals('abc')).toBe(false);
        });

        it('returns true for two numeric identifiers with same value', () => {
            const a = new NumberIdentifier(42);
            const b = new NumberIdentifier(42);
            expect(a.equals(b)).toBe(true);
        });

        it('is reflexive', () => {
            const id = new StringIdentifier('abc');
            expect(id.equals(id)).toBe(true);
        });

        it('is symmetric', () => {
            const a = new StringIdentifier('abc');
            const b = new StringIdentifier('abc');
            expect(a.equals(b)).toBe(true);
            expect(b.equals(a)).toBe(true);
        });
    });

    describe('toString()', () => {
        it('returns the string identifier', () => {
            const id = new StringIdentifier('abc');
            expect(id.toString()).toBe('abc');
        });

        it('converts numeric identifier to string', () => {
            const id = new NumberIdentifier(42);
            expect(id.toString()).toBe('42');
        });

        it('always matches String(value)', () => {
            const id = new NumberIdentifier(999);
            expect(id.toString()).toBe(String(id.value));
        });
    });

    describe('edge cases', () => {
        it('allows whitespace-only strings', () => {
            expect(() => new StringIdentifier('   ')).not.toThrow();
        });

        it('allows negative numbers', () => {
            expect(() => new NumberIdentifier(-1)).not.toThrow();
        });

        it('allows floating point numbers', () => {
            expect(() => new NumberIdentifier(3.14)).not.toThrow();
        });

        it('allows Number.MAX_SAFE_INTEGER', () => {
            expect(() => new NumberIdentifier(Number.MAX_SAFE_INTEGER)).not.toThrow();
        });

        it('allows Number.MIN_SAFE_INTEGER', () => {
            expect(() => new NumberIdentifier(Number.MIN_SAFE_INTEGER)).not.toThrow();
        });

        it('returns the same value on multiple getter calls', () => {
            const id = new StringIdentifier('abc');
            expect(id.value).toBe('abc');
            expect(id.value).toBe('abc');
            expect(id.value).toBe('abc');
        });
    });
});
