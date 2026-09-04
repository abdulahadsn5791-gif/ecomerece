// category.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { categoryService, type CategoryMutationResult } from './category.service';
import {

    createCategoryDto,
    deleteCategoryDto,
    getPaginatedDto,
    type createCategoryDtoType,
    type deleteCategoryType,
    type getPaginatedDtoType,

} from '@ecomerece/shared';

export const CATEGORY_QUERY_KEY = ['categories'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetCategoryById(id: string) {
    return useQuery({
        queryKey: [...CATEGORY_QUERY_KEY, id],
        queryFn: () => categoryService.getCategoryById(id),
        enabled: Boolean(id),
    });
}

export function useGetPaginatedCategories(params: getPaginatedDtoType) {
    return useQuery({
        queryKey: [...CATEGORY_QUERY_KEY, 'paginated', params],
        queryFn: () => categoryService.getPaginatedCategories(getPaginatedDto.parse(params)),
    });
}

// ── Shared cache-update helper ───────────────────────────────────────────────

/**
 * Updates cache directly when `updatedData` is returned, otherwise invalidates category queries.
 */
function applyCategoryMutationResult(queryClient: QueryClient, result: CategoryMutationResult) {
    const updated = result.updatedData;

    if (!updated) {
        queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY });
        return;
    }

    queryClient.setQueryData([...CATEGORY_QUERY_KEY, updated.id], updated);
    queryClient.invalidateQueries({ queryKey: [...CATEGORY_QUERY_KEY, 'paginated'] });
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: createCategoryDtoType) =>
            categoryService.createCategory(createCategoryDto.parse(data)),
        onSuccess: (data) => applyCategoryMutationResult(queryClient, data),
    });
}

export function useDeleteCategoryById() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: deleteCategoryType) =>
            categoryService.deleteCategoryById(deleteCategoryDto.parse(data)),
        onSuccess: (data) => applyCategoryMutationResult(queryClient, data),
    });
}