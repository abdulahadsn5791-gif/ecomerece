import { describe, expect, it } from 'bun:test';
import { EnumVO } from '../enum.vo';

type Status = 'active' | 'inactive' | 'pending';
const ALLOWED: readonly Status[] = ['active', 'inactive', 'pending'];

class StatusVO extends EnumVO<Status> {
    constructor(value: string) {
        super(value, ALLOWED);
    }
}

describe('EnumVO', () => {
    describe('constructor — valid values', () => {
        it('accepts a valid lowercase value', () => {
            expect(() => new StatusVO('active')).not.toThrow();
        });

        it('accepts all allowed values', () => {
            expect(() => new StatusVO('inactive')).not.toThrow();
            expect(() => new StatusVO('pending')).not.toThrow();
        });

        it('normalises uppercase to lowercase before validation', () => {
            expect(() => new StatusVO('ACTIVE')).not.toThrow();
        });

        it('normalises mixed case', () => {
            expect(() => new StatusVO('Active')).not.toThrow();
        });

        it('trims surrounding whitespace before validation', () => {
            expect(() => new StatusVO('  active  ')).not.toThrow();
        });

        it('normalises both case and whitespace together', () => {
            expect(() => new StatusVO('  ACTIVE  ')).not.toThrow();
        });
    });

    describe('constructor — invalid values', () => {
        it('throws for a value not in the allowed list', () => {
            expect(() => new StatusVO('unknown')).toThrow(
                "Invalid value 'unknown'. Allowed values: active, inactive, pending",
            );
        });

        it('throws for an empty string (caught by StringVO)', () => {
            expect(() => new StatusVO('')).toThrow();
        });

        it('throws for whitespace-only input (caught by StringVO)', () => {
            expect(() => new StatusVO('   ')).toThrow();
        });

        it('error message shows the original value and allowed values', () => {
            expect(() => new StatusVO('BANNED')).toThrow("Invalid value 'BANNED'");
        });
    });

    describe('value getter', () => {
        it('returns the normalised (lowercase, trimmed) value', () => {
            const status = new StatusVO('  ACTIVE  ');
            expect(status.value).toBe('active');
        });

        it('returns the typed value', () => {
            const status = new StatusVO('pending');
            const typed: Status = status.value; // TypeScript ensures type safety
            expect(typed).toBe('pending');
        });
    });

    describe('inherited StringVO behaviour', () => {
        it('equals() compares normalised values', () => {
            const a = new StatusVO('ACTIVE');
            const b = new StatusVO('active');
            expect(a.equals(b)).toBe(true);
        });

        it('equals() returns false for different values', () => {
            const a = new StatusVO('active');
            const b = new StatusVO('inactive');
            expect(a.equals(b)).toBe(false);
        });

        it('toLower() works on already-lowercase stored value', () => {
            const status = new StatusVO('ACTIVE');
            expect(status.toLower()).toBe('active');
        });
    });
});
