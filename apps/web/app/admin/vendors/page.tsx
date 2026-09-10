'use client';

import { Truck } from 'lucide-react';
import { AdminPlaceholder } from '../components/AdminPlaceholder';

export default function AdminVendorsPage() {
  return (
    <AdminPlaceholder
      title="Vendors"
      description="Manage vendor accounts, approvals, and payouts."
      icon={Truck}
    />
  );
}
