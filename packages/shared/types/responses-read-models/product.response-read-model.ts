export interface ProductResponseReadModel {
    id: string;
    minPrice: number;
    maxPrice: number;
    minDiscountedPrice: number;
    maxDiscountedPrice: number;
    version: number;
    categoryId: string,
    title: string;
    appearance: 'public' | 'private';
    description: string;
    vendorId: string;
    ingredient: {
        isIngredients: boolean;
        ingredients: string[];
    };
    disclaimer: {
        isDisclaimer: boolean;
        disclaimers: {
            name: string;
            title: string;
        }[];
    };
    image: {
        images: {
            url: string;
            alt: string;
            default: boolean;
        }[];
    };
    createdAt: Date;
}
