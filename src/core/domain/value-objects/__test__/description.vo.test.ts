import { describe, expect, it } from 'bun:test';
import { Description } from '../description.vo';

const EXACTLY_10 = '1234567890';
const EXACTLY_5000 = 'a'.repeat(5000);
const TOO_SHORT_9 = '123456789';
const TOO_LONG_5001 = 'a'.repeat(5001);
const VALID_DESCRIPTION = 'This is a valid description with enough characters.';

describe('Description', () => {
    describe('constructor — valid input', () => {
        it('creates with exactly 10 characters', () => {
            expect(() => new Description(EXACTLY_10)).not.toThrow();
        });

        it('creates with exactly 5000 characters', () => {
            expect(() => new Description(EXACTLY_5000)).not.toThrow();
        });

        it('creates with a typical description', () => {
            const desc = new Description(VALID_DESCRIPTION);
            expect(desc.value).toBe(VALID_DESCRIPTION);
        });

        it('trims whitespace before checking length (padded valid string)', () => {
            // 10 real chars + surrounding spaces → trimmed to exactly 10 = valid
            expect(() => new Description('  ' + EXACTLY_10 + '  ')).not.toThrow();
        });
    });

    describe('constructor — validation failures', () => {
        it('throws for empty string (caught by StringVO)', () => {
            expect(() => new Description('')).toThrow();
        });

        it('throws for whitespace-only string (caught by StringVO)', () => {
            expect(() => new Description('    ')).toThrow();
        });

        it('throws when trimmed value is fewer than 10 characters', () => {
            expect(() => new Description(TOO_SHORT_9)).toThrow(
                'Description must be at least 10 characters.',
            );
        });

        it('throws when spaces pad it to 10 but trimmed is less', () => {
            expect(() => new Description('  hello  ')).toThrow(
                'Description must be at least 10 characters.',
            );
        });

        it('throws when trimmed value exceeds 5000 characters', () => {
            expect(() => new Description(TOO_LONG_5001)).toThrow(
                'Description cannot exceed 5000 characters.',
            );
        });
    });

    describe('boundary values', () => {
        it('accepts exactly 10 chars (lower boundary)', () => {
            expect(() => new Description(EXACTLY_10)).not.toThrow();
        });

        it('rejects 9 chars (one below lower boundary)', () => {
            expect(() => new Description(TOO_SHORT_9)).toThrow();
        });

        it('accepts exactly 5000 chars (upper boundary)', () => {
            expect(() => new Description(EXACTLY_5000)).not.toThrow();
        });

        it('rejects 5001 chars (one above upper boundary)', () => {
            expect(() => new Description(TOO_LONG_5001)).toThrow();
        });
    });

    describe('inherited StringVO behaviour', () => {
        it('contains() works on the description value', () => {
            const desc = new Description(VALID_DESCRIPTION);
            expect(desc.contains('valid description')).toBe(true);
        });

        it('equals() returns true for matching descriptions', () => {
            const a = new Description(VALID_DESCRIPTION);
            const b = new Description(VALID_DESCRIPTION);
            expect(a.equals(b)).toBe(true);
        });
    });
});
