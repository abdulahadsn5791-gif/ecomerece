import { describe, expect, it } from 'bun:test';
import {
    AddressVO,
    CityVO,
    CountryVO,
    FullAddressVO,
    PostalCodeVO,
    StateVO,
    StreetAddressVO,
} from '../street-address.vo';

describe('Address Value Objects', () => {
    describe('StreetAddressVO', () => {
        it('creates a valid street address', () => {
            const street = StreetAddressVO.create('123 Main Street');

            expect(street.value).toBe('123 Main Street');
        });

        it('throws for an empty street address', () => {
            expect(() => StreetAddressVO.create('')).toThrow();
        });

        it('throws when too short', () => {
            expect(() => StreetAddressVO.create('123')).toThrow();
        });
    });

    describe('CityVO', () => {
        it('creates a valid city', () => {
            const city = CityVO.create('Lahore');

            expect(city.value).toBe('Lahore');
        });

        it('throws for an empty city', () => {
            expect(() => CityVO.create('')).toThrow();
        });
    });

    describe('StateVO', () => {
        it('creates a valid state', () => {
            const state = StateVO.create('Punjab');

            expect(state.value).toBe('Punjab');
        });

        it('throws for an empty state', () => {
            expect(() => StateVO.create('')).toThrow();
        });
    });

    describe('PostalCodeVO', () => {
        it('creates a valid postal code', () => {
            const postal = PostalCodeVO.create('54000');

            expect(postal.value).toBe('54000');
        });

        it('throws when too short', () => {
            expect(() => PostalCodeVO.create('12')).toThrow();
        });
    });

    describe('CountryVO', () => {
        it('creates a valid country', () => {
            const country = CountryVO.create('Pakistan');

            expect(country.value).toBe('Pakistan');
        });

        it('throws for an empty country', () => {
            expect(() => CountryVO.create('')).toThrow();
        });
    });

    describe('FullAddressVO', () => {
        it('creates a valid full address', () => {
            const address = FullAddressVO.create('123 Main Street, Lahore, Punjab, Pakistan');

            expect(address.value).toBe('123 Main Street, Lahore, Punjab, Pakistan');
        });

        it('throws when too short', () => {
            expect(() => FullAddressVO.create('short')).toThrow();
        });
    });

    describe('AddressVO', () => {
        const createAddress = () =>
            AddressVO.create(
                StreetAddressVO.create('123 Main Street'),
                CityVO.create('Lahore'),
                StateVO.create('Punjab'),
                PostalCodeVO.create('54000'),
                CountryVO.create('Pakistan'),

            );

        it('creates a valid address', () => {
            const address = createAddress();

            expect(address.streetAddress.value).toBe('123 Main Street');
            expect(address.city.value).toBe('Lahore');
            expect(address.state.value).toBe('Punjab');
            expect(address.postalCode.value).toBe('54000');
            expect(address.country.value).toBe('Pakistan');
            expect(address.fullAddress.value).toContain('Pakistan');
        });

        it('equals another address with the same values', () => {
            const address1 = createAddress();
            const address2 = createAddress();

            expect(address1.equals(address2)).toBe(true);
        });

        it('does not equal an address with different values', () => {
            const address1 = createAddress();

            const address2 = AddressVO.create(
                StreetAddressVO.create('456 Park Road'),
                CityVO.create('Karachi'),
                StateVO.create('Sindh'),
                PostalCodeVO.create('75000'),
                CountryVO.create('Pakistan'),

            );

            expect(address1.equals(address2)).toBe(false);
        });

        it('returns the full address from toString()', () => {
            const address = createAddress();

            expect(address.toString()).toBe('123 Main Street, Lahore, Punjab, 54000, Pakistan');
        });
    });
});
