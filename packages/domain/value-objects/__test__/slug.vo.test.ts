import { describe, expect, it } from 'bun:test';

import { Slug } from '../slug.vo';
import { BadRequestError } from '../../../../apps/api/errors/app-error';

describe('Slug', () => {
    describe('create', () => {
        it('creates a valid slug', () => {
            const slug = Slug.create('electronics-mobile');

            expect(slug.value).toBe('electronics-mobile');
        });

        it('normalizes uppercase letters', () => {
            const slug = Slug.create('Electronics-Mobile');

            expect(slug.value).toBe('electronics-mobile');
        });

        it('trims whitespace', () => {
            const slug = Slug.create('  electronics-mobile  ');

            expect(slug.value).toBe('electronics-mobile');
        });

        it('throws when slug is empty', () => {
            expect(() => Slug.create('')).toThrow(BadRequestError);
        });

        it('throws when slug contains spaces', () => {
            expect(() => Slug.create('electronics mobile')).toThrow(BadRequestError);
        });

        it('throws when slug contains invalid characters', () => {
            expect(() => Slug.create('electronics@mobile')).toThrow(BadRequestError);
        });

        it('throws when slug starts with a hyphen', () => {
            expect(() => Slug.create('-electronics')).toThrow(BadRequestError);
        });

        it('throws when slug ends with a hyphen', () => {
            expect(() => Slug.create('electronics-')).toThrow(BadRequestError);
        });

        it('throws when slug contains consecutive hyphens', () => {
            expect(() => Slug.create('electronics--mobile')).toThrow(BadRequestError);
        });
    });

    describe('segments', () => {
        const slug = Slug.create('electronics-mobile-apple');

        it('returns all segments', () => {
            expect(slug.segments).toEqual(['electronics', 'mobile', 'apple']);
        });

        it('returns the first segment', () => {
            expect(slug.firstSegment).toBe('electronics');
        });

        it('returns the last segment', () => {
            expect(slug.lastSegment).toBe('apple');
        });

        it('returns the segment count', () => {
            expect(slug.segmentCount).toBe(3);
        });
    });

    describe('contains', () => {
        const slug = Slug.create('electronics-mobile-apple');

        it('contains a segment', () => {
            expect(slug.containsSegment('mobile')).toBe(true);
        });

        it('does not contain a segment', () => {
            expect(slug.containsSegment('laptop')).toBe(false);
        });

        it('starts with a segment', () => {
            expect(slug.startsWithSegment('electronics')).toBe(true);
        });

        it('ends with a segment', () => {
            expect(slug.endsWithSegment('apple')).toBe(true);
        });
    });

    describe('parent', () => {
        it('returns the parent slug', () => {
            const slug = Slug.create('electronics-mobile-apple');

            expect(slug.parent()?.value).toBe('electronics-mobile');
        });

        it('returns null for a root slug', () => {
            const slug = Slug.create('electronics');

            expect(slug.parent()).toBeNull();
        });
    });

    describe('append', () => {
        it('appends a segment', () => {
            const slug = Slug.create('electronics');

            expect(slug.append('mobile').value).toBe('electronics-mobile');
        });
    });

    describe('prepend', () => {
        it('prepends a segment', () => {
            const slug = Slug.create('mobile');

            expect(slug.prepend('electronics').value).toBe('electronics-mobile');
        });
    });

    describe('child', () => {
        it('creates a child slug', () => {
            const slug = Slug.create('electronics');

            expect(slug.child('mobile').value).toBe('electronics-mobile');
        });
    });

    describe('replaceSegment', () => {
        it('replaces an existing segment', () => {
            const slug = Slug.create('electronics-mobile-apple');

            expect(slug.replaceSegment('mobile', 'laptop').value).toBe('electronics-laptop-apple');
        });

        it('does nothing when the segment does not exist', () => {
            const slug = Slug.create('electronics-mobile');

            expect(slug.replaceSegment('gaming', 'laptop').value).toBe('electronics-mobile');
        });
    });

    describe('toPath', () => {
        it('converts the slug to a path', () => {
            const slug = Slug.create('electronics-mobile-apple');

            expect(slug.toPath()).toBe('/electronics/mobile/apple');
        });
    });

    describe('equals', () => {
        it('returns true for equal slugs', () => {
            expect(Slug.create('electronics').equals(Slug.create('electronics'))).toBe(true);
        });

        it('returns false for different slugs', () => {
            expect(Slug.create('electronics').equals(Slug.create('mobile'))).toBe(false);
        });
    });
});
