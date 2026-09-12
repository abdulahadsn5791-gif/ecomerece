import { useQuery } from '@tanstack/react-query';
import { type StatsAggregationLevel, statsService } from './stats.service';

export const STATS_QUERY_KEY = ['stats'];

export function useGetVendorLifetimeStats(vendorId: string) {
  return useQuery({
    queryKey: [...STATS_QUERY_KEY, 'vendor', vendorId, 'lifetime'],
    queryFn: () => statsService.getLifetime('vendor', vendorId),
    enabled: Boolean(vendorId),
  });
}

export function useGetVendorTimeSeries(
  vendorId: string,
  aggregation: StatsAggregationLevel,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: [...STATS_QUERY_KEY, 'vendor', vendorId, 'timeseries', aggregation, from, to],
    queryFn: () => statsService.getTimeSeries('vendor', vendorId, aggregation, from, to),
    enabled: Boolean(vendorId && from && to),
  });
}

export function useGetProductLifetimeStats(productId: string) {
  return useQuery({
    queryKey: [...STATS_QUERY_KEY, 'product', productId, 'lifetime'],
    queryFn: () => statsService.getLifetime('product', productId),
    enabled: Boolean(productId),
  });
}
