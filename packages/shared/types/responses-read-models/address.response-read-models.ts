export interface AddressResponseReadModel {
    id: string;
    ownerId: string;
    defaultDate: Date | null;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullAddress: string;
    createdAt: NativeDate;
}
