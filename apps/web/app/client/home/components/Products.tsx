"use client";

import { useThemeStore } from "@ecomerece/frontend/theme";
import { useGetPaginatedProducts } from "@ecomerece/frontend/product";
import type { HomeContainerResponse } from "@ecomerece/shared";
import { ShoppingCart, ArrowRight, Sparkles, Star, Heart, Loader2, TrendingUp } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";

export default function Products({ container }: { container: HomeContainerResponse }) {
    const { darkMode } = useThemeStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

    const filter = (container.query?.filter || {}) as Record<string, unknown>;
    const { data, isLoading } = useGetPaginatedProducts({
        categoryId: filter.categoryId as string | undefined,
        vendorId: filter.vendorId as string | undefined,
        appearance: filter.appearance as 'public' | 'private' | undefined,
        search: filter.search as string | undefined,
        limit: container.query?.limit || 20,
        direction: container.query?.direction || 'next',
    });

    const products = data?.data || [];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
        }
    };

    const getBadge = (product: typeof products[number]) => {
        if (!product.inStock) return { label: 'Out of Stock', color: 'bg-neutral-900/60 text-neutral-300' };
        if (product.maxPrice > product.maxDiscountedPrice) {
            const pct = Math.round(((product.maxPrice - product.maxDiscountedPrice) / product.maxPrice) * 100);
            return { label: `−${pct}%`, color: 'bg-rose-500 text-white' };
        }
        if (product.averageRating >= 4.5) return { label: '⭐ Top Rated', color: 'bg-amber-500 text-white' };
        return null;
    };

    const getDefaultImage = (product: typeof products[number]) => {
        const def = product.image?.images?.find((i) => i.default);
        return def?.url || product.image?.images?.[0]?.url || '';
    };

    const toggleWishlist = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setWishlisted(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (isLoading) {
        return (
            <section className={`py-20 sm:py-28 transition-colors duration-500 ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Skeleton header */}
                    <div className="mb-10 sm:mb-14 space-y-3">
                        <div className={`h-5 w-32 rounded-full animate-pulse ${darkMode ? "bg-neutral-800" : "bg-neutral-100"}`} />
                        <div className={`h-10 w-64 rounded-xl animate-pulse ${darkMode ? "bg-neutral-800" : "bg-neutral-100"}`} />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`rounded-2xl overflow-hidden animate-pulse ${darkMode ? "bg-neutral-900" : "bg-neutral-100"}`}>
                                <div className={`aspect-[4/5] ${darkMode ? "bg-neutral-800" : "bg-neutral-200"}`} />
                                <div className="p-4 space-y-2">
                                    <div className={`h-3 w-20 rounded ${darkMode ? "bg-neutral-800" : "bg-neutral-200"}`} />
                                    <div className={`h-4 w-full rounded ${darkMode ? "bg-neutral-800" : "bg-neutral-200"}`} />
                                    <div className={`h-4 w-3/4 rounded ${darkMode ? "bg-neutral-800" : "bg-neutral-200"}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className={`py-20 sm:py-28 transition-colors duration-500 overflow-hidden ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex justify-between items-end mb-10 sm:mb-14 flex-wrap gap-4">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4 border shadow-sm ${darkMode ? "border-neutral-800 bg-neutral-900 text-neutral-300" : "border-neutral-200 bg-neutral-50 text-neutral-700"}`}>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Handpicked Selection</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{container.heading}</h2>
                        {container.subTitle && (
                            <p className={`mt-2 text-sm sm:text-base ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>{container.subTitle}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={() => scroll('left')} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${darkMode ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800" : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm"}`} aria-label="Scroll left">
                                <ArrowRight className="w-4 h-4 rotate-180" />
                            </button>
                            <button onClick={() => scroll('right')} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${darkMode ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800" : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm"}`} aria-label="Scroll right">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <Link href="/client/categories" className={`group inline-flex items-center gap-2 font-semibold text-xs sm:text-sm transition-colors ${darkMode ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`}>
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Grid / Carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-5 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-4 sm:pb-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => {
                        const badge = getBadge(product);
                        const img = getDefaultImage(product);
                        const isWished = wishlisted[product.id] ?? false;
                        const stars = Math.round(product.averageRating ?? 0);
                        const hasDiscount = product.minPrice > product.minDiscountedPrice;

                        return (
                            <Link
                                key={product.id}
                                href={`/client/product/${product.id}`}
                                className={`group relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl shrink-0 w-[68%] sm:w-auto snap-start ${darkMode
                                    ? "bg-neutral-900 border border-neutral-800 hover:border-neutral-700 shadow-lg shadow-black/20"
                                    : "bg-white border border-neutral-100 hover:border-neutral-200 shadow-md shadow-neutral-200/80"
                                }`}
                            >
                                {/* Image area */}
                                <div className={`relative overflow-hidden aspect-[4/5] ${darkMode ? "bg-neutral-800" : "bg-neutral-100"}`}>
                                    {img ? (
                                        <img
                                            src={img}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingCart className={`w-8 h-8 sm:w-10 sm:h-10 ${darkMode ? "text-neutral-700" : "text-neutral-300"}`} />
                                        </div>
                                    )}

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Badge */}
                                    {badge && (
                                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                                            <span className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold tracking-wide uppercase shadow-md ${badge.color}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                    )}

                                    {/* Wishlist button */}
                                    <button
                                        onClick={(e) => toggleWishlist(e, product.id)}
                                        className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${isWished
                                            ? "bg-rose-500 text-white scale-110"
                                            : "bg-white/80 backdrop-blur-sm text-neutral-600 opacity-0 group-hover:opacity-100 hover:bg-white"
                                        }`}
                                        aria-label="Add to wishlist"
                                    >
                                        <Heart className={`w-3.5 h-3.5 ${isWished ? "fill-current" : ""}`} />
                                    </button>

                                    {/* Quick add — slides up on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                                        <button
                                            onClick={(e) => e.preventDefault()}
                                            className="w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white text-neutral-900 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:bg-neutral-100 transition-colors active:scale-95"
                                        >
                                            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            Quick Add
                                        </button>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="flex flex-col flex-grow px-2.5 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4">
                                    {/* Vendor */}
                                    <span className={`text-[8px] sm:text-[10px] font-semibold uppercase tracking-widest mb-0.5 sm:mb-1 ${darkMode ? "text-neutral-500" : "text-neutral-400"}`}>
                                        {product.vendorTitle}
                                    </span>

                                    {/* Title */}
                                    <h3 className={`font-bold text-xs sm:text-sm leading-snug line-clamp-2 mb-2 sm:mb-2.5 transition-colors duration-200 ${darkMode ? "text-neutral-100 group-hover:text-amber-400" : "text-neutral-900 group-hover:text-neutral-600"}`}>
                                        {product.title}
                                    </h3>

                                    {/* Stars */}
                                    <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i < stars ? "fill-amber-400 text-amber-400" : darkMode ? "text-neutral-700 fill-neutral-700" : "text-neutral-200 fill-neutral-200"}`} />
                                            ))}
                                        </div>
                                        <span className={`text-[8px] sm:text-[10px] font-medium ${darkMode ? "text-neutral-500" : "text-neutral-400"}`}>
                                            {product.averageRating?.toFixed(1)} ({product.totalReviews})
                                        </span>
                                        {product.averageRating >= 4.5 && (
                                            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 ml-auto" />
                                        )}
                                    </div>

                                    {/* Price row */}
                                    <div className={`flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t ${darkMode ? "border-neutral-800" : "border-neutral-100"}`}>
                                        <div>
                                            <span className={`text-sm sm:text-lg font-extrabold tracking-tight ${darkMode ? "text-white" : "text-neutral-900"}`}>
                                                ${product.minDiscountedPrice.toFixed(2)}
                                            </span>
                                            {hasDiscount && (
                                                <span className={`block text-[9px] sm:text-[11px] line-through ${darkMode ? "text-neutral-600" : "text-neutral-400"}`}>
                                                    ${product.minPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {hasDiscount && (
                                            <span className="text-[8px] sm:text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                                                Save ${(product.minPrice - product.minDiscountedPrice).toFixed(0)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
