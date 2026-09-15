'use client';

import {
  type AdminProductsInfiniteFilters,
  PRODUCT_QUERY_KEY,
  useBlockProduct,
  useGetAdminProductsInfinite,
  useUnBlockProduct,
} from '@ecomerece/frontend/product';
import { useGetProductStatsOverview } from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import type { ProductAdminResponseReadModel } from '@ecomerece/shared';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ImageOff, Loader2, Lock, ShoppingBag, Unlock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ReasonActionModal } from '@/components/admin-catalog/ReasonActionModal';
import { type RowActionItem, RowActionMenu } from '@/components/admin-catalog/RowActionMenu';
import { useCursorLoadMore } from '@/components/admin-catalog/useCursorLoadMore';
import { AdminProductVariantsPanel } from '@/components/admin-products/AdminProductVariantsPanel';
import { fmtCurrency } from '@/components/stats-page/format';
import { ProductStatsOverviewPanel } from '@/components/stats-page/ProductStatsOverviewPanel';
import { StatsEmptyState } from '@/components/stats-page/StatsEmptyState';

type StatusFilter = 'all' | 'active' | 'blocked' | 'deleted';

const PRODUCT_SKELETON_KEYS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
type AppearanceFilter = 'all' | 'public' | 'private';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'deleted', label: 'Deleted' },
];

const APPEARANCE_OPTIONS: AppearanceFilter[] = ['all', 'public', 'private'];

function defaultImage(p: ProductAdminResponseReadModel) {
  return p.image.images.find((i) => i.default)?.url ?? p.image.images[0]?.url ?? '';
}

export function AdminProductsTable() {
  const { darkMode } = useThemeStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [appearance, setAppearance] = useState<AppearanceFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [action, setAction] = useState<{
    product: ProductAdminResponseReadModel;
    kind: 'block' | 'unblock';
  } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const filters: AdminProductsInfiniteFilters = useMemo(() => {
    const f: AdminProductsInfiniteFilters = {};
    if (debouncedSearch) f.search = debouncedSearch;
    if (appearance !== 'all') f.appearance = appearance;
    if (status === 'blocked') f.blocked = true;
    else if (status === 'deleted') f.deleted = true;
    else if (status === 'active') {
      f.blocked = false;
      f.deleted = false;
    }
    return f;
  }, [debouncedSearch, appearance, status]);

  const { data, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetAdminProductsInfinite(filters);

  const rows = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
  const sentinelRef = useCursorLoadMore<HTMLTableRowElement>({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // ── Bottom stats ───────────────────────────────────────────────────────
  const overview = useGetProductStatsOverview(selectedId ?? '', { enabled: !!selectedId });
  const overviewData = overview.data?.overview;

  // ── Mutations ───────────────────────────────────────────────────────
  const blockMut = useBlockProduct();
  const unblockMut = useUnBlockProduct();

  const activeMutation = action?.kind === 'block' ? blockMut : unblockMut;

  const handleConfirm = async (payload: { reason?: string }) => {
    if (!action) return;
    const { product, kind } = action;
    if (kind === 'block' && !payload.reason?.trim()) return;

    try {
      if (kind === 'block') {
        await blockMut.mutateAsync({ productId: product.id, reason: payload.reason?.trim() ?? '' });
      } else {
        await unblockMut.mutateAsync({ productId: product.id });
      }
      await queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, 'admin-infinite'] });
      blockMut.reset();
      unblockMut.reset();
      setAction(null);
    } catch {
      /* surfaced via activeMutation.error */
    }
  };

  const closeAction = () => {
    blockMut.reset();
    unblockMut.reset();
    setAction(null);
  };

  // ── Badges ───────────────────────────────────────────────────────────
  const statusPills = (p: ProductAdminResponseReadModel) => {
    const pills: { label: string; cls: string }[] = [];
    if (p.isBlocked) {
      pills.push({
        label: 'Blocked',
        cls: darkMode
          ? 'bg-amber-900/30 text-amber-400 border-amber-500/30'
          : 'bg-amber-100 text-amber-700 border-amber-200',
      });
    }
    if (p.isDeleted) {
      pills.push({
        label: 'Deleted',
        cls: darkMode
          ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
          : 'bg-neutral-200 text-neutral-600 border-neutral-300',
      });
    }
    if (pills.length === 0) {
      pills.push({
        label: 'Active',
        cls: darkMode
          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
          : 'bg-emerald-100 text-emerald-700 border-emerald-200',
      });
    }
    return pills;
  };

  const inStockPill = (p: ProductAdminResponseReadModel) =>
    p.inStock
      ? darkMode
        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : darkMode
        ? 'bg-rose-900/30 text-rose-400 border-rose-500/30'
        : 'bg-rose-100 text-rose-700 border-rose-200';

  const appearancePill = (p: ProductAdminResponseReadModel) =>
    p.appearance === 'public'
      ? darkMode
        ? 'bg-blue-900/30 text-blue-400 border-blue-500/30'
        : 'bg-blue-100 text-blue-700 border-blue-200'
      : darkMode
        ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
        : 'bg-neutral-100 text-neutral-600 border-neutral-200';

  const menuItems = (p: ProductAdminResponseReadModel): RowActionItem[] => {
    if (p.isDeleted) return [];
    if (p.isBlocked) {
      return [
        {
          key: 'unblock',
          label: 'Unblock',
          icon: Unlock,
          onClick: () => setAction({ product: p, kind: 'unblock' }),
        },
      ];
    }
    return [
      {
        key: 'block',
        label: 'Block',
        icon: Lock,
        danger: true,
        onClick: () => setAction({ product: p, kind: 'block' }),
      },
    ];
  };

  const card = `rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white shadow-sm border border-transparent'}`;
  const inputCls = darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-violet-500';
  const thCls = darkMode ? 'text-neutral-500' : 'text-neutral-500';
  const rowHover = darkMode ? 'hover:bg-neutral-800/60' : 'hover:bg-neutral-50';
  const border = darkMode ? 'border-neutral-800' : 'border-neutral-100';
  const cellBase = 'px-5 py-4';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={card}
      >
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag
                className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}
              />
              Products
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Review the catalog, block violating products, or inspect performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className={`w-full min-w-[200px] flex-1 px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${inputCls}`}
            />
            <select
              value={appearance}
              onChange={(e) => setAppearance(e.target.value as AppearanceFilter)}
              className={`px-4 py-2.5 rounded-2xl border text-sm font-medium outline-none transition-colors focus:ring-2 focus:ring-violet-500 cursor-pointer ${inputCls}`}
              aria-label="Filter by appearance"
            >
              {APPEARANCE_OPTIONS.map((a) => (
                <option key={a} value={a} className={darkMode ? 'bg-neutral-800' : 'bg-white'}>
                  {a === 'all' ? 'Public & private' : a[0].toUpperCase() + a.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  status === opt.value
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : darkMode
                      ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className={`mt-6 rounded-[20px] border ${border} overflow-hidden`}>
            {PRODUCT_SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className={`flex items-center gap-4 px-5 py-4 border-b ${border} ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl shrink-0 animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className={`h-3.5 w-48 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                  />
                  <div
                    className={`h-3 w-32 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className={`mt-6 rounded-[20px] border p-8 text-center text-sm ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            Couldn&apos;t load products. {(error as Error)?.message ?? ''}
          </div>
        ) : rows.length === 0 ? (
          <div
            className={`mt-6 rounded-[20px] border p-10 text-center ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">No products match these filters.</p>
          </div>
        ) : (
          <div className={`mt-6 rounded-[20px] border ${border} overflow-x-auto`}>
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Product
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Price
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Availability
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-right px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const img = defaultImage(p);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedId((prev) => (prev === p.id ? null : p.id))}
                      className={`border-b last:border-b-0 cursor-pointer transition-colors ${
                        selectedId === p.id
                          ? darkMode
                            ? 'bg-violet-500/10'
                            : 'bg-violet-50'
                          : rowHover
                      } ${border}`}
                    >
                      <td className={cellBase}>
                        <div className="flex items-center gap-3">
                          {img ? (
                            // biome-ignore lint/performance/noImgElement: small product thumbnail
                            <img
                              src={img}
                              alt={p.title}
                              className="w-10 h-10 rounded-xl object-cover bg-neutral-200 shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                darkMode
                                  ? 'bg-neutral-800 text-neutral-500'
                                  : 'bg-neutral-100 text-neutral-400'
                              }`}
                            >
                              <ImageOff className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold truncate max-w-[220px]">{p.title}</p>
                            <p
                              className={`text-xs truncate max-w-[220px] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
                            >
                              {p.vendorTitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`${cellBase} whitespace-nowrap font-medium`}>
                        {fmtCurrency(p.minPrice)}
                      </td>
                      <td className={cellBase}>
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${inStockPill(p)}`}
                          >
                            {p.inStock ? 'In stock' : 'Out of stock'}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap capitalize ${appearancePill(p)}`}
                          >
                            {p.appearance}
                          </span>
                        </div>
                      </td>
                      <td className={cellBase}>
                        <div className="flex flex-wrap gap-1.5">
                          {statusPills(p).map((s) => (
                            <span
                              key={s.label}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${s.cls}`}
                            >
                              {s.label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={`${cellBase} text-right`}>
                        {menuItems(p).length > 0 ? (
                          <RowActionMenu items={menuItems(p)} />
                        ) : (
                          <span className="text-xs opacity-40">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                <tr ref={sentinelRef}>
                  <td colSpan={5} className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium h-6">
                      {isFetchingNextPage ? (
                        <Loader2
                          className={`w-4 h-4 animate-spin ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}
                        />
                      ) : !hasNextPage && rows.length > 0 ? (
                        <span className={darkMode ? 'text-neutral-600' : 'text-neutral-400'}>
                          End of list.
                        </span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {selectedId && overview.isLoading && (
        <div
          className={`rounded-[28px] p-10 text-center text-sm ${darkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-white shadow-sm text-neutral-500'}`}
        >
          Loading product overview…
        </div>
      )}

      {overviewData && (
        <ProductStatsOverviewPanel
          overview={overviewData}
          title="Product overview"
          accent="#7C3AED"
        />
      )}

      {selectedId && <AdminProductVariantsPanel productId={selectedId} />}

      {!selectedId && (
        <StatsEmptyState
          title="Select a product"
          description="Click on any row above to view its per-period stats and trend charts."
        />
      )}

      <ReasonActionModal
        isOpen={Boolean(action)}
        title={action?.kind === 'block' ? `Block "${action?.product.title}"?` : 'Unblock product?'}
        message={
          action?.kind === 'block'
            ? 'The product will be hidden from the storefront until it is unblocked.'
            : 'The product will be visible on the storefront again.'
        }
        variant={action?.kind === 'block' ? 'danger' : 'success'}
        confirmText={action?.kind === 'block' ? 'Block product' : 'Unblock product'}
        requireReason={action?.kind === 'block'}
        reasonPlaceholder="Why is this product being blocked?"
        isPending={activeMutation.isPending}
        error={activeMutation.error}
        onClose={closeAction}
        onConfirm={handleConfirm}
      />
    </>
  );
}
