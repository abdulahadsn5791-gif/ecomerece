// product-variant.service.ts
import { http } from './../../lib';
import type {
    createMyProductVariantDtoType,
    ProductVariantResponseReadModel,
    softDeleteMyVariantDtoType,
    toggleVariantApperaaracneDtoType,
    upadteMyVariantMetaDtoType,
    updateMyVariatPriceDtoType,

} from '@ecomerece/shared';

export type ProductVariantMutationResult = {
    message: string;
    updatedData?: ProductVariantResponseReadModel;
};

export class ProductVariantService {
    getVariantsByProductId(productId: string): Promise<ProductVariantResponseReadModel[]> {
        return http.get<ProductVariantResponseReadModel[]>(`/product-variants/${productId}`);
    }

    createMyProductVariant(data: createMyProductVariantDtoType): Promise<ProductVariantMutationResult> {
        return http.post<ProductVariantMutationResult>('/product-variants/my', data);
    }

    updateMyVariantPrice(data: updateMyVariatPriceDtoType): Promise<ProductVariantMutationResult> {
        return http.patch<ProductVariantMutationResult>('/product-variants/my/price', data);
    }

    updateMyVariantMeta(data: upadteMyVariantMetaDtoType): Promise<ProductVariantMutationResult> {
        return http.patch<ProductVariantMutationResult>('/product-variants/my/meta', data);
    }

    toggleMyVariantAppearance(data: toggleVariantApperaaracneDtoType): Promise<ProductVariantMutationResult> {
        return http.patch<ProductVariantMutationResult>('/product-variants/my/appereance/toggle', data);
    }

    softDeleteMyVariant(data: softDeleteMyVariantDtoType): Promise<ProductVariantMutationResult> {
        return http.delete<ProductVariantMutationResult>('/product-variants/my/delete/soft', data);
    }

    recoverVariant(id: string): Promise<ProductVariantMutationResult> {
        return http.patch<ProductVariantMutationResult>(`/product-variants/recover/${id}`);
    }
}

export const productVariantService = new ProductVariantService();