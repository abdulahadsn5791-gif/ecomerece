'use client';

import { useGetAdminPaginatedProducts } from '@ecomerece/frontend/product';
import { useGetVendorStatsOverview } from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import {
  type AdminVendorsInfiniteFilters,
  useGetAdminVendorsInfinite,
  useRecoverVendor,
  useRejectVendorVerification,
  useSoftDeleteVendor,
  useVerifyVendor,
  VENDOR_QUERY_KEY,
} from '@ecomerece/frontend/vendor';
import type { VendorListItemReadModel } from '@ecomerece/shared';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, RotateCcw, ShieldCheck, ShieldOff, Trash2, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ReasonActionModal } from '@/components/admin-catalog/ReasonActionModal';
import { type RowActionItem, RowActionMenu } from '@/components/admin-catalog/RowActionMenu';
import { useCursorLoadMore } from '@/components/admin-catalog/useCursorLoadMore';
import { fmtCurrency, fmtNumber } from '@/components/stats-page/format';
import { ProductStatsOverviewPanel } from '@/components/stats-page/ProductStatsOverviewPanel';
import { ProductStatsTable } from '@/components/stats-page/ProductStatsTable';
import { StatsEmptyState } from '@/components/stats-page/StatsEmptyState';

type StatusFilter = 'all' | 'verified' | 'unverified' | 'deleted';

const VENDOR_SKELETON_KEYS = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' },
  { value: 'deleted', label: 'Deleted' },
];

const AVATAR_COLORS = [
  'from-violet-500 to-fuchsia-500',
  'from-blue-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-rose-500 to-pink-400',
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function colorIdx(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 997;
  return h % AVATAR_COLORS.length;
}

function formatDate(v: Date | string | null | undefined) {
  if (!v) return '—';
  try {
    return new Date(v).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function AdminVendorsTable() {
  const { darkMode } = useThemeStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [action, setAction] = useState<{
    vendor: VendorListItemReadModel;
    kind: 'verify' | 'reject' | 'delete' | 'recover';
  } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const filters: AdminVendorsInfiniteFilters = useMemo(() => {
    const f: AdminVendorsInfiniteFilters = {};
    if (debouncedSearch) f.search = debouncedSearch;
    if (status === 'verified') f.verified = true;
    else if (status === 'unverified') f.verified = false;
    else if (status === 'deleted') f.deleted = true;
    return f;
  }, [debouncedSearch, status]);

  const { data, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetAdminVendorsInfinite(filters);

  const rows = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const sentinelRef = useCursorLoadMore<HTMLTableRowElement>({ hasNextPage, isFetchingNextPage, fetchNextPage });

  // ── Bottom stats ───────────────────────────────────────────────────────
  const statsOverview = useGetVendorStatsOverview(selectedId ?? '', { enabled: !!selectedId });
  const selectedProducts = useGetAdminPaginatedProducts({
    vendorId: selectedId ?? '',
    sort: 'most_revenue',
    limit: 25,
    enabled: Boolean(selectedId),
  });

  const overviewData = statsOverview.data?.overview;
  const productRows = selectedProducts.data?.data ?? [];

  // ── Mutations ───────────────────────────────────────────────────────
  const verifyMut = useVerifyVendor();
  const rejectMut = useRejectVendorVerification();
  const deleteMut = useSoftDeleteVendor();
  const recoverMut = useRecoverVendor();

  const activeMutation = (() => {
    switch (action?.kind) {
      case 'verify':
        return verifyMut;
      case 'reject':
        return rejectMut;
      case 'delete':
        return deleteMut;
      case 'recover':
        return recoverMut;
    }
  })();

  const closeAction = () => {
    verifyMut.reset();
    rejectMut.reset();
    deleteMut.reset();
    recoverMut.reset();
    setAction(null);
  };

  const handleConfirm = async (payload: { reason?: string }) => {
    if (!action) return;
    const { vendor, kind } = action;

    const withReason: string[] = ['reject', 'delete'];
    if (withReason.includes(kind) && !payload.reason?.trim()) return;

    const run = async () => {
      switch (kind) {
        case 'verify':
          await verifyMut.mutateAsync({ vendorId: vendor.id });
          break;
        case 'reject':
          await rejectMut.mutateAsync({
            vendorId: vendor.id,
            reason: payload.reason?.trim() ?? '',
          });
          break;
        case 'delete':
          await deleteMut.mutateAsync({
            vendorId: vendor.id,
            reason: payload.reason?.trim() ?? '',
          });
          break;
        case 'recover':
          await recoverMut.mutateAsync({ vendorId: vendor.id });
          break;
      }
    };

    try {
      await run();
      await queryClient.invalidateQueries({ queryKey: [...VENDOR_QUERY_KEY, 'admin-infinite'] });
      closeAction();
    } catch {
      /* error surfaced via activeMutation.error */
    }
  };

  // ── Status computation ───────────────────────────────────────────────
  const verificationBadge = (v: VendorListItemReadModel) => {
    if (v.verification?.isVerified) {
      return darkMode
        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
    if (v.verification?.rejectedReason) {
      return darkMode
        ? 'bg-rose-900/30 text-rose-400 border-rose-500/30'
        : 'bg-rose-100 text-rose-700 border-rose-200';
    }
    return darkMode
      ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
      : 'bg-neutral-100 text-neutral-600 border-neutral-200';
  };

  const verificationLabel = (v: VendorListItemReadModel) => {
    if (v.verification?.isVerified) return 'Verified';
    if (v.verification?.rejectedReason) return 'Rejected';
    return 'Pending';
  };

  const menuItems = (v: VendorListItemReadModel): RowActionItem[] => {
    const items: RowActionItem[] = [];
    if (v.isDeleted) {
      items.push({
        key: 'recover',
        label: 'Recover',
        icon: RotateCcw,
        onClick: () => setAction({ vendor: v, kind: 'recover' }),
      });
    } else {
      if (!v.verification?.isVerified) {
        items.push({
          key: 'verify',
          label: 'Verify',
          icon: ShieldCheck,
          onClick: () => setAction({ vendor: v, kind: 'verify' }),
        });
        items.push({
          key: 'reject',
          label: 'Reject',
          icon: ShieldOff,
          danger: true,
          onClick: () => setAction({ vendor: v, kind: 'reject' }),
        });
      }
      items.push({
        key: 'delete',
        label: 'Soft delete',
        icon: Trash2,
        danger: true,
        onClick: () => setAction({ vendor: v, kind: 'delete' }),
      });
    }
    return items;
  };

  // ── Theme helpers ────────────────────────────────────────────────────
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
              <Truck className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
              Vendors
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Review verification status, recover or remove vendors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendors…"
              className={`w-full min-w-[200px] flex-1 px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${inputCls}`}
            />
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
            {VENDOR_SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className={`flex items-center gap-4 px-5 py-4 border-b ${border} ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}
              >
                <div
                  className={`w-10 h-10 rounded-full shrink-0 animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className={`h-3.5 w-40 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                  />
                  <div
                    className={`h-3 w-28 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className={`mt-6 rounded-[20px] border p-8 text-center text-sm ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            Couldn&apos;t load vendors. {(error as Error)?.message ?? ''}
          </div>
        ) : rows.length === 0 ? (
          <div
            className={`mt-6 rounded-[20px] border p-10 text-center ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            <Truck className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">No vendors match these filters.</p>
          </div>
        ) : (
          <div className={`mt-6 rounded-[20px] border ${border} overflow-x-auto`}>
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Vendor
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Performance
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Created
                  </th>
                  <th
                    className={`text-right px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedId((prev) => (prev === v.id ? null : v.id))}
                    className={`border-b last:border-b-0 cursor-pointer transition-colors ${
                      selectedId === v.id
                        ? darkMode
                          ? 'bg-violet-500/10'
                          : 'bg-violet-50'
                        : rowHover
                    } ${border}`}
                  >
                    <td className={cellBase}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIdx(v.title)]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                        >
                          {initials(v.title)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[200px]">{v.title}</p>
                          <p
                            className={`text-xs truncate max-w-[220px] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
                          >
                            /{v.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={cellBase}>
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${verificationBadge(v)}`}
                        >
                          {verificationLabel(v)}
                        </span>
                        {v.isDeleted && (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${
                              darkMode
                                ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                                : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                            }`}
                          >
                            Deleted
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`${cellBase} whitespace-nowrap`}>
                      <span className={darkMode ? 'text-neutral-400' : 'text-neutral-600'}>
                        {fmtCurrency(v.stats?.revenue ?? 0)} · {fmtNumber(v.stats?.purchases ?? 0)}
                      </span>
                    </td>
                    <td
                      className={`${cellBase} whitespace-nowrap ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                    >
                      {formatDate(v.createdAt)}
                    </td>
                    <td className={`${cellBase} text-right`}>
                      <RowActionMenu items={menuItems(v)} />
                    </td>
                  </tr>
                ))}
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

      {/* Bottom stats panel */}
      {selectedId && statsOverview.isLoading && (
        <div
          className={`rounded-[28px] p-10 text-center text-sm ${darkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-white shadow-sm text-neutral-500'}`}
        >
          Loading vendor overview…
        </div>
      )}

      {overviewData && (
        <ProductStatsOverviewPanel
          overview={overviewData}
          title="Vendor overview"
          accent="#7C3AED"
        />
      )}

      {productRows.length > 0 && selectedId && (
        <div className={card}>
          <h3 className="text-lg font-bold mb-4">Top products by revenue</h3>
          <ProductStatsTable products={productRows} accent="#7C3AED" />
        </div>
      )}

      {!selectedId && (
        <StatsEmptyState
          title="Select a vendor"
          description="Click on any row above to view its overview stats and top products."
        />
      )}

      <ReasonActionModal
        isOpen={Boolean(action)}
        title={
          action?.kind === 'verify'
            ? `Verify ${action?.vendor.title}?`
            : action?.kind === 'reject'
              ? `Reject ${action?.vendor.title}?`
              : action?.kind === 'delete'
                ? `Soft-delete ${action?.vendor.title}?`
                : `Recover ${action?.vendor.title}?`
        }
        message={
          action?.kind === 'recover'
            ? 'The vendor will be restored to the storefront.'
            : action?.kind === 'verify'
              ? 'The vendor will be publicly verified.'
              : 'Provide a short reason for the audit trail.'
        }
        variant={
          action?.kind === 'verify' ? 'success' : action?.kind === 'recover' ? 'success' : 'danger'
        }
        confirmText={
          action?.kind === 'verify'
            ? 'Verify vendor'
            : action?.kind === 'reject'
              ? 'Reject vendor'
              : action?.kind === 'delete'
                ? 'Soft delete'
                : 'Recover vendor'
        }
        requireReason={action?.kind === 'reject' || action?.kind === 'delete'}
        reasonPlaceholder={
          action?.kind === 'reject'
            ? 'Why is this vendor being rejected?'
            : 'Why is this vendor being deleted?'
        }
        isPending={activeMutation?.isPending ?? false}
        error={activeMutation?.error}
        onClose={closeAction}
        onConfirm={handleConfirm}
      />
    </>
  );
}
