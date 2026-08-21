export interface OrderReadModel {
    id: string;
    version: number;
    buyerId: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'returned' | 'refunded' | 'cancelled';
    address: string;
    deleted: {
        deleted: boolean;
        deletedFrom?: Date | null;
        deletedBy?: string | null;
        reason?: string | null;
    };
    items: Array<{
        variantId: string;
        quantity: number;
        unitPrice: number;
    }>;
    waitingTime: Date;
    createdAt: Date;
}
