export interface OrderResponseReadModel {
    id: string;
    buyerId: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'returned' | 'refunded' | 'cancelled';
    address: string;
    items: Array<{
        variantId: string;
        quantity: number;
        unitPrice: number;
    }>;
    waitingTime: Date;
    createdAt: Date;
}
