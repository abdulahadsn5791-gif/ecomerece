'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import type { UserResponseReadModel, UserRolesType } from '@ecomerece/shared';
import type React from 'react';
import { GenericConfirmModal, type ModalVariant } from '@/components/GenericConfirmModal';

export type UserActionKind = 'block' | 'unblock' | 'ban' | 'unban' | 'delete' | 'recover' | 'role';

export interface UserActionPayload {
  reason?: string;
  forDays?: number;
  role?: UserRolesType;
}

interface UserActionModalProps {
  user: UserResponseReadModel | null;
  action: UserActionKind | null;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (payload: UserActionPayload) => void;
}

const ROLES: UserRolesType[] = ['customer', 'vendor', 'admin'];

function fieldCls(darkMode: boolean) {
  return `w-full px-4 py-3 rounded-2xl text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${
    darkMode
      ? 'bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500'
      : 'bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-violet-500'
  }`;
}

function ActionFields({
  action,
  payload,
  updatePayload,
  darkMode,
}: {
  action: UserActionKind;
  payload: Partial<UserActionPayload>;
  updatePayload: (updates: Partial<UserActionPayload>) => void;
  darkMode: boolean;
}) {
  switch (action) {
    case 'role':
      return (
        <div className="space-y-4">
          <label className="block">
            <span
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Role
            </span>
            <select
              value={payload.role ?? 'customer'}
              onChange={(e) => updatePayload({ role: e.target.value as UserRolesType })}
              className={fieldCls(darkMode)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className={darkMode ? 'bg-neutral-800' : 'bg-white'}>
                  {r[0].toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Reason <span className="text-red-500">*</span>
            </span>
            <textarea
              value={payload.reason ?? ''}
              onChange={(e) => updatePayload({ reason: e.target.value })}
              placeholder="Why is this role being assigned?"
              rows={2}
              className={`${fieldCls(darkMode)} resize-none`}
            />
          </label>
        </div>
      );
    case 'ban':
      return (
        <div className="space-y-4">
          <label className="block">
            <span
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Duration (days) <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              min={1}
              value={payload.forDays ?? 7}
              onChange={(e) => updatePayload({ forDays: Number(e.target.value) })}
              className={fieldCls(darkMode)}
            />
          </label>
          <label className="block">
            <span
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Reason <span className="text-red-500">*</span>
            </span>
            <textarea
              value={payload.reason ?? ''}
              onChange={(e) => updatePayload({ reason: e.target.value })}
              placeholder="Why is this user being banned?"
              rows={2}
              className={`${fieldCls(darkMode)} resize-none`}
            />
          </label>
        </div>
      );
    case 'block':
    case 'delete':
      return (
        <label className="block">
          <span
            className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
              darkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            Reason <span className="text-red-500">*</span>
          </span>
          <textarea
            value={payload.reason ?? ''}
            onChange={(e) => updatePayload({ reason: e.target.value })}
            placeholder={
              action === 'block'
                ? 'Why is this user being blocked?'
                : 'Why is this account being deleted?'
            }
            rows={2}
            className={`${fieldCls(darkMode)} resize-none`}
          />
        </label>
      );
    default:
      return null;
  }
}

export function UserActionModal({
  user,
  action,
  isPending,
  error,
  onClose,
  onConfirm,
}: UserActionModalProps) {
  const { darkMode } = useThemeStore();
  const name = user?.fullName ?? 'this user';

  if (!user || !action) return null;

  const config: Record<
    UserActionKind,
    {
      title: string;
      message: React.ReactNode;
      variant: ModalVariant;
      confirmText: string;
      needsPayload?: boolean;
    }
  > = {
    block: {
      title: `Block ${name}?`,
      message:
        'This user will no longer be able to sign in or use their account until the block is lifted.',
      variant: 'warning',
      confirmText: 'Block user',
      needsPayload: true,
    },
    unblock: {
      title: `Lift block on ${name}?`,
      message: 'The user will be able to sign back in normally.',
      variant: 'info',
      confirmText: 'Lift block',
    },
    ban: {
      title: `Ban ${name}?`,
      message: 'A temporary ban will revoke access for the chosen period. It can be lifted early.',
      variant: 'danger',
      confirmText: 'Ban user',
      needsPayload: true,
    },
    unban: {
      title: `Lift ban on ${name}?`,
      message: 'The ban will be removed and access restored immediately.',
      variant: 'success',
      confirmText: 'Lift ban',
    },
    delete: {
      title: `Delete ${name}?`,
      message: 'Their account will be soft-deleted and hidden from the storefront until recovered.',
      variant: 'danger',
      confirmText: 'Delete user',
      needsPayload: true,
    },
    recover: {
      title: `Recover ${name}?`,
      message: 'The soft-deleted account will be restored.',
      variant: 'success',
      confirmText: 'Recover user',
    },
    role: {
      title: `Change role of ${name}?`,
      message: 'Assign a new role. Provide a short reason for the audit trail.',
      variant: 'confirm',
      confirmText: 'Assign role',
      needsPayload: true,
    },
  };

  const cfg = config[action];
  const isOpen = Boolean(user && action);

  return (
    <GenericConfirmModal<UserActionPayload>
      isOpen={isOpen}
      onClose={onClose}
      title={cfg.title}
      message={cfg.message}
      variant={cfg.variant}
      confirmText={cfg.confirmText}
      cancelText="Cancel"
      isLoading={isPending}
      error={error}
      wide={action === 'role' || action === 'ban'}
      defaultPayload={{ forDays: 7, role: user.role }}
      onConfirm={onConfirm}
      renderFields={(payload, updatePayload) => (
        <ActionFields
          action={action}
          payload={payload}
          updatePayload={updatePayload}
          darkMode={darkMode}
        />
      )}
    />
  );
}
