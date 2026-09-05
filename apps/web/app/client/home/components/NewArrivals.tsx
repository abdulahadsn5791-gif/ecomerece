// components/NewArrivals.tsx
"use client";

import { useThemeStore } from '@ecomerece/frontend';
import { ArrowRight, ShoppingCart, Sparkles, Star, Eye } from 'lucide-react';
import React, { useRef } from 'react';

const newArrivals = [
    {
        id: 6,
        vendor: 'BrightHome',
        name: 'Smart LED Desk Lamp with Wireless Charging',
        rating: 4,
        reviews: '654',
        price: '$49.99',
        originalPrice: '$79.99',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
        badge: 'Just Dropped',
    },
    {
        id: 7,
        vendor: 'AdventureX',
        name: '4K Action Camera - Waterproof Edition',
        rating: 5,
        reviews: '1,567',
        price: '$199.00',
        originalPrice: '$249.00',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
        badge: 'New Gen',
    },
    {
        id: 8,
        vendor: 'BaristaPro',
        name: 'Espresso Machine - Barista Quality',
        rating: 4,
        reviews: '432',
        price: '$429.00',
        originalPrice: '$499.00',
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
        badge: 'Pro Grade',
    },
    {
        id: 9,
        vendor: 'GameOn',
        name: 'Pro Gaming Controller - Custom Edition',
        rating: 5,
        reviews: '3,210',
        price: '$69.99',
        originalPrice: '$89.99',
        image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&q=80',
        badge: 'Limited',
    },
    {
        id: 10,
        vendor: 'SoundWave',
        name: 'Spatial Audio Wireless Earbuds',
        rating: 5,
        reviews: '1,120',
        price: '$129.99',
        originalPrice: '$159.99',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
        badge: 'Trending',
    },
    {
        id: 11,
        vendor: 'Chronos',
        name: 'Minimalist Titanium Quartz Watch',
        rating: 4,
        reviews: '890',
        price: '$219.00',
        originalPrice: '$279.00',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
        badge: 'Exclusive',
    },
    {
        id: 12,
        vendor: 'UrbanFit',
        name: 'Ergonomic Daily Backpack - Charcoal',
        rating: 5,
        reviews: '2,040',
        price: '$89.99',
        originalPrice: '$119.99',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        badge: 'Best Seller',
    },
    {
        id: 13,
        vendor: 'AeroGlide',
        name: 'Ultralight Carbon Fiber Travel Mug',
        rating: 4,
        reviews: '540',
        price: '$39.99',
        originalPrice: '$55.99',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
        badge: 'Fresh',
    },
];

export default function NewArrivals() {
    const { darkMode } = useThemeStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -320 : 320;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

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
                            <span>Just Dropped</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                            New Arrivals
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile Scroll Control Buttons */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${darkMode ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800" : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100"
                                    }`}
                                aria-label="Scroll left"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${darkMode ? "border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800" : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100"
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
                    className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-4 sm:pb-0 scrollbar-none [-webkit-overflow-scrolling:touch]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {newArrivals.map((product) => (
                        <div
                            key={product.id}
                            className={`group rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 shadow-md hover:shadow-xl shrink-0 w-[78%] sm:w-auto snap-start ${darkMode
                                    ? "bg-neutral-900/80 border-neutral-800 hover:border-neutral-700"
                                    : "bg-neutral-50/80 border-neutral-200 hover:border-neutral-300"
                                }`}
                        >
                            {/* Product Image & Badges Container */}
                            <div className={`aspect-square m-2.5 sm:m-3 rounded-2xl overflow-hidden relative shadow-inner ${darkMode ? "bg-neutral-950" : "bg-neutral-200"
                                }`}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    loading="lazy"
                                />

                                {/* Glassmorphic Badge */}
                                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-black/40 backdrop-blur-md text-white border border-white/20 shadow-sm">
                                        {product.badge}
                                    </span>
                                </div>

                                {/* Quick View Hover Action Button (Hidden on touch devices for cleaner tap UX) */}
                                <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
                                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="px-4 pb-4 pt-1.5 sm:px-5 sm:pb-5 sm:pt-2 flex flex-col flex-grow">
                                <span className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-1 ${darkMode ? "text-neutral-400" : "text-neutral-500"
                                    }`}>
                                    {product.vendor}
                                </span>

                                <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-3 leading-snug line-clamp-2 tracking-tight group-hover:text-amber-400 transition-colors duration-300">
                                    {product.name}
                                </h3>

                                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs mb-3 sm:mb-4">
                                    <div className="flex items-center text-amber-400">
                                        {[...Array(product.rating)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                                        ))}
                                    </div>
                                    <span className={darkMode ? "text-neutral-400" : "text-neutral-500"}>
                                        ({product.reviews})
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-2.5 sm:pt-3 border-t border-neutral-500/20">
                                    <div className="flex flex-col">
                                        <span className={`text-base sm:text-lg font-extrabold tracking-tight ${darkMode ? "text-white" : "text-neutral-900"
                                            }`}>
                                            {product.price}
                                        </span>
                                        <span className={`text-[11px] sm:text-xs line-through ${darkMode ? "text-neutral-500" : "text-neutral-400"
                                            }`}>
                                            {product.originalPrice}
                                        </span>
                                    </div>

                                    <button className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full font-semibold transition-all duration-300 shadow-md active:scale-95 sm:hover:scale-110 ${darkMode
                                            ? "bg-white text-black hover:bg-neutral-200"
                                            : "bg-neutral-900 text-white hover:bg-neutral-800"
                                        }`} aria-label="Add to cart">
                                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}