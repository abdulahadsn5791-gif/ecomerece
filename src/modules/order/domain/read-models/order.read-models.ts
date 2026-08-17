export interface OrderReadModel {
    id: string,
    variantId: string,
    buyerId: string,
    price: number,
    status: string,
    address: string,
    delete: {
        deleted: boolean;
        deletedFrom: Date | null;
        deletedBy: string | null;
        reason: string | null;
    },
    version: number,
    createdAt: Date,
}