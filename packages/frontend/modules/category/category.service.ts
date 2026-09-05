// category.service.ts
import { http } from './../../lib';
import type {
    categoryResponseReadModels,
    createCategoryDtoType,
    deleteCategoryType,
    getPaginatedDtoType,

} from '@ecomerece/shared';

export type CategoryMutationResult = {
    message: string;
    updatedData?: categoryResponseReadModels;
};

export type PaginatedCategoriesResult = {
    data: categoryResponseReadModels[];
    meta: {
        nextCursor: string | null;
        prevCursor: string | null;
        hasMore: boolean;
    };
};

export class CategoryService {
    getCategoryById(id: string): Promise<categoryResponseReadModels> {
        return http.get<categoryResponseReadModels>(`/category/${id}`);
    }

    getPaginatedCategories(params: getPaginatedDtoType): Promise<PaginatedCategoriesResult> {

        const searchParams = new URLSearchParams();
        if (params.cursor) searchParams.append('cursor', params.cursor);
        if (params.limit) searchParams.append('limit', String(params.limit));
        if (params.direction) searchParams.append('direction', params.direction);

        const query = searchParams.toString();
        const url = query ? `/category?${query}` : '/category';

        return http.get<PaginatedCategoriesResult>(url);
    }

    createCategory(data: createCategoryDtoType): Promise<CategoryMutationResult> {
        return http.post<CategoryMutationResult>('/category/create', data);
    }

    deleteCategoryById(data: deleteCategoryType): Promise<CategoryMutationResult> {
        return http.delete<CategoryMutationResult>('/category', data);
    }
}

export const categoryService = new CategoryService();