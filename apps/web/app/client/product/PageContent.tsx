"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@ecomerece/frontend/theme";
import { trackView } from "@/lib/analytics";
import {
    ShoppingCart,
    Heart,
    CheckCircle,
    Truck,
    RefreshCw,
    Zap,
    Edit,
    Trash2,
    Plus,
    Star,
    ChevronRight,
} from "lucide-react";
import { ProductResponseReadModel, ProductVariantResponseReadModel } from "@ecomerece/shared";

const PRODUCT_ACCENT = "#4A7FB5";
const PRODUCT_ACCENT_TEXT = "#2F5F8C";

interface ProductPageProps {
    product: ProductResponseReadModel;
    variants?: ProductVariantResponseReadModel[];
    relatedProducts?: ProductResponseReadModel[];
}

const reviewsData = [
    {
        author: "Sarah Johnson",
        date: "2026-08-15",
        rating: 5,
        text: "Absolutely love this product! The quality is top-notch and it's extremely well made.",
    },
    {
        author: "Michael Chen",
        date: "2026-08-10",
        rating: 4,
        text: "Great build and presentation. Only minor issue is shipping took an extra day.",
    },
];

function StarRating({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    className={`${size} ${n <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-transparent text-neutral-300"}`}
                />
            ))}
        </div>
    );
}

export default function ProductContentPage({
    product,
    variants = [],
    relatedProducts = []
}: ProductPageProps) {
    const { darkMode } = useThemeStore();

    useEffect(() => {
        trackView('product', product.id);
    }, [product.id]);

    // Safely compute active variants and fallback to empty array if undefined
    const activeVariants = (variants || []).filter((v) => v?.active);

    // Safely retrieve initial variant
    const initialVariant = activeVariants[0] || variants?.[0] || null;
    const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponseReadModel | null>(initialVariant);

    const [activeTab, setActiveTab] = useState("description");
    const [activeImage, setActiveImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const productImages = ["product1", "product1b", "product1c", "product1d"];
    const avgRating = 4.8;
    const totalReviews = 2345;

    // Price safety checks
    const variantPrice = selectedVariant?.price ?? 0;
    const variantDiscountedPrice = selectedVariant?.discountedPrice ?? variantPrice;
    const hasDiscount = variantDiscountedPrice < variantPrice;
    const discountPercent = hasDiscount && variantPrice > 0
        ? Math.round((1 - variantDiscountedPrice / variantPrice) * 100)
        : 0;

    const borderColor = darkMode ? "border-neutral-800" : "border-neutral-200";
    const mutedText = darkMode ? "text-neutral-400" : "text-neutral-500";
    const headingText = darkMode ? "text-white" : "text-neutral-900";

    const tabs = [
        { key: "description", label: "Description" },
        { key: "materials", label: product?.ingredient?.isIngredients ? "Ingredients" : "Materials" },
        { key: "goodToKnow", label: "Good to know" },
        { key: "reviews", label: `Reviews (${reviewsData.length})` },
    ];

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"}`}
            style={{
                "--accent": PRODUCT_ACCENT,
                "--accent-text": darkMode ? PRODUCT_ACCENT : PRODUCT_ACCENT_TEXT,
            } as React.CSSProperties}
        >
            {/* Breadcrumb */}
            <div className="py-4">
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-sm ${mutedText}`}>
                    <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-neutral-900"}`}>Home</a>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-neutral-900"}`}>Store</a>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <span className={`font-medium truncate ${headingText}`}>{product?.title}</span>
                </div>
            </div>

            {/* Product main */}
            <section className="py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                    {/* Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className={`aspect-square rounded-2xl overflow-hidden ${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`}>
                            <img
                                src={`https://picsum.photos/seed/${productImages[activeImage] || "product1"}/600/600`}
                                alt={product?.title || "Product image"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {productImages.map((seed, idx) => (
                                <button
                                    key={seed}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors shrink-0 ${idx === activeImage ? "border-[var(--accent)]" : borderColor}`}
                                    aria-label={`View image ${idx + 1}`}
                                >
                                    <img src={`https://picsum.photos/seed/${seed}/100/100`} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product info */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{product?.title}</h1>

                        <div className="flex items-center gap-2 mb-4">
                            <StarRating rating={avgRating} />
                            <span className="font-medium">{avgRating}</span>
                            <span className={mutedText}>({totalReviews.toLocaleString()} reviews)</span>
                        </div>

                        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                            <span className="text-3xl font-bold">${variantDiscountedPrice.toFixed(2)}</span>
                            {hasDiscount && (
                                <>
                                    <span className={`text-lg line-through ${mutedText}`}>
                                        ${variantPrice.toFixed(2)}
                                    </span>
                                    <span className="bg-[var(--accent)] text-white px-2.5 py-1 rounded-full text-sm font-semibold">
                                        Save {discountPercent}%
                                    </span>
                                </>
                            )}
                        </div>

                        <p className={`mb-6 leading-relaxed ${mutedText}`}>
                            {product?.description}
                        </p>

                        {/* Variant selector */}
                        {activeVariants.length > 0 && selectedVariant && (
                            <div className="mb-6">
                                <span className="font-semibold block mb-2 text-sm">Variant ({selectedVariant.title})</span>
                                <div className="flex gap-2 flex-wrap">
                                    {activeVariants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${selectedVariant?.id === variant.id
                                                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                                                : `${borderColor} ${darkMode ? "text-neutral-300" : "text-neutral-700"} hover:border-[var(--accent-text)]`}`}
                                        >
                                            {variant.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3 flex-wrap mb-6">
                            <button className={`flex-1 min-w-[140px] px-5 py-3 sm:px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-[var(--accent)] hover:text-white ${darkMode ? "bg-white text-black" : "bg-neutral-900 text-white"}`}>
                                <ShoppingCart className="w-5 h-5" /> Add to cart
                            </button>
                            <button className="flex-1 min-w-[140px] px-5 py-3 sm:px-6 bg-[var(--accent)] text-white rounded-full font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90">
                                <Zap className="w-5 h-5" /> Buy now
                            </button>
                            <button
                                onClick={() => setIsWishlisted((w) => !w)}
                                aria-pressed={isWishlisted}
                                aria-label="Save to wishlist"
                                className={`px-4 py-3 border rounded-full flex items-center justify-center transition-colors ${borderColor} ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"}`}
                            >
                                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-[var(--accent)] text-[var(--accent)]" : ""}`} />
                            </button>
                        </div>

                        {/* Meta info */}
                        <div className={`flex gap-4 flex-wrap text-sm ${mutedText}`}>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-emerald-500" /> In stock
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Truck className="w-4 h-4" /> Free shipping over $50
                            </span>
                            <span className="flex items-center gap-1.5">
                                <RefreshCw className="w-4 h-4" /> 30-day returns
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className={`py-8 border-t ${borderColor}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className={`flex gap-2 border-b mb-6 overflow-x-auto ${borderColor}`}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${activeTab === tab.key
                                    ? "border-[var(--accent)] text-[var(--accent-text)]"
                                    : `border-transparent ${mutedText} ${darkMode ? "hover:text-white" : "hover:text-neutral-900"}`}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className={`max-w-3xl ${mutedText}`}>
                        {activeTab === "description" && (
                            <div>
                                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>Product description</h3>
                                <p className="leading-relaxed">{product?.description}</p>
                            </div>
                        )}
                        {activeTab === "materials" && (
                            <div>
                                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>
                                    {product?.ingredient?.isIngredients ? "Ingredients" : "Materials & Composition"}
                                </h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    {product?.ingredient?.ingredients?.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    )) || <li>No ingredient data available</li>}
                                </ul>
                            </div>
                        )}
                        {activeTab === "goodToKnow" && (
                            <div>
                                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>Good to know</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Appearance setting: {product?.appearance}</li>
                                    <li>Product version: {product?.version}</li>
                                    <li>Carefully inspected and securely packaged prior to dispatch.</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === "reviews" && (
                            <div>
                                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                    <h3 className={`text-xl font-semibold ${headingText}`}>Customer reviews</h3>
                                    <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors hover:bg-[var(--accent)] hover:text-white ${darkMode ? "bg-white text-black" : "bg-neutral-900 text-white"}`}>
                                        <Plus className="w-4 h-4" /> Write a review
                                    </button>
                                </div>
                                {reviewsData.map((review, idx) => (
                                    <div key={idx} className={`border-b py-4 ${borderColor}`}>
                                        <div className="flex items-center gap-3 flex-wrap mb-2">
                                            <span className={`font-semibold ${headingText}`}>{review.author}</span>
                                            <span className={`text-sm ${mutedText}`}>{review.date}</span>
                                            <StarRating rating={review.rating} size="w-3.5 h-3.5" />
                                        </div>
                                        <p className="mb-2">{review.text}</p>
                                        <div className="flex gap-2">
                                            <button className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition-colors ${borderColor} ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"}`}>
                                                <Edit className="w-3 h-3" /> Edit
                                            </button>
                                            <button className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition-colors ${borderColor} ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"}`}>
                                                <Trash2 className="w-3 h-3" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related products */}
            <section className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">You might also like</h2>
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="flex gap-4 w-max">
                            {relatedProducts?.map((related) => (
                                <a
                                    key={related.id}
                                    href={`/product/${related.id}`}
                                    className={`group rounded-2xl overflow-hidden border w-44 sm:w-48 shrink-0 transition-all duration-300 hover:shadow-lg ${darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}
                                >
                                    <div className={`m-2 aspect-square rounded-xl overflow-hidden ${darkMode ? "bg-neutral-800" : "bg-neutral-100"}`}>
                                        <img
                                            src={
                                                related.image?.images?.find((img) => img.default)?.url ||
                                                related.image?.images?.[0]?.url ||
                                                '/placeholder.jpg'
                                            }
                                            alt={related.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="px-3 pb-3">
                                        <div className="text-sm font-semibold leading-snug mb-1">{related.title}</div>
                                        <div className="text-base font-bold">${related.minDiscountedPrice}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}