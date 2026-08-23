import { describe, expect, it } from 'bun:test';
import { Id } from '../id.vo';

const EXACTLY_5 = 'abcde';
const EXACTLY_40 = 'a'.repeat(40);
const TOO_SHORT_4 = 'abcd';
const TOO_LONG_41 = 'a'.repeat(41);

describe('Id', () => {
    describe('constructor — valid IDs', () => {
        it('creates with exactly 5 characters (minimum)', () => {
            expect(() => Id.create(EXACTLY_5)).not.toThrow();
        });

        it('creates with exactly 40 characters (maximum)', () => {
            expect(() => Id.create(EXACTLY_40)).not.toThrow();
        });

        it('creates with a typical UUID-style string', () => {
            expect(() => Id.create('abc123def456ghi7')).not.toThrow();
        });

        it('stores the value via the value property', () => {
            const id = Id.create('abc123');
            expect(id.value).toBe('abc123');
        });
    });

    describe('constructor — validation failures', () => {
        it('throws for an empty string (caught by Identifier)', () => {
            expect(() => Id.create('')).toThrow('Identifier cannot be empty.');
        });

        it('throws for null (caught by Identifier, bypassing TypeScript)', () => {
            expect(() => Id.create(null as unknown as string)).toThrow(
                'Identifier cannot be empty.',
            );
        });

        it('throws for undefined (caught by Identifier, bypassing TypeScript)', () => {
            expect(() => Id.create(undefined as unknown as string)).toThrow(
                'Identifier cannot be empty.',
            );
        });

        it('throws for a 4-character string (too short)', () => {
            expect(() => Id.create(TOO_SHORT_4)).toThrow('Id too short.');
        });

        it('throws for a single character', () => {
            expect(() => Id.create('x')).toThrow('Id too short.');
        });

        it('throws for a 41-character string (too long)', () => {
            expect(() => Id.create(TOO_LONG_41)).toThrow('Id too long');
        });
    });

    describe('boundary values', () => {
        it('rejects 4 characters (one below minimum)', () => {
            expect(() => Id.create(TOO_SHORT_4)).toThrow();
        });

        it('accepts 5 characters (lower boundary)', () => {
            expect(() => Id.create(EXACTLY_5)).not.toThrow();
        });

        it('accepts 40 characters (upper boundary)', () => {
            expect(() => Id.create(EXACTLY_40)).not.toThrow();
        });

        it('rejects 41 characters (one above maximum)', () => {
            expect(() => Id.create(TOO_LONG_41)).toThrow();
        });
    });

    describe('static create()', () => {
        it('returns an Id instance', () => {
            const id = Id.create('abc123');
            expect(id).toBeInstanceOf(Id);
        });

        it('propagates too-short validation error', () => {
            expect(() => Id.create('ab')).toThrow('Id too short.');
        });

        it('propagates too-long validation error', () => {
            expect(() => Id.create(TOO_LONG_41)).toThrow('Id too long');
        });
    });

    describe('inherited Identifier behaviour', () => {
        it('equals() returns true for same value and same constructor', () => {
            const a = Id.create('abc123');
            const b = Id.create('abc123');
            expect(a.equals(b)).toBe(true);
        });

        it('equals() returns false for different values', () => {
            const a = Id.create('abc123');
            const b = Id.create('xyz789');
            expect(a.equals(b)).toBe(false);
        });

        it('equals() returns false for null', () => {
            const a = Id.create('abc123');
            // @ts-expect-error – intentionally testing runtime null handling
            expect(a.equals(null)).toBe(false);
        });

        it('equals() returns false for undefined', () => {
            const a = Id.create('abc123');

            expect(a.equals(undefined)).toBe(false);
        });

        it('toString() returns the ID as a string', () => {
            const id = Id.create('abc123');
            expect(id.toString()).toBe('abc123');
        });
    });

    describe('edge cases', () => {
        it('accepts exactly 6 characters', () => {
            expect(() => Id.create('abcdef')).not.toThrow();
        });

        it('accepts exactly 39 characters', () => {
            expect(() => Id.create('a'.repeat(39))).not.toThrow();
        });

        it('accepts IDs containing numbers', () => {
            expect(() => Id.create('12345')).not.toThrow();
        });

        it('accepts mixed alphanumeric IDs', () => {
            expect(() => Id.create('abc123XYZ')).not.toThrow();
        });

        it('accepts IDs containing dashes', () => {
            expect(() => Id.create('abcde-fghij')).not.toThrow();
        });

        it('accepts UUID formatted IDs', () => {
            expect(() => Id.create('550e8400-e29b-41d4-a716-446655440000')).not.toThrow();
        });

        it('rejects boolean values', () => {
            expect(() => Id.create(true as unknown as string)).toThrow('Id must be a string');
        });

        it('rejects numeric values', () => {
            expect(() => Id.create(12345 as unknown as string)).toThrow('Id must be a string');
        });

        it('rejects object values', () => {
            expect(() => Id.create({} as unknown as string)).toThrow('Id must be a string');
        });

        it('rejects array values', () => {
            expect(() => Id.create([] as unknown as string)).toThrow('Id must be a string');
        });

        it('returns identical value from getter', () => {
            const id = Id.create('abcdef');
            expect(id.value).toBe('abcdef');
            expect(id.value).toStrictEqual('abcdef');
        });

        it('equals is reflexive', () => {
            const id = Id.create('abcdef');
            expect(id.equals(id)).toBe(true);
        });

        it('equals distinguishes different values', () => {
            expect(Id.create('abcde').equals(Id.create('abcdf'))).toBe(false);
        });

        it('create returns a new instance every time', () => {
            const a = Id.create('abcde');
            const b = Id.create('abcde');
            expect(a).not.toBe(b);
            expect(a.equals(b)).toBe(true);
        });

        it('toString returns exactly the original ID', () => {
            const value = '550e8400-e29b-41d4-a716-446655440000';
            expect(Id.create(value).toString()).toBe(value);
        });

        it('can be used as a Map key through toString()', () => {
            const id = Id.create('abcde');
            const map = new Map<string, number>();
            map.set(id.toString(), 1);
            expect(map.get('abcde')).toBe(1);
        });
    });
});
