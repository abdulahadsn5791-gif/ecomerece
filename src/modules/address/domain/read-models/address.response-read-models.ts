export interface AddressResponseReadModel {
    id: string;
    ownerId: string;
    defaultDate: Date;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullAddress: string;
    createdAt: NativeDate;
}
