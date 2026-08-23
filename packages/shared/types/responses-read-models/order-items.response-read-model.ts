export interface OrderItemResponseReadModel {
    _id: string,
    orderId: string,
    vendorId: string,
    variantId: string,
    quantity: number,
    waitingTime: Date,
    status: string,
    totalPrice: number,
    price: number,


    createdAt: Date,
}