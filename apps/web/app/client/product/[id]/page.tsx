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
    const relatedRes = await fetch(`${BASE_URL}/product-variant/${id}`)
    const relatedObj = await relatedRes.json();
    const relatedProducts = relatedObj.data as ProductResponseReadModel[]

    //   { id: 1, vendor: "SoundMax", name: "Portable Bluetooth Speaker - Deep Bass", price: "$59.99", image: "https://picsum.photos/seed/related1/400/400" },

    return <ProductContentPage product={product} variants={variants} relatedProducts={relatedProducts} />
}