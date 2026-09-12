// order.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { orderService, type OrderMutationResult } from './order.service';
import {
    createMyOrderDto,
    getAdminPaginatedOrdersQuerySchema,
    getMyOrdersQuerySchema,
    type GetAdminPaginatedOrdersQueryDto,
    type GetMyOrdersQueryDto,
    type createMyOrderDtoType,
    type OrderResponseReadModel,
} from '@ecomerece/shared';

export const ORDER_QUERY_KEY = ['orders'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetMyOrders(params: GetMyOrdersQueryDto) {
    return useQuery({
        queryKey: [...ORDER_QUERY_KEY, 'me', params],
        queryFn: () => orderService.getMyOrders(getMyOrdersQuerySchema.parse(params)),
    });
}

export function useGetAdminPaginatedOrders(params: GetAdminPaginatedOrdersQueryDto) {
    return useQuery({
        queryKey: [...ORDER_QUERY_KEY, 'admin-paginated', params],
        queryFn: () =>
            orderService.getAdminPaginatedOrders(getAdminPaginatedOrdersQuerySchema.parse(params)),
    });
}

// ── Shared cache-update helper ───────────────────────────────────────────────

function applyOrderMutationResult(queryClient: QueryClient, result: OrderMutationResult) {
    const updated = result.updatedData;

    if (!updated) {
        queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
        return;
    }

    queryClient.setQueryData([...ORDER_QUERY_KEY, updated.id], updated);
    queryClient.invalidateQueries({ queryKey: [...ORDER_QUERY_KEY, 'me'] });
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useCreateMyOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: createMyOrderDtoType) =>
            orderService.createMyOrder(createMyOrderDto.parse(data)),
        onSuccess: (data) => applyOrderMutationResult(queryClient, data),
    });
}