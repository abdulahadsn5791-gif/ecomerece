import { VendorEditProductPage } from '@/components/vendor-products/VendorEditProductPage';

export default async function EditProductRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VendorEditProductPage productId={id} />;
}
