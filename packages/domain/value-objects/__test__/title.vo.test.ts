import { describe, expect, it } from 'bun:test';
import { Title } from '../title.vo';

const VALID_TITLE = 'A Valid Title';
const EXACTLY_3 = 'abc';
const EXACTLY_150 = 'a'.repeat(150);
const TOO_SHORT_2 = 'ab';
const TOO_LONG_151 = 'a'.repeat(151);

describe('Title', () => {
    describe('constructor — valid input', () => {
        it('creates with exactly 3 characters', () => {
            expect(() => new Title(EXACTLY_3)).not.toThrow();
        });

        it('creates with exactly 150 characters', () => {
            expect(() => new Title(EXACTLY_150)).not.toThrow();
        });

        it('creates with a normal title string', () => {
            const title = new Title(VALID_TITLE);
            expect(title.value).toBe(VALID_TITLE);
        });

        it('creates with leading/trailing spaces that trim to ≥ 3 chars', () => {
            expect(() => new Title('  hello  ')).not.toThrow();
        });
    });

    describe('constructor — validation failures', () => {
        it('throws for an empty string (caught by StringVO)', () => {
            expect(() => new Title('')).toThrow();
        });

        it('throws for a whitespace-only string (caught by StringVO)', () => {
            expect(() => new Title('   ')).toThrow();
        });

        it('throws when trimmed value is less than 3 characters', () => {
            expect(() => new Title(TOO_SHORT_2)).toThrow('Title must be at least 3 characters.');
        });

        it('throws when leading/trailing spaces reduce trimmed length below 3', () => {
            expect(() => new Title('  ab  ')).toThrow('Title must be at least 3 characters.');
        });

        it('throws for a single character', () => {
            expect(() => new Title('x')).toThrow('Title must be at least 3 characters.');
        });

        it('throws when trimmed value exceeds 150 characters', () => {
            expect(() => new Title(TOO_LONG_151)).toThrow('Title cannot exceed 150 characters.');
        });

        it('throws for 151 characters even with spaces trimmed', () => {
            // 152 chars total → trimmed 151 → too long
            expect(() => new Title(' ' + TOO_LONG_151)).toThrow(
                'Title cannot exceed 150 characters.',
            );
        });
    });

    describe('inherited StringVO behaviour', () => {
        it('value is accessible via getter', () => {
            const title = new Title(VALID_TITLE);
            expect(title.value).toBe(VALID_TITLE);
        });

        it('equals() returns true for matching titles', () => {
            const a = new Title('Hello');
            const b = new Title('Hello');
            expect(a.equals(b)).toBe(true);
        });

        it('equals() returns false for different titles', () => {
            const a = new Title('Hello');
            const b = new Title('World');
            expect(a.equals(b)).toBe(false);
        });

        it('toLower() returns lowercase value', () => {
            const title = new Title('HELLO');
            expect(title.toLower()).toBe('hello');
        });

        it('toUpper() returns uppercase value', () => {
            const title = new Title('hello');
            expect(title.toUpper()).toBe('HELLO');
        });

        it('length reflects raw value length', () => {
            const title = new Title('Hello');
            expect(title.length).toBe(5);
        });
    });
});
