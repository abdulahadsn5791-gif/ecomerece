'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { AdminUsersTable } from '@/components/admin-users/AdminUsersTable';

export default function AdminUsersPage() {
  const { darkMode } = useThemeStore();

  return (
    <main className="lg:col-span-3 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white shadow-sm'}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              darkMode ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-100 text-violet-600'
            }`}
          >
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Manage every account on the platform — block, ban, delete, or change roles.
            </p>
          </div>
        </div>
      </motion.div>

      <AdminUsersTable />
    </main>
  );
}
