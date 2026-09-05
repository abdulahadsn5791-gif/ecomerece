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
        return http.get<ProductResponseReadModel>(`/product/${id}`);
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