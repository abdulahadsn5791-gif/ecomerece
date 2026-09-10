'use client';

import { Users } from 'lucide-react';
import { AdminPlaceholder } from '../components/AdminPlaceholder';

export default function AdminUsersPage() {
  return (
    <AdminPlaceholder
      title="Users"
      description="View and manage user accounts, roles, and permissions."
      icon={Users}
    />
  );
}
