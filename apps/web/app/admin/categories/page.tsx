'use client';

import { Tag } from 'lucide-react';
import { AdminPlaceholder } from '../components/AdminPlaceholder';

export default function AdminCategoriesPage() {
  return (
    <AdminPlaceholder
      title="Categories"
      description="Organize your products into categories and subcategories."
      icon={Tag}
    />
  );
}
