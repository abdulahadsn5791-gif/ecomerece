import { ProductResponseReadModel, ProductVariantResponseReadModel } from "@ecomerece/shared";
import ProductContentPage from "../PageContent";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const { id } = await params;

    const productRes = await fetch(`${BASE_URL}/product/${id}`);
    const productObj = await productRes.json();
    if (!productObj?.success) throw new Error('Product not found');
    const product = productObj.data as ProductResponseReadModel;

    const relatedParams = new URLSearchParams({
        limit: '20',
        categoryId: product.categoryId,
    });

    const [variantRes, relatedRes] = await Promise.all([
        fetch(`${BASE_URL}/product-variant/${id}`),
        fetch(`${BASE_URL}/product?${relatedParams.toString()}`),
    ]);

    const variantsObj = await variantRes.json();
    if (!variantsObj?.success) throw new Error('Variants not found');
    const variants = variantsObj.data as ProductVariantResponseReadModel[];

    const relatedObj = await relatedRes.json();

    const rawRelated = (relatedObj.data?.data ?? relatedObj.data ?? []) as ProductResponseReadModel[];
    const relatedProducts = rawRelated.filter((p) => p.id !== product.id);

    return <ProductContentPage product={product} variants={variants} relatedProducts={relatedProducts} />;
}