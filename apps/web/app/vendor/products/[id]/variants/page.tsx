import { VendorProductVariantsPage } from '@/components/vendor-products/VendorProductVariantsPage';

export default async function VendorVariantsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VendorProductVariantsPage productId={id} />;
}
