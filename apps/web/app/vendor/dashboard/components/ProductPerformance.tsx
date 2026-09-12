'use client';

import { STATS_QUERY_KEY, statsService } from '@ecomerece/frontend/stats';
import type { ProductResponseReadModel } from '@ecomerece/shared';
import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Eye, PackageOpen, Star } from 'lucide-react';
import React from 'react';

interface ProductPerformanceProps {
  products: ProductResponseReadModel[];
  darkMode: boolean;
}

const fmt = (n: number) => n.toLocaleString('en-US');

export const ProductPerformance = ({ products, darkMode }: ProductPerformanceProps) => {
  const queries = useQueries({
    queries: products.map((p) => ({
      queryKey: [...STATS_QUERY_KEY, 'product', p.id, 'lifetime'],
      queryFn: () => statsService.getLifetime('product', p.id),
      enabled: !!p.id,
    })),
  });

  const _isLoading = queries.some((q) => q.isLoading);

  const rows = React.useMemo(
    () =>
      products
        .map((p, i) => ({
          product: p,
          revenue: queries[i]?.data?.metrics?.revenue ?? 0,
          views: queries[i]?.data?.metrics?.views ?? 0,
          purchases: queries[i]?.data?.metrics?.purchases ?? 0,
        }))
        .sort((a, b) => b.revenue - a.revenue),
    [products, queries],
  );

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className={`rounded-[28px] p-10 text-center ${
          darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
        }`}
      >
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
          }`}
        >
          <PackageOpen
            className={`w-8 h-8 ${darkMode ? 'text-neutral-400' : 'text-neutral-400'}`}
          />
        </div>
        <p className={`text-sm font-medium ${darkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
          No products yet
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.35 }}
      className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
    >
      <h3
        className={`text-base font-semibold mb-4 ${darkMode ? 'text-white' : 'text-neutral-900'}`}
      >
        Product Performance
      </h3>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr
              className={`border-b text-left text-xs font-medium uppercase tracking-wide ${
                darkMode
                  ? 'border-neutral-800 text-neutral-400'
                  : 'border-neutral-100 text-neutral-500'
              }`}
            >
              <th className="pb-3 pr-3">Product</th>
              <th className="pb-3 pr-3 text-right">Price</th>
              <th className="pb-3 pr-3 text-center">Stock</th>
              <th className="pb-3 pr-3 text-right">Rating</th>
              <th className="pb-3 pr-3 text-right">Views</th>
              <th className="pb-3 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const img =
                row.product.image.images.find((i) => i.default)?.url ??
                row.product.image.images[0]?.url;
              return (
                <tr
                  key={row.product.id}
                  className={`border-b last:border-0 ${
                    darkMode ? 'border-neutral-800/60' : 'border-neutral-50'
                  }`}
                >
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
                          darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                        }`}
                      >
                        {img ? (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <PackageOpen
                            className={`w-5 h-5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
                          />
                        )}
                      </div>
                      <span
                        className={`font-medium truncate max-w-[200px] ${
                          darkMode ? 'text-neutral-100' : 'text-neutral-900'
                        }`}
                      >
                        {row.product.title}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`py-3 pr-3 text-right whitespace-nowrap ${
                      darkMode ? 'text-neutral-200' : 'text-neutral-700'
                    }`}
                  >
                    ${fmt(row.product.minPrice)}
                  </td>
                  <td className="py-3 pr-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        row.product.inStock
                          ? darkMode
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-emerald-50 text-emerald-700'
                          : darkMode
                            ? 'bg-neutral-700 text-neutral-400'
                            : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {row.product.inStock ? 'In stock' : 'Out'}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        row.product.averageRating > 0
                          ? 'text-amber-500'
                          : darkMode
                            ? 'text-neutral-500'
                            : 'text-neutral-400'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {row.product.averageRating > 0 ? row.product.averageRating.toFixed(1) : '—'}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs ${
                        darkMode ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      {fmt(row.views)}
                    </span>
                  </td>
                  <td
                    className={`py-3 text-right font-semibold text-xs ${
                      darkMode ? 'text-neutral-100' : 'text-neutral-900'
                    }`}
                  >
                    ${fmt(row.revenue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
