'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import {
  type AdminUsersInfiniteFilters,
  USER_QUERY_KEY,
  useAssignRole,
  useBanLift,
  useBanUser,
  useBlockLift,
  useBlockUser,
  useGetAdminUsersInfinite,
  useRecoverUser,
  useSoftDeleteUser,
} from '@ecomerece/frontend/user';
import type { UserResponseReadModel, UserRolesType } from '@ecomerece/shared';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Loader2,
  Lock,
  MoreVertical,
  RotateCcw,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Unlock,
  UserCog,
  Users,
  UserX,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type UserActionKind, UserActionModal, type UserActionPayload } from './UserActionModal';

type StatusFilter = 'all' | 'active' | 'blocked' | 'banned' | 'deleted';
type RoleFilter = 'all' | UserRolesType;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'banned', label: 'Banned' },
  { value: 'deleted', label: 'Deleted' },
];

const ROLE_OPTIONS: RoleFilter[] = ['all', 'customer', 'vendor', 'admin'];

const SKELETON_KEYS = ['s-1', 's-2', 's-3', 's-4', 's-5', 's-6', 's-7', 's-8'];

const AVATAR_COLORS = [
  'from-violet-500 to-fuchsia-500',
  'from-blue-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-rose-500 to-pink-400',
];

function initialsOf(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function colorIndex(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) % 997;
  return h % AVATAR_COLORS.length;
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return 'Never';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function AdminUsersTable() {
  const { darkMode } = useThemeStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [role, setRole] = useState<RoleFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [action, setAction] = useState<{
    user: UserResponseReadModel;
    kind: UserActionKind;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const filters: AdminUsersInfiniteFilters = useMemo(() => {
    const f: AdminUsersInfiniteFilters = {};
    if (debouncedSearch) f.search = debouncedSearch;
    if (role !== 'all') f.role = role;
    if (status === 'blocked') f.blocked = true;
    else if (status === 'banned') f.banned = true;
    else if (status === 'deleted') f.deleted = true;
    else if (status === 'active') {
      f.blocked = false;
      f.banned = false;
      f.deleted = false;
    }
    return f;
  }, [debouncedSearch, role, status]);

  const { data, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetAdminUsersInfinite(filters);

  const rows = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  // ── Infinite scroll sentinel ─────────────────────────────────────────────
  const sentinelRef = useRef<HTMLTableRowElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const blockUser = useBlockUser();
  const blockLift = useBlockLift();
  const banUser = useBanUser();
  const banLift = useBanLift();
  const deleteUser = useSoftDeleteUser();
  const recoverUser = useRecoverUser();
  const assignRole = useAssignRole();

  const activeMutation = (() => {
    switch (action?.kind) {
      case 'block':
        return blockUser;
      case 'unblock':
        return blockLift;
      case 'ban':
        return banUser;
      case 'unban':
        return banLift;
      case 'delete':
        return deleteUser;
      case 'recover':
        return recoverUser;
      case 'role':
        return assignRole;
      default:
        return null;
    }
  })();

  const closeAction = () => {
    blockUser.reset();
    blockLift.reset();
    banUser.reset();
    banLift.reset();
    deleteUser.reset();
    recoverUser.reset();
    assignRole.reset();
    setAction(null);
  };

  const handleConfirm = async (payload: UserActionPayload) => {
    if (!action) return;
    const { user, kind } = action;

    const withReason = ['block', 'ban', 'delete', 'role'] as const;
    if (withReason.includes(kind as (typeof withReason)[number]) && !payload.reason?.trim()) return;

    const run = async () => {
      switch (kind) {
        case 'block':
          await blockUser.mutateAsync({ userId: user.id, reason: payload.reason?.trim() ?? '' });
          break;
        case 'unblock':
          await blockLift.mutateAsync(user.id);
          break;
        case 'ban':
          await banUser.mutateAsync({
            userId: user.id,
            forDays: payload.forDays ?? 7,
            reason: payload.reason?.trim() ?? '',
          });
          break;
        case 'unban':
          await banLift.mutateAsync(user.id);
          break;
        case 'delete':
          await deleteUser.mutateAsync({ userId: user.id, reason: payload.reason?.trim() ?? '' });
          break;
        case 'recover':
          await recoverUser.mutateAsync(user.id);
          break;
        case 'role':
          await assignRole.mutateAsync({
            userId: user.id,
            role: payload.role ?? user.role,
            reason: payload.reason?.trim() ?? '',
          });
          break;
      }
    };

    try {
      await run();
      await queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, 'admin-infinite'] });
      closeAction();
    } catch {
      // Error is surfaced through the modal (activeMutation.error)
    }
  };

  // ── Menu items per user ──────────────────────────────────────────────────
  const menuItemsFor = (u: UserResponseReadModel) => {
    const items: {
      kind: UserActionKind;
      label: string;
      icon: React.ElementType;
      danger?: boolean;
    }[] = [];
    if (u.isBlocked) {
      items.push({ kind: 'unblock', label: 'Lift block', icon: Unlock });
    } else {
      items.push({ kind: 'block', label: 'Block', icon: Lock, danger: true });
    }
    if (u.isBanned) {
      items.push({ kind: 'unban', label: 'Lift ban', icon: ShieldCheck });
    } else {
      items.push({ kind: 'ban', label: 'Ban', icon: ShieldOff, danger: true });
    }
    if (u.isDeleted) {
      items.push({ kind: 'recover', label: 'Recover', icon: RotateCcw });
    } else {
      items.push({ kind: 'delete', label: 'Soft delete', icon: Trash2, danger: true });
    }
    items.push({ kind: 'role', label: 'Change role', icon: UserCog });
    return items;
  };

  const rolePill = (r: UserRolesType) => {
    if (r === 'admin') {
      return darkMode
        ? 'bg-violet-900/30 text-violet-400 border-violet-500/30'
        : 'bg-violet-100 text-violet-700 border-violet-200';
    }
    if (r === 'vendor') {
      return darkMode
        ? 'bg-blue-900/30 text-blue-400 border-blue-500/30'
        : 'bg-blue-100 text-blue-700 border-blue-200';
    }
    return darkMode
      ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
      : 'bg-neutral-100 text-neutral-600 border-neutral-200';
  };

  const statusPills = (u: UserResponseReadModel) => {
    const pills: { label: string; cls: string }[] = [];
    if (u.isDeleted) {
      pills.push({
        label: 'Deleted',
        cls: darkMode
          ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
          : 'bg-neutral-200 text-neutral-600 border-neutral-300',
      });
    }
    if (u.isBlocked) {
      pills.push({
        label: 'Blocked',
        cls: darkMode
          ? 'bg-amber-900/30 text-amber-400 border-amber-500/30'
          : 'bg-amber-100 text-amber-700 border-amber-200',
      });
    }
    if (u.isBanned) {
      pills.push({
        label: u.bannedUntil ? `Banned · until ${formatDate(u.bannedUntil)}` : 'Banned',
        cls: darkMode
          ? 'bg-rose-900/30 text-rose-400 border-rose-500/30'
          : 'bg-rose-100 text-rose-700 border-rose-200',
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

  // ── Theme helpers ────────────────────────────────────────────────────────
  const card = `rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white shadow-sm border border-transparent'}`;
  const inputCls = darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-violet-500';
  const thCls = darkMode ? 'text-neutral-500' : 'text-neutral-500';
  const rowHover = darkMode ? 'hover:bg-neutral-800/60' : 'hover:bg-neutral-50';
  const menuBtnCls = darkMode
    ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
    : 'hover:bg-neutral-100 text-neutral-500 hover:text-black';

  const cellBase = 'px-5 py-4';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${card} relative`}
    >
      {/* ── Header + filters ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
              All Users
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Browse every account. Select a user to manage access.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${inputCls}`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                  darkMode
                    ? 'hover:bg-neutral-700 text-neutral-400'
                    : 'hover:bg-neutral-100 text-neutral-500'
                }`}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role select */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleFilter)}
            className={`px-4 py-2.5 rounded-2xl border text-sm font-medium outline-none transition-colors focus:ring-2 focus:ring-violet-500 cursor-pointer ${inputCls}`}
            aria-label="Filter by role"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r} className={darkMode ? 'bg-neutral-800' : 'bg-white'}>
                {r === 'all' ? 'All roles' : r[0].toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const active = status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : darkMode
                      ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div
          className={`mt-6 rounded-[20px] border ${darkMode ? 'border-neutral-800' : 'border-neutral-100'} overflow-hidden`}
        >
          {SKELETON_KEYS.map((k) => (
            <div
              key={k}
              className={`flex items-center gap-4 px-5 py-4 ${darkMode ? 'bg-neutral-900' : 'bg-white'} border-b ${
                darkMode ? 'border-neutral-800' : 'border-neutral-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full shrink-0 animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
              />
              <div className="flex-1 space-y-2">
                <div
                  className={`h-3.5 w-40 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                />
                <div
                  className={`h-3 w-56 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                />
              </div>
              <div
                className={`h-6 w-20 rounded-full animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
              />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div
          className={`mt-6 rounded-[20px] border p-8 text-center ${darkMode ? 'border-neutral-800 text-neutral-400' : 'border-neutral-100 text-neutral-600'}`}
        >
          <UserX className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">Couldn&apos;t load users.</p>
          <p className="text-xs mt-1 opacity-70">{(error as Error)?.message ?? 'Unknown error'}</p>
        </div>
      ) : rows.length === 0 ? (
        <div
          className={`mt-6 rounded-[20px] border p-10 text-center ${darkMode ? 'border-neutral-800 text-neutral-400' : 'border-neutral-100 text-neutral-600'}`}
        >
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">No users match these filters.</p>
          <p className="text-xs mt-1 opacity-70">
            Try clearing the search or switching the status filter.
          </p>
        </div>
      ) : (
        <div
          className={`mt-6 rounded-[20px] border ${darkMode ? 'border-neutral-800' : 'border-neutral-100'} overflow-x-auto`}
        >
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-neutral-800' : 'border-neutral-100'}`}>
                <th
                  className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  User
                </th>
                <th
                  className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Role
                </th>
                <th
                  className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Status
                </th>
                <th
                  className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Joined
                </th>
                <th
                  className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Last login
                </th>
                <th
                  className={`text-right px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr
                  key={u.id}
                  className={`border-b last:border-b-0 transition-colors ${rowHover} ${darkMode ? 'border-neutral-800' : 'border-neutral-100'}`}
                >
                  <td className={cellBase}>
                    <div className="flex items-center gap-3">
                      {u.image ? (
                        // biome-ignore lint/performance/noImgElement: small rounded user avatar
                        <img
                          src={u.image}
                          alt={u.fullName}
                          className="w-10 h-10 rounded-full object-cover bg-neutral-200"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIndex(u.fullName)]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                        >
                          {initialsOf(u.fullName)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold truncate max-w-[200px]">{u.fullName}</p>
                        <p
                          className={`text-xs truncate max-w-[220px] ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
                        >
                          {u.email ?? 'No email'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={cellBase}>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${rolePill(u.role)}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className={cellBase}>
                    <div className="flex flex-wrap gap-1.5">
                      {statusPills(u).map((p) => (
                        <span
                          key={p.label}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${p.cls}`}
                        >
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`${cellBase} whitespace-nowrap`}>{formatDate(u.createdAt)}</td>
                  <td className={`${cellBase} whitespace-nowrap`}>{formatDate(u.lastLogin)}</td>
                  <td className={`${cellBase} text-right`}>
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() => setMenuUserId((prev) => (prev === u.id ? null : u.id))}
                        className={`p-2 rounded-full transition-colors ${menuBtnCls} ${menuUserId === u.id ? (darkMode ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black') : ''}`}
                        aria-label={`Actions for ${u.fullName}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {menuUserId === u.id && (
                          <>
                            <button
                              type="button"
                              tabIndex={-1}
                              aria-label="Close menu"
                              className="fixed inset-0 z-20 cursor-default"
                              onClick={() => setMenuUserId(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.15 }}
                              className={`absolute right-0 top-full mt-1 z-30 w-52 rounded-2xl border shadow-xl overflow-hidden ${
                                darkMode
                                  ? 'bg-neutral-900 border-neutral-700 shadow-black/40'
                                  : 'bg-white border-neutral-200 shadow-neutral-200/60'
                              }`}
                            >
                              {menuItemsFor(u).map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                  <React.Fragment key={item.kind}>
                                    {idx > 0 && idx !== menuItemsFor(u).length - 1 && (
                                      <div
                                        className={`h-px ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'} my-1`}
                                      />
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMenuUserId(null);
                                        setAction({ user: u, kind: item.kind });
                                      }}
                                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                                        item.danger
                                          ? darkMode
                                            ? 'text-rose-400 hover:bg-rose-500/10'
                                            : 'text-rose-600 hover:bg-rose-50'
                                          : darkMode
                                            ? 'text-neutral-200 hover:bg-neutral-800'
                                            : 'text-neutral-700 hover:bg-neutral-50'
                                      }`}
                                    >
                                      <Icon className="w-4 h-4" />
                                      {item.label}
                                    </button>
                                  </React.Fragment>
                                );
                              })}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Scroll sentinel / loader */}
              <tr ref={sentinelRef} className={darkMode ? 'bg-neutral-900' : 'bg-white'}>
                <td colSpan={6} className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2 text-xs font-medium h-6">
                    {isFetchingNextPage ? (
                      <>
                        <Loader2
                          className={`w-4 h-4 animate-spin ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}
                        />
                        <span className={darkMode ? 'text-neutral-400' : 'text-neutral-500'}>
                          Loading more…
                        </span>
                      </>
                    ) : !hasNextPage ? (
                      <span className={darkMode ? 'text-neutral-600' : 'text-neutral-400'}>
                        You&apos;ve reached the end of the list.
                      </span>
                    ) : null}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── Action confirm modal ──────────────────────────────────────── */}
      <UserActionModal
        user={action?.user ?? null}
        action={action?.kind ?? null}
        isPending={activeMutation?.isPending ?? false}
        error={activeMutation?.error}
        onClose={closeAction}
        onConfirm={handleConfirm}
      />
    </motion.div>
  );
}
