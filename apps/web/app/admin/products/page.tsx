'use client';

import { ShoppingBag } from 'lucide-react';
import { AdminPlaceholder } from '../components/AdminPlaceholder';

export default function AdminProductsPage() {
  return (
    <AdminPlaceholder
      title="Products"
      description="Manage your product catalog, inventory, and variants."
      icon={ShoppingBag}
    />
  );
}
