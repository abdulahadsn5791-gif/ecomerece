import { describe, expect, it } from 'bun:test';
import { EmailVO } from '../email.vo';

describe('EmailVO', () => {
    describe('constructor — valid emails', () => {
        it('accepts a standard email address', () => {
            expect(() => new EmailVO('user@example.com')).not.toThrow();
        });

        it('accepts emails with subdomains', () => {
            expect(() => new EmailVO('user@mail.example.com')).not.toThrow();
        });

        it('accepts emails with plus addressing', () => {
            expect(() => new EmailVO('user+tag@example.com')).not.toThrow();
        });

        it('accepts emails with dots in the local part', () => {
            expect(() => new EmailVO('first.last@example.com')).not.toThrow();
        });

        it('accepts emails with numbers', () => {
            expect(() => new EmailVO('user123@example123.com')).not.toThrow();
        });

        it('accepts emails with hyphenated domains', () => {
            expect(() => new EmailVO('user@my-domain.com')).not.toThrow();
        });
    });

    describe('constructor — invalid emails', () => {
        it('throws for a missing @ symbol', () => {
            expect(() => new EmailVO('userexample.com')).toThrow('Invalid email.');
        });

        it('throws for a missing domain', () => {
            expect(() => new EmailVO('user@')).toThrow('Invalid email.');
        });

        it('throws for a missing TLD', () => {
            expect(() => new EmailVO('user@domain')).toThrow('Invalid email.');
        });

        it('throws for an email with spaces', () => {
            expect(() => new EmailVO('user @example.com')).toThrow('Invalid email.');
        });

        it('throws for an email with multiple @ symbols', () => {
            expect(() => new EmailVO('user@@example.com')).toThrow('Invalid email.');
        });

        it('throws for a completely empty string (caught by StringVO)', () => {
            expect(() => new EmailVO('')).toThrow();
        });

        it('throws for whitespace-only input (caught by StringVO)', () => {
            expect(() => new EmailVO('   ')).toThrow();
        });
    });

    describe('static isValid()', () => {
        it('returns true for a valid email', () => {
            expect(EmailVO.isValid('user@example.com')).toBe(true);
        });

        it('returns false for an email without @', () => {
            expect(EmailVO.isValid('userexample.com')).toBe(false);
        });

        it('returns false for an email without a domain extension', () => {
            expect(EmailVO.isValid('user@domain')).toBe(false);
        });

        it('returns false for an email with spaces', () => {
            expect(EmailVO.isValid('user @example.com')).toBe(false);
        });

        it('returns false for empty string', () => {
            expect(EmailVO.isValid('')).toBe(false);
        });
    });

    describe('static create()', () => {
        it('creates an EmailVO instance', () => {
            const email = EmailVO.create('user@example.com');
            expect(email).toBeInstanceOf(EmailVO);
        });

        it('propagates validation errors', () => {
            expect(() => EmailVO.create('invalid')).toThrow('Invalid email.');
        });
    });

    describe('domain getter', () => {
        it('returns the part after @', () => {
            const email = new EmailVO('user@example.com');
            expect(email.domain).toBe('example.com');
        });

        it('returns full subdomain string', () => {
            const email = new EmailVO('user@mail.example.co.uk');
            expect(email.domain).toBe('mail.example.co.uk');
        });
    });

    describe('username getter', () => {
        it('returns the part before @', () => {
            const email = new EmailVO('user@example.com');
            expect(email.username).toBe('user');
        });

        it('includes dots and plus signs in the username', () => {
            const email = new EmailVO('first.last+tag@example.com');
            expect(email.username).toBe('first.last+tag');
        });
    });
});
