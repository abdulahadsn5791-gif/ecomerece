"use client";

import { useState } from "react";
import { useThemeStore } from "@ecomerece/frontend";
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

// Matches the Electronics category accent used elsewhere on the site, so landing here
// from that category feels like the same place rather than a different template.
const PRODUCT_ACCENT = "#4A7FB5";
const PRODUCT_ACCENT_TEXT = "#2F5F8C"; // deeper variant, used for text/borders in light mode

const productName = "Wireless Noise-Cancelling Headphones Pro";
const productImages = ["product1", "product1b", "product1c", "product1d"];
const avgRating = 4.8;
const totalReviews = 2345;

const variants = [
    { id: 1, title: "Black", price: 149.99, discountedPrice: 129.99 },
    { id: 2, title: "Silver", price: 179.99, discountedPrice: 159.99 },
    { id: 3, title: "Blue", price: 199.99, discountedPrice: 179.99 },
];

const reviewsData = [
    {
        author: "Sarah Johnson",
        date: "2026-08-15",
        rating: 5,
        text: "Absolutely love these headphones! The noise cancellation is top-notch and they're extremely comfortable for long listening sessions.",
    },
    {
        author: "Michael Chen",
        date: "2026-08-10",
        rating: 4,
        text: "Great sound quality and build. Battery life is excellent — only minor issue is the ear cups could be a bit softer.",
    },
    {
        author: "Emily Davis",
        date: "2026-08-05",
        rating: 5,
        text: "Best headphones I've owned. Worth every penny, and a great pick for anyone who wants a premium audio experience.",
    },
];

const relatedProducts = [
    { id: 1, vendor: "SoundMax", name: "Portable Bluetooth Speaker - Deep Bass", price: "$59.99", image: "https://picsum.photos/seed/related1/400/400" },
    { id: 2, vendor: "TechNova", name: "Wireless Earbuds Pro", price: "$89.99", image: "https://picsum.photos/seed/related2/400/400" },
    { id: 3, vendor: "AudioTech", name: "Over-Ear Studio Headphones", price: "$199.99", image: "https://picsum.photos/seed/related3/400/400" },
    { id: 4, vendor: "FitLife", name: "Sports Wireless Earphones", price: "$49.99", image: "https://picsum.photos/seed/related4/400/400" },
    { id: 5, vendor: "BassBoost", name: "Noise-Cancelling Earbuds", price: "$129.99", image: "https://picsum.photos/seed/related5/400/400" },
];

const tabs = [
    { key: "description", label: "Description" },
    { key: "materials", label: "Materials" },
    { key: "goodToKnow", label: "Good to know" },
    { key: "reviews", label: `Reviews (${reviewsData.length})` },
];

function StarRating({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    className={`${size} ${n <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-transparent text-neutral-300"
                        }`}
                />
            ))}
        </div>
    );
}

export default function ProductPage() {
    const { darkMode } = useThemeStore();
    const [selectedVariant, setSelectedVariant] = useState(variants[0]);
    const [activeTab, setActiveTab] = useState(tabs[0].key);
    const [activeImage, setActiveImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const hasDiscount = selectedVariant.discountedPrice < selectedVariant.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - selectedVariant.discountedPrice / selectedVariant.price) * 100)
        : 0;

    const borderColor = darkMode ? "border-neutral-800" : "border-neutral-200";
    const mutedText = darkMode ? "text-neutral-400" : "text-neutral-500";
    const headingText = darkMode ? "text-white" : "text-neutral-900";

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"
                }`}
            style={
                {
                    "--accent": PRODUCT_ACCENT,
                    "--accent-text": darkMode ? PRODUCT_ACCENT : PRODUCT_ACCENT_TEXT,
                } as React.CSSProperties
            }
        >
            {/* Breadcrumb */}
            <div className="py-4">
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-sm ${mutedText}`}>
                    <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-neutral-900"}`}>
                        Home
                    </a>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <a href="#" className={`transition-colors ${darkMode ? "hover:text-white" : "hover:text-neutral-900"}`}>
                        Electronics
                    </a>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    <span className={`font-medium truncate ${headingText}`}>{productName}</span>
                </div>
            </div>

            {/* Product main */}
            <section className="py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                    {/* Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className={`aspect-square rounded-2xl overflow-hidden ${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`}>
                            <img
                                src={`https://picsum.photos/seed/${productImages[activeImage]}/600/600`}
                                alt={productName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {productImages.map((seed, idx) => (
                                <button
                                    key={seed}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors shrink-0 ${idx === activeImage ? "border-[var(--accent)]" : borderColor
                                        }`}
                                    aria-label={`View image ${idx + 1}`}
                                >
                                    <img src={`https://picsum.photos/seed/${seed}/100/100`} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product info */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{productName}</h1>

                        <div className="flex items-center gap-2 mb-4">
                            <StarRating rating={avgRating} />
                            <span className="font-medium">{avgRating}</span>
                            <span className={mutedText}>({totalReviews.toLocaleString()} reviews)</span>
                        </div>

                        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                            <span className="text-3xl font-bold">${selectedVariant.discountedPrice.toFixed(2)}</span>
                            {hasDiscount && (
                                <>
                                    <span className={`text-lg line-through ${mutedText}`}>
                                        ${selectedVariant.price.toFixed(2)}
                                    </span>
                                    <span className="bg-[var(--accent)] text-white px-2.5 py-1 rounded-full text-sm font-semibold">
                                        Save {discountPercent}%
                                    </span>
                                </>
                            )}
                        </div>

                        <p className={`mb-6 leading-relaxed ${mutedText}`}>
                            Crystal-clear audio with active noise cancellation, 40-hour battery life and premium comfort —
                            built for travel, work and everyday listening.
                        </p>

                        {/* Variant selector */}
                        <div className="mb-6">
                            <span className="font-semibold block mb-2 text-sm">Color</span>
                            <div className="flex gap-2 flex-wrap">
                                {variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${selectedVariant.id === variant.id
                                                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                                                : `${borderColor} ${darkMode ? "text-neutral-300" : "text-neutral-700"
                                                } hover:border-[var(--accent-text)]`
                                            }`}
                                    >
                                        {variant.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 flex-wrap mb-6">
                            <button
                                className={`flex-1 min-w-[140px] px-5 py-3 sm:px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-[var(--accent)] hover:text-white ${darkMode ? "bg-white text-black" : "bg-neutral-900 text-white"
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" /> Add to cart
                            </button>
                            <button className="flex-1 min-w-[140px] px-5 py-3 sm:px-6 bg-[var(--accent)] text-white rounded-full font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90">
                                <Zap className="w-5 h-5" /> Buy now
                            </button>
                            <button
                                onClick={() => setIsWishlisted((w) => !w)}
                                aria-pressed={isWishlisted}
                                aria-label="Save to wishlist"
                                className={`px-4 py-3 border rounded-full flex items-center justify-center transition-colors ${borderColor} ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"
                                    }`}
                            >
                                <Heart
                                    className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-[var(--accent)] text-[var(--accent)]" : ""
                                        }`}
                                />
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
                                        : `border-transparent ${mutedText} ${darkMode ? "hover:text-white" : "hover:text-neutral-900"}`
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className={`max-w-3xl ${mutedText}`}>
                        {activeTab === "description" && (
                            <div>
                                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>Product description</h3>
                                <p>
                                    These premium wireless headphones deliver exceptional sound quality with active noise
                                    cancellation — perfect for travel, work or everyday listening. Includes a carrying case,
                                    USB-C charging cable and 3.5mm audio cable.
                                </p>
                                <p className="mt-4 font-medium">Key features</p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>Active noise cancellation (ANC)</li>
                                    <li>40-hour battery life</li>
                                    <li>Bluetooth 5.3</li>
                                    <li>Built-in microphone for calls</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === "materials" && (
                            <div>
                                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>Materials</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Aluminum alloy frame</li>
                                    <li>Memory foam ear cushions</li>
                                    <li>Protein leather headband</li>
                                    <li>ABS plastic housing</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === "goodToKnow" && (
                            <div>
                                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>Good to know</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Specifications may vary slightly from the description above.</li>
                                    <li>Avoid exposing the headphones to extreme temperatures.</li>
                                    <li>Battery life depends on usage and active noise cancellation settings.</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === "reviews" && (
                            <div>
                                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                                    <h3 className={`text-xl font-semibold ${headingText}`}>Customer reviews</h3>
                                    <button
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors hover:bg-[var(--accent)] hover:text-white ${darkMode ? "bg-white text-black" : "bg-neutral-900 text-white"
                                            }`}
                                    >
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
                                            <button
                                                className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition-colors ${borderColor} ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"
                                                    }`}
                                            >
                                                <Edit className="w-3 h-3" /> Edit
                                            </button>
                                            <button
                                                className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition-colors ${borderColor} ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"
                                                    }`}
                                            >
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
                            {relatedProducts.map((product) => (
                                <a
                                    key={product.id}
                                    href="#"
                                    className={`group rounded-2xl overflow-hidden border w-44 sm:w-48 shrink-0 transition-all duration-300 hover:shadow-lg ${darkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"
                                        }`}
                                >
                                    <div className={`m-2 aspect-square rounded-xl overflow-hidden ${darkMode ? "bg-neutral-800" : "bg-neutral-100"}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="px-3 pb-3">
                                        <div className={`text-xs mb-0.5 ${mutedText}`}>{product.vendor}</div>
                                        <div className="text-sm font-semibold leading-snug mb-1">{product.name}</div>
                                        <div className="text-base font-bold">{product.price}</div>
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