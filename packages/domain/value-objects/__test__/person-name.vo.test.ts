import { describe, expect, it } from 'bun:test';
import { PersonName } from '../name.vo';

const EXACTLY_2 = 'Jo';
const EXACTLY_50 = 'A'.repeat(50);

describe('PersonName', () => {
    describe('constructor — valid input', () => {
        it('creates with a simple first name', () => {
            expect(() => new PersonName('John')).not.toThrow();
        });

        it('creates with exactly 2 characters', () => {
            expect(() => new PersonName(EXACTLY_2)).not.toThrow();
        });

        it('creates with exactly 50 characters', () => {
            expect(() => new PersonName(EXACTLY_50)).not.toThrow();
        });

        it('creates with a mix of upper and lowercase letters', () => {
            const name = new PersonName('Alice');
            expect(name.value).toBe('Alice');
        });

        it('trims surrounding whitespace before validation', () => {
            expect(() => new PersonName('  John  ')).not.toThrow();
        });
    });

    describe('constructor — too short', () => {
        it('throws when trimmed value is 1 character', () => {
            expect(() => new PersonName('    ')).toThrow('');
        });

        it('throws for empty string (caught by StringVO)', () => {
            expect(() => new PersonName('')).toThrow();
        });
    });

    describe('constructor — too long', () => {
        it('throws when trimmed value exceeds 50 characters', () => {
            expect(() => new PersonName('A'.repeat(51))).toThrow(
                'Name cannot exceed 50 characters.',
            );
        });
    });

    describe('constructor — no spaces allowed', () => {
        it('throws when name contains a space', () => {
            expect(() => new PersonName('John Doe')).toThrow('Name cannot contain spaces.');
        });

        it('throws when name has an internal space', () => {
            expect(() => new PersonName('Jo hn')).toThrow('Name cannot contain spaces.');
        });
    });

    describe('constructor — letters only', () => {
        it('throws for a name with digits', () => {
            expect(() => new PersonName('John1')).toThrow('Name can only contain letters.');
        });

        it('throws for a name with a hyphen', () => {
            expect(() => new PersonName('Mary-Jane')).toThrow('Name can only contain letters.');
        });

        it('throws for a name with an apostrophe', () => {
            expect(() => new PersonName("O'Brien")).toThrow('Name can only contain letters.');
        });

        it('throws for a name with special characters', () => {
            expect(() => new PersonName('Name!')).toThrow('Name can only contain letters.');
        });

        it('throws for a name with accented characters (non-ASCII)', () => {
            expect(() => new PersonName('José')).toThrow('Name can only contain letters.');
        });
    });

    describe('static create()', () => {
        it('returns a PersonName instance', () => {
            const name = PersonName.create('Alice');
            expect(name).toBeInstanceOf(PersonName);
            expect(name.value).toBe('Alice');
        });
    });

    describe('inherited StringVO behaviour', () => {
        it('toLower() works', () => {
            const name = new PersonName('Alice');
            expect(name.toLower()).toBe('alice');
        });

        it('equals() compares by value', () => {
            const a = new PersonName('Alice');
            const b = new PersonName('Alice');
            expect(a.equals(b)).toBe(true);
        });
    });
});
