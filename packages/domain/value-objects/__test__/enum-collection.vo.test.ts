import { describe, expect, it } from 'bun:test';
import { BadRequestError } from '../../../../errors/app-error';
import { EnumVO } from '../enum.vo';
import { EnumCollectionVO } from '../enum-collection.vo';

const TAGS = ['featured', 'sale', 'new'] as const;

type Tag = (typeof TAGS)[number];

class TagVO extends EnumVO<Tag> {
    private constructor(value: string) {
        super(value, TAGS);
    }

    static create(value: string): TagVO {
        return new TagVO(value);
    }
}

describe('EnumCollectionVO', () => {
    it('creates an empty collection', () => {
        const collection = EnumCollectionVO.create<Tag, TagVO>();

        expect(collection.count).toBe(0);
        expect(collection.isEmpty).toBe(true);
    });

    it('creates a collection', () => {
        const collection = EnumCollectionVO.create([
            TagVO.create('featured'),
            TagVO.create('sale'),
        ]);

        expect(collection.count).toBe(2);
        expect(collection.toValues()).toEqual(['featured', 'sale']);
    });

    it('creates from strings', () => {
        const collection = EnumCollectionVO.fromStrings(['featured', 'sale'], TagVO.create);

        expect(collection.count).toBe(2);
        expect(collection.toValues()).toEqual(['featured', 'sale']);
    });

    it('throws for duplicate values', () => {
        expect(() =>
            EnumCollectionVO.create([TagVO.create('featured'), TagVO.create('featured')]),
        ).toThrow(BadRequestError);
    });

    it('adds a value', () => {
        const collection = EnumCollectionVO.create([TagVO.create('featured')]);

        const updated = collection.add(TagVO.create('sale'));

        expect(updated.count).toBe(2);
        expect(updated.has(TagVO.create('sale'))).toBe(true);
    });

    it('throws when adding a duplicate', () => {
        const collection = EnumCollectionVO.create([TagVO.create('featured')]);

        expect(() => collection.add(TagVO.create('featured'))).toThrow(BadRequestError);
    });

    it('removes a value', () => {
        const collection = EnumCollectionVO.create([
            TagVO.create('featured'),
            TagVO.create('sale'),
        ]);

        const updated = collection.remove(TagVO.create('sale'));

        expect(updated.count).toBe(1);
        expect(updated.has(TagVO.create('sale'))).toBe(false);
    });

    it('checks equality', () => {
        const first = EnumCollectionVO.create([TagVO.create('featured'), TagVO.create('sale')]);

        const second = EnumCollectionVO.create([TagVO.create('featured'), TagVO.create('sale')]);

        expect(first.equals(second)).toBe(true);
    });

    it('returns values', () => {
        const collection = EnumCollectionVO.create([
            TagVO.create('featured'),
            TagVO.create('sale'),
        ]);

        expect(collection.toValues()).toEqual(['featured', 'sale']);
    });

    it('throws when an invalid string is provided', () => {
        expect(() => EnumCollectionVO.fromStrings(['featured', 'invalid'], TagVO.create)).toThrow(
            BadRequestError,
        );
    });
});
