export interface ProductReadModel {
    id: string;
    version: number;
    title: string;
    appearance: 'public' | 'private';
    block: {
        blocked: boolean;
        blockedFrom: Date | null;
        blockedBy: string | null;
        reason: string | null;
    };
    deleted: {
        deleted: boolean;
        deletedFrom: Date | null;
        deletedBy: string | null;
        reason: string | null;
    };
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
