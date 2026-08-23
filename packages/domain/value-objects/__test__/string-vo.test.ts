import { describe, expect, it } from 'bun:test';
import { StringVO } from '../string-vo';

class ConcreteStringVO extends StringVO {}

describe('StringVO', () => {
    describe('constructor', () => {
        it('creates with a valid non-empty string', () => {
            expect(() => new ConcreteStringVO('hello')).not.toThrow();
        });

        it('stores the exact value provided', () => {
            const vo = new ConcreteStringVO('hello world');
            expect(vo.value).toBe('hello world');
        });

        it('preserves leading and trailing spaces in value', () => {
            const vo = new ConcreteStringVO('  hello  ');
            expect(vo.value).toBe('  hello  ');
        });

        it('throws for empty string', () => {
            expect(() => new ConcreteStringVO('')).toThrow('Value cannot be empty.');
        });

        it('throws for whitespace-only string (spaces)', () => {
            expect(() => new ConcreteStringVO('   ')).toThrow('Value cannot be empty.');
        });

        it('throws for whitespace-only string (tab)', () => {
            expect(() => new ConcreteStringVO('\t')).toThrow('Value cannot be empty.');
        });

        it('throws for whitespace-only string (newline)', () => {
            expect(() => new ConcreteStringVO('\n')).toThrow('Value cannot be empty.');
        });

        it('throws for mixed whitespace only', () => {
            expect(() => new ConcreteStringVO(' \t\n ')).toThrow('Value cannot be empty.');
        });
    });

    describe('value getter', () => {
        it('returns the raw stored value', () => {
            const vo = new ConcreteStringVO('Hello World');
            expect(vo.value).toBe('Hello World');
        });
    });

    describe('equals()', () => {
        it('returns true when values are identical', () => {
            const a = new ConcreteStringVO('hello');
            const b = new ConcreteStringVO('hello');
            expect(a.equals(b)).toBe(true);
        });

        it('returns false when values differ', () => {
            const a = new ConcreteStringVO('hello');
            const b = new ConcreteStringVO('world');
            expect(a.equals(b)).toBe(false);
        });

        it('is case-sensitive', () => {
            const a = new ConcreteStringVO('Hello');
            const b = new ConcreteStringVO('hello');
            expect(a.equals(b)).toBe(false);
        });

        it('considers surrounding spaces as different values', () => {
            const a = new ConcreteStringVO('hello');
            const b = new ConcreteStringVO(' hello');
            expect(a.equals(b)).toBe(false);
        });
    });

    describe('contains()', () => {
        it('returns true when substring exists', () => {
            const vo = new ConcreteStringVO('hello world');
            expect(vo.contains('world')).toBe(true);
        });

        it('returns true when substring is the full value', () => {
            const vo = new ConcreteStringVO('hello');
            expect(vo.contains('hello')).toBe(true);
        });

        it('returns false when substring is absent', () => {
            const vo = new ConcreteStringVO('hello');
            expect(vo.contains('xyz')).toBe(false);
        });

        it('returns true for empty search string', () => {
            const vo = new ConcreteStringVO('hello');
            expect(vo.contains('')).toBe(true);
        });

        it('is case-sensitive', () => {
            const vo = new ConcreteStringVO('Hello');
            expect(vo.contains('hello')).toBe(false);
        });
    });

    describe('startsWith()', () => {
        it('returns true when value starts with given text', () => {
            const vo = new ConcreteStringVO('hello world');
            expect(vo.startsWith('hello')).toBe(true);
        });

        it('returns false when value does not start with given text', () => {
            const vo = new ConcreteStringVO('hello world');
            expect(vo.startsWith('world')).toBe(false);
        });

        it('is case-sensitive', () => {
            const vo = new ConcreteStringVO('Hello world');
            expect(vo.startsWith('hello')).toBe(false);
        });
    });

    describe('endsWith()', () => {
        it('returns true when value ends with given text', () => {
            const vo = new ConcreteStringVO('hello world');
            expect(vo.endsWith('world')).toBe(true);
        });

        it('returns false when value does not end with given text', () => {
            const vo = new ConcreteStringVO('hello world');
            expect(vo.endsWith('hello')).toBe(false);
        });

        it('is case-sensitive', () => {
            const vo = new ConcreteStringVO('hello World');
            expect(vo.endsWith('world')).toBe(false);
        });
    });

    describe('length', () => {
        it('returns the character count', () => {
            const vo = new ConcreteStringVO('hello');
            expect(vo.length).toBe(5);
        });

        it('counts spaces in the length', () => {
            const vo = new ConcreteStringVO('hello world');
            expect(vo.length).toBe(11);
        });

        it('returns 1 for a single character', () => {
            const vo = new ConcreteStringVO('x');
            expect(vo.length).toBe(1);
        });
    });

    describe('isEmpty', () => {
        it('is always false because constructor prevents empty values', () => {
            const vo = new ConcreteStringVO('a');
            expect(vo.isEmpty).toBe(false);
        });
    });

    describe('toLower()', () => {
        it('returns an all-lowercase version', () => {
            const vo = new ConcreteStringVO('HELLO WORLD');
            expect(vo.toLower()).toBe('hello world');
        });

        it('does not mutate the stored value', () => {
            const vo = new ConcreteStringVO('HELLO');
            vo.toLower();
            expect(vo.value).toBe('HELLO');
        });
    });

    describe('toUpper()', () => {
        it('returns an all-uppercase version', () => {
            const vo = new ConcreteStringVO('hello world');
            expect(vo.toUpper()).toBe('HELLO WORLD');
        });

        it('does not mutate the stored value', () => {
            const vo = new ConcreteStringVO('hello');
            vo.toUpper();
            expect(vo.value).toBe('hello');
        });
    });

    describe('trim()', () => {
        it('returns a trimmed version of the value', () => {
            const vo = new ConcreteStringVO('  hello  ');
            expect(vo.trim()).toBe('hello');
        });

        it('does not mutate the stored value', () => {
            const vo = new ConcreteStringVO('  hello  ');
            vo.trim();
            expect(vo.value).toBe('  hello  ');
        });

        it('returns the same string when no whitespace to trim', () => {
            const vo = new ConcreteStringVO('hello');
            expect(vo.trim()).toBe('hello');
        });
    });

    describe('toString()', () => {
        it('returns the string value', () => {
            const vo = new ConcreteStringVO('hello');
            expect(vo.toString()).toBe('hello');
        });
    });
});
