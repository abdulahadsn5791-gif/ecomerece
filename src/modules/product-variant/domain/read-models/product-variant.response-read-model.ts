export interface ProductVariantResponseReadModel {
    id: string,
    productId: string,
    discountedPrice: number,
    price: number,
    active: boolean,
    title: string,
    createdAt: Date,
}

