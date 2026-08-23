import { describe, expect, it } from 'bun:test';
import { PhoneNumber } from '../phone-no.vo';

describe('PhoneNumber', () => {
    describe('constructor — valid numbers', () => {
        it('accepts a local number with 8 digits', () => {
            expect(() => new PhoneNumber('12345678')).not.toThrow();
        });

        it('accepts a number with 15 digits (maximum)', () => {
            expect(() => new PhoneNumber('123456789012345')).not.toThrow();
        });

        it('accepts a number prefixed with +', () => {
            expect(() => new PhoneNumber('+12345678901')).not.toThrow();
        });

        it('accepts a country code with minimum digits', () => {
            expect(() => new PhoneNumber('+12345678')).not.toThrow();
        });

        it('accepts a number with exactly 10 digits (common US format)', () => {
            expect(() => new PhoneNumber('5551234567')).not.toThrow();
        });
    });

    describe('constructor — invalid numbers', () => {
        it('throws for a number shorter than 8 digits', () => {
            expect(() => new PhoneNumber('1234567')).toThrow('Invalid phone number.');
        });

        it('throws for a number longer than 15 digits', () => {
            expect(() => new PhoneNumber('1234567890123456')).toThrow('Invalid phone number.');
        });

        it('throws for a number with letters', () => {
            expect(() => new PhoneNumber('123ABC789')).toThrow('Invalid phone number.');
        });

        it('throws for a number with dashes', () => {
            expect(() => new PhoneNumber('555-123-4567')).toThrow('Invalid phone number.');
        });

        it('throws for a number with spaces', () => {
            expect(() => new PhoneNumber('555 123 4567')).toThrow('Invalid phone number.');
        });

        it('throws for a number with parentheses', () => {
            expect(() => new PhoneNumber('(555)1234567')).toThrow('Invalid phone number.');
        });

        it('throws for a + sign not at the start', () => {
            expect(() => new PhoneNumber('1234+5678')).toThrow('Invalid phone number.');
        });

        it('throws for empty string (caught by StringVO)', () => {
            expect(() => new PhoneNumber('')).toThrow();
        });
    });

    describe('boundary values', () => {
        it('rejects 7 digits (one below minimum)', () => {
            expect(() => new PhoneNumber('1234567')).toThrow();
        });

        it('accepts 8 digits (lower boundary)', () => {
            expect(() => new PhoneNumber('12345678')).not.toThrow();
        });

        it('accepts 15 digits (upper boundary)', () => {
            expect(() => new PhoneNumber('123456789012345')).not.toThrow();
        });

        it('rejects 16 digits (one above maximum)', () => {
            expect(() => new PhoneNumber('1234567890123456')).toThrow();
        });
    });

    describe('inherited StringVO behaviour', () => {
        it('value getter returns the phone number string', () => {
            const phone = new PhoneNumber('+12345678901');
            expect(phone.value).toBe('+12345678901');
        });

        it('equals() compares two phone numbers', () => {
            const a = new PhoneNumber('+12345678901');
            const b = new PhoneNumber('+12345678901');
            expect(a.equals(b)).toBe(true);
        });
    });
});
