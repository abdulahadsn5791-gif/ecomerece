"use client";

import { useThemeStore } from "@ecomerece/frontend/theme";
import { useGetPaginatedProducts } from "@ecomerece/frontend/product";
import type { HomeContainerResponse } from "@ecomerece/shared";
import { ShoppingCart, ArrowRight, Sparkles, Star, Eye, Loader2 } from "lucide-react";
import { useRef } from "react";

export default function Products({ container }: { container: HomeContainerResponse }) {
    const { darkMode } = useThemeStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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
            const scrollAmount = direction === 'left' ? -320 : 320;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const getBadge = (product: typeof products[number]) => {
        if (product.maxPrice > product.maxDiscountedPrice) {
            const pct = Math.round(((product.maxPrice - product.maxDiscountedPrice) / product.maxPrice) * 100);
            return `Save ${pct}%`;
        }
        if (product.averageRating >= 4.5) return 'Best Seller';
        if (!product.inStock) return 'Out of Stock';
        return null;
    };

    const getDefaultImage = (product: typeof products[number]) => {
        const def = product.image?.images?.find((i) => i.default);
        return def?.url || product.image?.images?.[0]?.url || '';
    };

    if (isLoading) {
        return (
            <section className={`py-20 sm:py-28 transition-colors duration-500 ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center h-40">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className={`py-20 sm:py-28 transition-colors duration-500 overflow-hidden ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex justify-between items-end mb-10 sm:mb-14 flex-wrap gap-4">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4 border shadow-sm ${darkMode ? "border-neutral-800 bg-neutral-900 text-neutral-300" : "border-neutral-200 bg-neutral-50 text-neutral-700"
                            }`}>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Handpicked Selection</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                            {container.heading}
                        </h2>
                        {container.subTitle && (
                            <p className={`mt-2 text-sm sm:text-base ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                                {container.subTitle}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${darkMode ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800" : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100"
                                    }`}
                                aria-label="Scroll left"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${darkMode ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800" : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100"
                                    }`}
                                aria-label="Scroll right"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <a href="#" className={`group inline-flex items-center gap-2 font-semibold text-xs sm:text-sm transition-colors ${darkMode ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"
                            }`}>
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>

                {/* Mobile Swipeable Carousel / Desktop Grid */}
                <div
                    ref={scrollContainerRef}
                    className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-4 sm:pb-0 scrollbar-none [-webkit-overflow-scrolling:touch]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => {
                        const badge = getBadge(product);
                        return (
                            <div
                                key={product.id}
                                className={`group rounded-xl sm:rounded-2xl overflow-hidden border flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-md hover:shadow-2xl shrink-0 w-[78%] sm:w-auto snap-start ${darkMode
                                    ? "bg-neutral-900/80 border-neutral-800 hover:border-neutral-700"
                                    : "bg-neutral-50/80 border-neutral-200 hover:border-neutral-300"
                                    }`}
                            >
                                {/* Product Image & Badges Container */}
                                <div className={`aspect-square m-2.5 sm:m-3 rounded-lg overflow-hidden relative shadow-inner ${darkMode ? "bg-neutral-950" : "bg-neutral-200"
                                    }`}>
                                    <img
                                        src={getDefaultImage(product)}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        loading="lazy"
                                    />

                                    {badge && (
                                        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                                            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-md text-white border border-white/20 shadow-sm">
                                                {badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
                                        <button className="w-10 h-10 rounded-lg bg-white/90 backdrop-blur-md text-neutral-900 flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="px-4 pb-4 pt-1.5 sm:px-5 sm:pb-5 sm:pt-2 flex flex-col flex-grow">
                                    <span className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? "text-neutral-400" : "text-neutral-500"
                                        }`}>
                                        {product.vendorTitle}
                                    </span>

                                    <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-3 leading-snug line-clamp-2 tracking-tight group-hover:text-amber-400 transition-colors duration-300">
                                        {product.title}
                                    </h3>

                                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs mb-3 sm:mb-4">
                                        <div className="flex items-center text-amber-400">
                                            {[...Array(Math.round(product.averageRating))].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                                            ))}
                                        </div>
                                        <span className={darkMode ? "text-neutral-400" : "text-neutral-500"}>
                                            ({product.totalReviews})
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-2.5 sm:pt-3 border-t border-neutral-500/20">
                                        <div className="flex flex-col">
                                            <span className={`text-base sm:text-lg font-extrabold tracking-tight ${darkMode ? "text-white" : "text-neutral-900"
                                                }`}>
                                                ${product.minDiscountedPrice.toFixed(2)}
                                            </span>
                                            {product.minPrice > product.minDiscountedPrice && (
                                                <span className={`text-[11px] sm:text-xs line-through ${darkMode ? "text-neutral-500" : "text-neutral-400"
                                                    }`}>
                                                    ${product.minPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <button className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-semibold transition-all duration-300 shadow-md active:scale-95 sm:hover:scale-110 ${darkMode
                                            ? "bg-white text-black hover:bg-neutral-200"
                                            : "bg-neutral-900 text-white hover:bg-neutral-800"
                                            }`} aria-label="Add to cart">
                                            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
