export interface InventoryResponseReadModel {
    id: string;
    variantId: string;
    available: number;
    reserved: number;
    lowStockThreshold: number;
    createdAt: Date;
}
