import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createFeatureDtoSchema,
    createHomeCategoryDtoSchema,
    createProductContainerDtoSchema,
    createPromoDtoSchema,
    createSlideDtoSchema,
    deleteFeatureDtoSchema,
    deleteHomeCategoryDtoSchema,
    deleteProductContainerDtoSchema,
    deletePromoDtoSchema,
    deleteSlideDtoSchema,
    reorderHomeCategoriesDtoSchema,
    reorderProductContainersDtoSchema,
    reorderSlidesDtoSchema,
    setFeaturesDtoSchema,
    updateFeatureDtoSchema,
    updateHomeCategoryDtoSchema,
    updateProductContainerDtoSchema,
    updatePromoDtoSchema,
    updateSlideDtoSchema,
    type CreateFeatureDtoType,
    type CreateHomeCategoryDtoType,
    type CreateProductContainerDtoType,
    type CreatePromoDtoType,
    type CreateSlideDtoType,
    type DeleteFeatureDtoType,
    type DeleteHomeCategoryDtoType,
    type DeleteProductContainerDtoType,
    type DeletePromoDtoType,
    type DeleteSlideDtoType,
    type ReorderHomeCategoriesDtoType,
    type ReorderProductContainersDtoType,
    type ReorderSlidesDtoType,
    type SetFeaturesDtoType,
    type UpdateFeatureDtoType,
    type UpdateHomeCategoryDtoType,
    type UpdateProductContainerDtoType,
    type UpdatePromoDtoType,
    type UpdateSlideDtoType,
} from '@ecomerece/shared';
import { homeService } from './home.service';

export const HOME_QUERY_KEY = ['home', 'layout'];

export function useGetHomeLayout() {
    return useQuery({
        queryKey: HOME_QUERY_KEY,
        queryFn: () => homeService.getHomeLayout(),
    });
}

export function useAddCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateHomeCategoryDtoType) =>
            homeService.addCategory(createHomeCategoryDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateHomeCategoryDtoType) =>
            homeService.updateCategory(updateHomeCategoryDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useRemoveCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeleteHomeCategoryDtoType) =>
            homeService.removeCategory(deleteHomeCategoryDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useReorderCategories() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ReorderHomeCategoriesDtoType) =>
            homeService.reorderCategories(reorderHomeCategoriesDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useAddSlide() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSlideDtoType) =>
            homeService.addSlide(createSlideDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useUpdateSlide() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateSlideDtoType) =>
            homeService.updateSlide(updateSlideDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useRemoveSlide() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeleteSlideDtoType) =>
            homeService.removeSlide(deleteSlideDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useReorderSlides() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ReorderSlidesDtoType) =>
            homeService.reorderSlides(reorderSlidesDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useAddPromo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePromoDtoType) =>
            homeService.addPromo(createPromoDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useUpdatePromo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdatePromoDtoType) =>
            homeService.updatePromo(updatePromoDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useRemovePromo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeletePromoDtoType) =>
            homeService.removePromo(deletePromoDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useAddFeature() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateFeatureDtoType) =>
            homeService.addFeature(createFeatureDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useSetFeatures() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SetFeaturesDtoType) =>
            homeService.setFeatures(setFeaturesDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useUpdateFeature() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateFeatureDtoType) =>
            homeService.updateFeature(updateFeatureDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useRemoveFeature() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeleteFeatureDtoType) =>
            homeService.removeFeature(deleteFeatureDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useAddProductContainer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductContainerDtoType) =>
            homeService.addContainer(createProductContainerDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useUpdateProductContainer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProductContainerDtoType) =>
            homeService.updateContainer(updateProductContainerDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useRemoveProductContainer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DeleteProductContainerDtoType) =>
            homeService.removeContainer(deleteProductContainerDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}

export function useReorderContainers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ReorderProductContainersDtoType) =>
            homeService.reorderContainers(reorderProductContainersDtoSchema.parse(data)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: HOME_QUERY_KEY }),
    });
}
