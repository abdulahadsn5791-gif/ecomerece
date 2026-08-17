
export interface OrderResponseReadModel {
    id: string,
    variantId: string,
    buyerId: string,
    price: number,
    status: string,
    address: string,
    version: number,
    createdAt: Date,
}