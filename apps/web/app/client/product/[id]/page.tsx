import { ProductResponseReadModel, ProductVariantResponseReadModel } from "@ecomerece/shared";
import ProductContentPage from "../PageContent";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const { id } = await params;

    const proudctRes = await fetch(`${BASE_URL}/product/${id}`);
    const productObj = await proudctRes.json();
    if (!productObj?.success) throw new Error('Product not found');
    const product = productObj.data as ProductResponseReadModel
    const variantRes = await fetch(`${BASE_URL}/product-variant/${id}`);
    const variantsObj = await variantRes.json();
    if (!variantsObj?.success) throw new Error('Variants not found');
    const variants = variantsObj.data as ProductVariantResponseReadModel[]

    return <ProductContentPage product={product} variants={variants} />
}