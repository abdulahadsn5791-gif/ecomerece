'use client';

import {
  type AdminCategoriesInfiniteFilters,
  CATEGORY_QUERY_KEY,
  useCreateCategory,
  useDeleteCategoryById,
  useGetAdminCategoriesInfinite,
  useUpdateCategoryImage,
} from '@ecomerece/frontend/category';
import { useGetCategoryStatsOverview } from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import type { categoryResponseReadModels } from '@ecomerece/shared';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ImageOff, ImageUp, Loader2, Plus, Tag, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react'; 
import { ReasonActionModal } from '@/components/admin-catalog/ReasonActionModal';
import { type RowActionItem, RowActionMenu } from '@/components/admin-catalog/RowActionMenu';
import { useCursorLoadMore } from '@/components/admin-catalog/useCursorLoadMore';
import { ProductStatsOverviewPanel } from '@/components/stats-page/ProductStatsOverviewPanel';
import { StatsEmptyState } from '@/components/stats-page/StatsEmptyState';
import { CreateCategoryModal } from './CreateCategoryModal';
import { EditCategoryImageModal } from './EditCategoryImageModal';

type StatusFilter = 'all' | 'active' | 'blocked' | 'deleted';

const CATEGORY_SKELETON_KEYS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'deleted', label: 'Deleted' },
];

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

export function AdminCategoriesTable() {
  const { darkMode } = useThemeStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<categoryResponseReadModels | null>(null);
  const [editTarget, setEditTarget] = useState<categoryResponseReadModels | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const filters: AdminCategoriesInfiniteFilters = useMemo(() => {
    const f: AdminCategoriesInfiniteFilters = {};
    if (debouncedSearch) f.search = debouncedSearch;
    if (status === 'blocked') f.blocked = true;
    else if (status === 'deleted') f.deleted = true;
    else if (status === 'active') {
      f.blocked = false;
      f.deleted = false;
    }
    return f;
  }, [debouncedSearch, status]);

  const { data, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetAdminCategoriesInfinite(filters);

  const rows = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
  const sentinelRef = useCursorLoadMore<HTMLTableRowElement>({ hasNextPage, isFetchingNextPage, fetchNextPage });

  // ── Bottom stats ───────────────────────────────────────────────────────
  const overview = useGetCategoryStatsOverview(selectedId ?? '', { enabled: !!selectedId });
  const overviewData = overview.data?.overview;

  // ── Mutations ───────────────────────────────────────────────────────
  const createMut = useCreateCategory();
  const deleteMut = useDeleteCategoryById();
  const imageMut = useUpdateCategoryImage();

  const handleCreate = async (payload: { title?: string; image?: string }) => {
    if (!payload.title?.trim() || !payload.image?.trim()) return;
    try {
      await createMut.mutateAsync({ title: payload.title.trim(), image: payload.image.trim() });
      await queryClient.invalidateQueries({ queryKey: [...CATEGORY_QUERY_KEY, 'admin-infinite'] });
      setCreateOpen(false);
      createMut.reset();
    } catch {
      /* surfaced in modal */
    }
  };

  const handleEditImage = async (payload: { image?: string }) => {
    if (!editTarget || !payload.image?.trim()) return;
    try {
      await imageMut.mutateAsync({ id: editTarget.id, image: payload.image.trim() });
      await queryClient.invalidateQueries({ queryKey: [...CATEGORY_QUERY_KEY, 'admin-infinite'] });
      setEditTarget(null);
      imageMut.reset();
    } catch {
      /* surfaced in modal */
    }
  };

  const handleDelete = async (payload: { reason?: string }) => {
    if (!deleteTarget || !payload.reason?.trim()) return;
    try {
      await deleteMut.mutateAsync({ id: deleteTarget.id, reason: payload.reason.trim() });
      await queryClient.invalidateQueries({ queryKey: [...CATEGORY_QUERY_KEY, 'admin-infinite'] });
      setDeleteTarget(null);
      deleteMut.reset();
    } catch {
      /* surfaced in modal */
    }
  };

  // ── Status badge helpers ─────────────────────────────────────────────
  const statusPills = (c: categoryResponseReadModels) => {
    const pills: { label: string; cls: string }[] = [];
    if (c.idBlocked) {
      pills.push({
        label: 'Blocked',
        cls: darkMode
          ? 'bg-amber-900/30 text-amber-400 border-amber-500/30'
          : 'bg-amber-100 text-amber-700 border-amber-200',
      });
    }
    if (c.isDeleted) {
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

  const menuItems = (c: categoryResponseReadModels): RowActionItem[] => {
    if (c.isDeleted) return [];
    return [
      {
        key: 'edit-image',
        label: 'Change image',
        icon: ImageUp,
        onClick: () => setEditTarget(c),
      },
      {
        key: 'delete',
        label: 'Soft delete',
        icon: Trash2,
        danger: true,
        onClick: () => setDeleteTarget(c),
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Tag className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                Categories
              </h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Organize the catalog, filter by state, or create a new category.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-md shadow-violet-600/20"
            >
              <Plus className="w-4 h-4" />
              New category
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
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
            {CATEGORY_SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className={`flex items-center gap-4 px-5 py-4 border-b ${border} ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl shrink-0 animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className={`h-3.5 w-40 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className={`mt-6 rounded-[20px] border p-8 text-center text-sm ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            Couldn&apos;t load categories. {(error as Error)?.message ?? ''}
          </div>
        ) : rows.length === 0 ? (
          <div
            className={`mt-6 rounded-[20px] border p-10 text-center ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            <Tag className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">No categories match these filters.</p>
          </div>
        ) : (
          <div className={`mt-6 rounded-[20px] border ${border} overflow-x-auto`}>
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Category
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Status
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
                {rows.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedId((prev) => (prev === c.id ? null : c.id))}
                    className={`border-b last:border-b-0 cursor-pointer transition-colors ${
                      selectedId === c.id
                        ? darkMode
                          ? 'bg-violet-500/10'
                          : 'bg-violet-50'
                        : rowHover
                    } ${border}`}
                  >
                    <td className={cellBase}>
                      <div className="flex items-center gap-3">
                        {c.image ? (
                          // biome-ignore lint/performance/noImgElement: small category thumbnail
                          <img
                            src={c.image}
                            alt={c.title}
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
                        <p className="font-semibold truncate max-w-[260px]">{c.title}</p>
                      </div>
                    </td>
                    <td className={cellBase}>
                      <div className="flex flex-wrap gap-1.5">
                        {statusPills(c).map((p) => (
                          <span
                            key={p.label}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${p.cls}`}
                          >
                            {p.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td
                      className={`${cellBase} whitespace-nowrap ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                    >
                      {formatDate(c.createdAt)}
                    </td>
                    <td className={`${cellBase} text-right`}>
                      {menuItems(c).length > 0 ? (
                        <RowActionMenu items={menuItems(c)} />
                      ) : (
                        <span className="text-xs opacity-40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr ref={sentinelRef}>
                  <td colSpan={4} className="px-5 py-4">
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
          Loading category overview…
        </div>
      )}

      {overviewData && (
        <ProductStatsOverviewPanel
          overview={overviewData}
          title="Category overview"
          accent="#7C3AED"
        />
      )}

      {!selectedId && (
        <StatsEmptyState
          title="Select a category"
          description="Click on any row above to view its per-period stats and trend charts."
        />
      )}

      <CreateCategoryModal
        isOpen={createOpen}
        isPending={createMut.isPending}
        error={createMut.error}
        onClose={() => {
          createMut.reset();
          setCreateOpen(false);
        }}
        onConfirm={handleCreate}
      />

      <ReasonActionModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget ? `Soft-delete "${deleteTarget.title}"?` : ''}
        message="The category will be hidden from the storefront and can no longer be assigned to new products."
        variant="danger"
        confirmText="Soft delete"
        reasonPlaceholder="Why is this category being deleted?"
        isPending={deleteMut.isPending}
        error={deleteMut.error}
        onClose={() => {
          deleteMut.reset();
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
      />

      <EditCategoryImageModal
        isOpen={Boolean(editTarget)}
        isPending={imageMut.isPending}
        error={imageMut.error}
        title={editTarget?.title ?? ''}
        initialImage={editTarget?.image ?? ''}
        onClose={() => {
          imageMut.reset();
          setEditTarget(null);
        }}
        onConfirm={handleEditImage}
      />
    </>
  );
}
