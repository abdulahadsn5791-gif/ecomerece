import { describe, expect, it } from 'bun:test';
import { Reason } from '../reason.vo';

const EXACTLY_10 = '1234567890';
const EXACTLY_100 = 'a'.repeat(100);
const TOO_SHORT_9 = '123456789';
const TOO_LONG_101 = 'a'.repeat(101);
const VALID_REASON = 'Customer requested a refund for defective product.';

describe('Reason', () => {
    describe('constructor — valid reasons', () => {
        it('creates with exactly 10 characters', () => {
            expect(() => new Reason(EXACTLY_10)).not.toThrow();
        });

        it('creates with exactly 100 characters', () => {
            expect(() => new Reason(EXACTLY_100)).not.toThrow();
        });

        it('creates with a typical reason string', () => {
            const reason = new Reason(VALID_REASON);
            expect(reason.value).toBe(VALID_REASON);
        });
    });

    describe('constructor — validation failures', () => {
        it('throws for empty string (caught by StringVO)', () => {
            expect(() => new Reason('')).toThrow();
        });

        it('throws for whitespace-only string (caught by StringVO)', () => {
            expect(() => new Reason('   ')).toThrow();
        });

        it('throws when value is fewer than 10 characters', () => {
            expect(() => new Reason(TOO_SHORT_9)).toThrow('Reason too short.');
        });

        it('throws for a single word under 10 chars', () => {
            expect(() => new Reason('Short')).toThrow('Reason too short.');
        });

        it('throws when value exceeds 100 characters', () => {
            expect(() => new Reason(TOO_LONG_101)).toThrow('Reason too long');
        });
    });

    describe('boundary values', () => {
        it('rejects 9 characters (one below lower bound)', () => {
            expect(() => new Reason(TOO_SHORT_9)).toThrow();
        });

        it('accepts 10 characters (lower boundary)', () => {
            expect(() => new Reason(EXACTLY_10)).not.toThrow();
        });

        it('accepts 100 characters (upper boundary)', () => {
            expect(() => new Reason(EXACTLY_100)).not.toThrow();
        });

        it('rejects 101 characters (one above upper bound)', () => {
            expect(() => new Reason(TOO_LONG_101)).toThrow();
        });
    });

    describe('static create()', () => {
        it('returns a Reason instance', () => {
            const reason = Reason.create(VALID_REASON);
            expect(reason).toBeInstanceOf(Reason);
        });

        it('propagates too-short error', () => {
            expect(() => Reason.create('Short')).toThrow('Reason too short.');
        });

        it('propagates too-long error', () => {
            expect(() => Reason.create(TOO_LONG_101)).toThrow('Reason too long');
        });
    });

    describe('inherited StringVO behaviour', () => {
        it('value getter returns the raw reason', () => {
            const reason = new Reason(VALID_REASON);
            expect(reason.value).toBe(VALID_REASON);
        });

        it('equals() compares two Reason instances', () => {
            const a = new Reason(VALID_REASON);
            const b = new Reason(VALID_REASON);
            expect(a.equals(b)).toBe(true);
        });

        it('length reflects raw string length (no trimming applied)', () => {
            const reason = new Reason(EXACTLY_10);
            expect(reason.length).toBe(10);
        });
    });
});
