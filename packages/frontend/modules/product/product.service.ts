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

export class ProductService {
    getProductById(id: string): Promise<ProductResponseReadModel> {
        return http.get<ProductResponseReadModel>(`/products/${id}`);
    }

    createMyProduct(data: CreateMyProductDto): Promise<ProductMutationResult> {
        return http.post<ProductMutationResult>('/products/me', data);
    }

    softDeleteMyProduct(data: softDeleteMyProductDtoType): Promise<ProductMutationResult> {
        return http.delete<ProductMutationResult>('/products/me/soft', data);
    }

    recoverMyProduct(data: recoverProductDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/recover', data);
    }

    blockProduct(data: blockProductDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/block', data);
    }

    unBlockProduct(data: blockLiftProductDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/block/lift', data);
    }

    makeMyProductPublic(data: productAppereanceDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/public', data);
    }

    makeMyProductPrivate(data: productAppereanceDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/private', data);
    }

    updateMyProductMeta(data: updateProductMetaDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/meta', data);
    }

    toggleMyProductDisclaimer(data: toggleDiscalimerDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/disclaimer/toggle', data);
    }

    addMyProductDisclaimers(data: disclaimerItemsDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/disclaimer/add', data);
    }

    removeMyProductDisclaimers(data: disclaimerItemsDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/disclaimer/remove', data);
    }

    addMyProductImages(data: imagesDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/images/add', data);
    }

    setMyProductDefaultImage(data: deafultImageDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/images/default', data);
    }

    removeMyProductImages(data: imagesDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/images/remove', data);
    }

    toggleMyProductIngredients(data: toggleIngredientsDtoType): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/ingredients/toggle', data);
    }

    addMyProductIngredients(data: ingredientsDtotype): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/ingredients/add', data);
    }

    removeMyProductIngredients(data: ingredientsDtotype): Promise<ProductMutationResult> {
        return http.patch<ProductMutationResult>('/products/me/ingredients/remove', data);
    }
}

export const productService = new ProductService();