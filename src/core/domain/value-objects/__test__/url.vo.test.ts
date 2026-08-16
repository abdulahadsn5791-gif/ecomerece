import { describe, expect, it } from 'bun:test';
import { UrlVO } from '../url.vo';

describe('UrlVO', () => {
    describe('constructor — valid URLs', () => {
        it('accepts a simple http URL', () => {
            expect(() => new UrlVO('http://example.com')).not.toThrow();
        });

        it('accepts a simple https URL', () => {
            expect(() => new UrlVO('https://example.com')).not.toThrow();
        });

        it('accepts an https URL with a path', () => {
            expect(() => new UrlVO('https://example.com/path/to/page')).not.toThrow();
        });

        it('accepts a URL with query parameters', () => {
            expect(() => new UrlVO('https://example.com?foo=bar&baz=qux')).not.toThrow();
        });

        it('accepts a URL with a hash fragment', () => {
            expect(() => new UrlVO('https://example.com#section')).not.toThrow();
        });

        it('accepts a URL with a port number', () => {
            expect(() => new UrlVO('https://example.com:8080/api')).not.toThrow();
        });

        it('accepts a URL with subdomains', () => {
            expect(() => new UrlVO('https://api.service.example.com')).not.toThrow();
        });

        it('trims surrounding whitespace and accepts the URL', () => {
            expect(() => new UrlVO('  https://example.com  ')).not.toThrow();
        });

        it('stores the trimmed URL value', () => {
            const url = new UrlVO('  https://example.com  ');
            expect(url.value).toBe('https://example.com');
        });
    });

    describe('constructor — invalid URLs', () => {
        it('throws for a plain string that is not a URL', () => {
            expect(() => new UrlVO('not-a-url')).toThrow('Invalid URL.');
        });

        it('throws for a URL without a protocol', () => {
            expect(() => new UrlVO('example.com')).toThrow('Invalid URL.');
        });

        it('throws for an ftp:// URL (unsupported protocol)', () => {
            expect(() => new UrlVO('ftp://example.com')).toThrow(
                'URL must use the HTTP or HTTPS protocol.',
            );
        });

        it('throws for a file:// URL (unsupported protocol)', () => {
            expect(() => new UrlVO('file:///etc/passwd')).toThrow(
                'URL must use the HTTP or HTTPS protocol.',
            );
        });

        it('throws for a mailto: URL (unsupported protocol)', () => {
            expect(() => new UrlVO('mailto:user@example.com')).toThrow(
                'URL must use the HTTP or HTTPS protocol.',
            );
        });

        it('throws for a javascript: URL (security risk)', () => {
            expect(() => new UrlVO('javascript:alert(1)')).toThrow();
        });

        it('throws for empty string (caught by StringVO)', () => {
            expect(() => new UrlVO('')).toThrow();
        });

        it('throws for whitespace-only string (caught by StringVO)', () => {
            expect(() => new UrlVO('   ')).toThrow();
        });
    });

    describe('static create()', () => {
        it('returns a UrlVO instance for a valid URL', () => {
            const url = UrlVO.create('https://example.com');
            expect(url).toBeInstanceOf(UrlVO);
        });

        it('propagates validation errors', () => {
            expect(() => UrlVO.create('not-a-url')).toThrow('Invalid URL.');
        });
    });

    describe('inherited StringVO behaviour', () => {
        it('equals() compares URL strings', () => {
            const a = new UrlVO('https://example.com');
            const b = new UrlVO('https://example.com');
            expect(a.equals(b)).toBe(true);
        });

        it('equals() returns false for different URLs', () => {
            const a = new UrlVO('https://example.com');
            const b = new UrlVO('https://other.com');
            expect(a.equals(b)).toBe(false);
        });

        it('contains() works on the stored URL', () => {
            const url = new UrlVO('https://example.com/api/v1');
            expect(url.contains('/api')).toBe(true);
        });

        it('startsWith() detects the protocol prefix', () => {
            const url = new UrlVO('https://example.com');
            expect(url.startsWith('https://')).toBe(true);
        });
    });
});
