// product.hook.ts

import {
  blockLiftProductDto,
  type blockLiftProductDtoType,
  blockProductDto,
  type blockProductDtoType,
  type CreateMyProductDto,
  CreateMyProductDtoSchema,
  deafultImageDto,
  type deafultImageDtoType,
  disclaimerItemsDto,
  type disclaimerItemsDtoType,
  getAdminPaginatedProductsQuerySchema,
  getMyPaginatedProductsQuerySchema,
  imagesDto,
  type imagesDtoType,
  ingredientsDto,
  type ingredientsDtotype,
  type ProductAdminSort,
  type ProductPublicSort,
  productAppereanceDto,
  type productAppereanceDtoType,
  recoverProductDto,
  type recoverProductDtoType,
  softDeleteMyProductDto,
  type softDeleteMyProductDtoType,
  toggleDiscalimerDto,
  type toggleDiscalimerDtoType,
  toggleIngredientsDto,
  type toggleIngredientsDtoType,
  updateProductMetaDto,
  type updateProductMetaDtoType,
} from '@ecomerece/shared';
import {
  type QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { type ProductMutationResult, productService } from './product.service';

export const PRODUCT_QUERY_KEY = ['products'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, id],
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });
}

export function useGetPaginatedProducts(params: {
  categoryId?: string;
  vendorId?: string;
  appearance?: 'public' | 'private';
  search?: string;
  cursor?: string;
  limit?: number;
  direction?: 'next' | 'prev';
  sort?: ProductPublicSort;
}) {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, 'paginated', params],
    queryFn: () => productService.getPaginatedProducts(params),
  });
}

export function useGetAdminPaginatedProducts(params: {
  categoryId?: string;
  vendorId?: string;
  appearance?: 'public' | 'private';
  search?: string;
  deleted?: boolean;
  blocked?: boolean;
  cursor?: string;
  limit?: number;
  direction?: 'next' | 'prev';
  sort?: ProductAdminSort;
  enabled?: boolean;
}) {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, 'admin-paginated', queryParams],
    queryFn: () =>
      productService.getAdminPaginatedProducts(
        getAdminPaginatedProductsQuerySchema.parse(queryParams),
      ),
    enabled,
  });
}

export function useGetMyPaginatedProducts(params: {
  categoryId?: string;
  appearance?: 'public' | 'private';
  search?: string;
  cursor?: string;
  limit?: number;
  direction?: 'next' | 'prev';
  sort?: ProductAdminSort;
}) {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, 'my-paginated', params],
    queryFn: () =>
      productService.getMyPaginatedProducts(getMyPaginatedProductsQuerySchema.parse(params)),
  });
}

export interface MyProductsInfiniteFilters {
  search?: string;
  categoryId?: string;
  appearance?: 'public' | 'private';
  sort?: ProductAdminSort;
  limit?: number;
}

/** Infinite-scroll feed of the vendor's own products. Cursor-based (`nextCursor`). */
export function useGetMyProductsInfinite(filters: MyProductsInfiniteFilters = {}) {
  const { limit = 30, sort = 'newest', ...rest } = filters;
  const queryFilters = { ...rest, limit, sort };
  return useInfiniteQuery({
    queryKey: [...PRODUCT_QUERY_KEY, 'my-infinite', queryFilters],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      productService.getMyPaginatedProducts({
        ...rest,
        sort,
        limit,
        cursor: pageParam,
        direction: 'next',
      }),
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 60,
  });
}

export interface AdminProductsInfiniteFilters {
  search?: string;
  categoryId?: string;
  vendorId?: string;
  appearance?: 'public' | 'private';
  deleted?: boolean;
  blocked?: boolean;
  sort?: ProductAdminSort;
  limit?: number;
}

/** Infinite-scroll feed for the admin products page. Cursor-based (`nextCursor`). */
export function useGetAdminProductsInfinite(filters: AdminProductsInfiniteFilters = {}) {
  const { limit = 30, sort = 'newest', ...rest } = filters;
  const queryFilters = { ...rest, limit, sort };
  return useInfiniteQuery({
    queryKey: [...PRODUCT_QUERY_KEY, 'admin-infinite', queryFilters],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      productService.getAdminPaginatedProducts({
        ...rest,
        sort,
        limit,
        cursor: pageParam,
        direction: 'next',
      }),
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 60,
  });
}

// ── Shared cache-update helper ───────────────────────────────────────────────

function applyProductMutationResult(queryClient: QueryClient, result: ProductMutationResult) {
  const updated = result.updatedData;

  if (!updated) {
    queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
    return;
  }

  queryClient.setQueryData([...PRODUCT_QUERY_KEY, updated.id], updated);
  queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, 'paginated'] });
  queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, 'admin-paginated'] });
  queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, 'my-paginated'] });
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useCreateMyProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMyProductDto) =>
      productService.createMyProduct(CreateMyProductDtoSchema.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useSoftDeleteMyProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: softDeleteMyProductDtoType) =>
      productService.softDeleteMyProduct(softDeleteMyProductDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useRecoverMyProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: recoverProductDtoType) =>
      productService.recoverMyProduct(recoverProductDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useBlockProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: blockProductDtoType) =>
      productService.blockProduct(blockProductDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useUnBlockProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: blockLiftProductDtoType) =>
      productService.unBlockProduct(blockLiftProductDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useMakeMyProductPublic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: productAppereanceDtoType) =>
      productService.makeMyProductPublic(productAppereanceDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useMakeMyProductPrivate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: productAppereanceDtoType) =>
      productService.makeMyProductPrivate(productAppereanceDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useUpdateMyProductMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: updateProductMetaDtoType) =>
      productService.updateMyProductMeta(updateProductMetaDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useToggleMyProductDisclaimer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: toggleDiscalimerDtoType) =>
      productService.toggleMyProductDisclaimer(toggleDiscalimerDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useAddMyProductDisclaimers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: disclaimerItemsDtoType) =>
      productService.addMyProductDisclaimers(disclaimerItemsDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useRemoveMyProductDisclaimers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: disclaimerItemsDtoType) =>
      productService.removeMyProductDisclaimers(disclaimerItemsDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useAddMyProductImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: imagesDtoType) => productService.addMyProductImages(imagesDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useSetMyProductDefaultImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: deafultImageDtoType) =>
      productService.setMyProductDefaultImage(deafultImageDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useRemoveMyProductImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: imagesDtoType) =>
      productService.removeMyProductImages(imagesDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useToggleMyProductIngredients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: toggleIngredientsDtoType) =>
      productService.toggleMyProductIngredients(toggleIngredientsDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useAddMyProductIngredients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ingredientsDtotype) =>
      productService.addMyProductIngredients(ingredientsDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}

export function useRemoveMyProductIngredients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ingredientsDtotype) =>
      productService.removeMyProductIngredients(ingredientsDto.parse(data)),
    onSuccess: (data) => applyProductMutationResult(queryClient, data),
  });
}
