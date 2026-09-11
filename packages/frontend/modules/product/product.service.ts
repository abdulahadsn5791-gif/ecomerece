// product.service.ts
import { http } from './../../lib';
import type {
    ProductResponseReadModel,
    CreateMyProductDto,
    softDeleteMyProductDtoType,
    recoverProductDtoType,
    blockProductDtoType,
    blockLiftProductDtoType,
    productAppereanceDtoType,
    updateProductMetaDtoType,
    toggleDiscalimerDtoType,
    disclaimerItemsDtoType,
    imagesDtoType,
    deafultImageDtoType,
    toggleIngredientsDtoType,
    ingredientsDtotype,
} from '@ecomerece/shared';

export type ProductMutationResult = {
    message: string;
    updatedData?: ProductResponseReadModel;
};

export type PaginatedProductsResult = {
    data: ProductResponseReadModel[];
    meta: {
        nextCursor: string | null;
        prevCursor: string | null;
        hasMore: boolean;
    };
};

export class ProductService {
    getProductById(id: string): Promise<ProductResponseReadModel> {
        return http.get<ProductResponseReadModel>(`/product/${id}`);
    }

    getPaginatedProducts(params: {
        categoryId?: string;
        vendorId?: string;
        appearance?: 'public' | 'private';
        search?: string;
        cursor?: string;
        limit?: number;
        direction?: 'next' | 'prev';
    }): Promise<PaginatedProductsResult> {
        const searchParams = new URLSearchParams();
        if (params.categoryId) searchParams.set('categoryId', params.categoryId);
        if (params.vendorId) searchParams.set('vendorId', params.vendorId);
        if (params.appearance) searchParams.set('appearance', params.appearance);
        if (params.search) searchParams.set('search', params.search);
        if (params.cursor) searchParams.set('cursor', params.cursor);
        if (params.limit) searchParams.set('limit', String(params.limit));
        if (params.direction) searchParams.set('direction', params.direction);
        const qs = searchParams.toString();
        return http.get<PaginatedProductsResult>(`/product${qs ? `?${qs}` : ''}`);
    }

    createMyProduct(data: CreateMyProductDto): Promise<ProductMutationResult> {
        return http.post<ProductMutationResult>('/product/my', data);
    }

    softDeleteMyProduct(data: softDeleteMyProductDtoType): Promise<ProductMutationResult> {
        return http.delete<ProductMutationResult>('/product/my/soft', data);
    }

    recoverMyProduct(data: recoverProductDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/recover', data);
    }

    blockProduct(data: blockProductDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/block', data);
    }

    unBlockProduct(data: blockLiftProductDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/block/lift', data);
    }

    makeMyProductPublic(data: productAppereanceDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/state/my/public', data);
    }

    makeMyProductPrivate(data: productAppereanceDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/state/my/private', data);
    }

    updateMyProductMeta(data: updateProductMetaDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/meta', data);
    }

    toggleMyProductDisclaimer(data: toggleDiscalimerDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/disclaimer/toggle', data);
    }

    addMyProductDisclaimers(data: disclaimerItemsDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/disclaimer/add', data);
    }

    removeMyProductDisclaimers(data: disclaimerItemsDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/disclaimer/remove', data);
    }

    addMyProductImages(data: imagesDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/images/add', data);
    }

    setMyProductDefaultImage(data: deafultImageDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/images/default', data);
    }

    removeMyProductImages(data: imagesDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/images/remove', data);
    }

    toggleMyProductIngredients(data: toggleIngredientsDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/ingredients/toggle', data);
    }

    addMyProductIngredients(data: ingredientsDtotype): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/ingredients/add', data);
    }

    removeMyProductIngredients(data: ingredientsDtotype): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/product/my/ingredients/remove', data);
    }
}

export const productService = new ProductService();