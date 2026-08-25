// components/FeaturedProducts.tsx
"use client";

import {
    Heart,
    Star,
    ShoppingBag,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import { useState } from "react";

const products = [
    {
        id: 1,
        name: "Merino Wool Oversized Coat",
        category: "Outerwear",
        price: 289,
        originalPrice: 380,
        rating: 4.8,
        reviews: 124,
        image:
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=750&q=80",
        badge: "New",
        badgeColor: "bg-emerald-600",
    },
    {
        id: 2,
        name: "Classic Leather Tote Bag",
        category: "Accessories",
        price: 195,
        originalPrice: null,
        rating: 4.9,
        reviews: 86,
        image:
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&q=80",
        badge: "Best Seller",
        badgeColor: "bg-amber-600",
    },
    {
        id: 3,
        name: "Minimalist Chronograph Watch",
        category: "Watches",
        price: 245,
        originalPrice: 310,
        rating: 4.7,
        reviews: 203,
        image:
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=750&q=80",
        badge: null,
        badgeColor: "",
    },
    {
        id: 4,
        name: "Silk Blend Evening Scarf",
        category: "Accessories",
        price: 78,
        originalPrice: null,
        rating: 4.6,
        reviews: 58,
        image:
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=750&q=80",
        badge: "Limited",
        badgeColor: "bg-rose-600",
    },
    {
        id: 5,
        name: "Handcrafted Gold Earrings",
        category: "Jewelry",
        price: 145,
        originalPrice: 180,
        rating: 4.9,
        reviews: 97,
        image:
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=750&q=80",
        badge: null,
        badgeColor: "",
    },
    {
        id: 6,
        name: "Premium Leather Sneakers",
        category: "Footwear",
        price: 165,
        originalPrice: null,
        rating: 4.8,
        reviews: 142,
        image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=750&q=80",
        badge: "Trending",
        badgeColor: "bg-sky-600",
    },
    {
        id: 7,
        name: "Cashmere Blend Cardigan",
        category: "Knitwear",
        price: 210,
        originalPrice: 260,
        rating: 4.7,
        reviews: 76,
        image:
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&q=80",
        badge: null,
        badgeColor: "",
    },
    {
        id: 8,
        name: "Statement Sunglasses",
        category: "Eyewear",
        price: 120,
        originalPrice: null,
        rating: 4.5,
        reviews: 64,
        image:
            "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=750&q=80",
        badge: "New",
        badgeColor: "bg-emerald-600",
    },
];

function ProductCard({ product, index }: { product: (typeof products)[0]; index: number }) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const discount = product.originalPrice
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
        : null;

    return (
        <div
            className="group bg-white rounded-2xl card-shadow hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.badge && (
                        <span
                            className={`${product.badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md tracking-wide uppercase`}
                        >
                            {product.badge}
                        </span>
                    )}
                    {discount && (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${isWishlisted
                        ? "bg-rose-600 text-white"
                        : "bg-white/90 backdrop-blur-sm text-stone-500 hover:text-rose-600"
                        }`}
                    aria-label="Add to wishlist"
                >
                    <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-0 left-0 right-0 p-3 transition-all duration-400 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <button className="w-full bg-stone-900/90 backdrop-blur-md text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-900 transition-all duration-300">
                        <ShoppingBag size={15} /> Add to Cart
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col">
                <span className="text-[11px] font-medium text-stone-400 tracking-wider uppercase mb-1">
                    {product.category}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-stone-900 leading-snug mb-2 line-clamp-2">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={
                                    i < Math.floor(product.rating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-stone-200"
                                }
                            />
                        ))}
                    </div>
                    <span className="text-xs text-stone-400">
                        {product.rating} ({product.reviews})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-lg font-bold text-stone-900">
                        ${product.price}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-stone-400 line-through">
                            ${product.originalPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function FeaturedProducts() {
    return (
        <section id="featured" className="py-20 sm:py-24 lg:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 tracking-widest uppercase">
                            Handpicked For You
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900">
                        Featured Collection
                    </h2>
                    <p className="mt-4 text-stone-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Discover our most loved pieces — thoughtfully designed and crafted
                        with premium materials for the modern lifestyle.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                {/* View All CTA */}
                <div className="text-center mt-10 sm:mt-14 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-white font-semibold rounded-full shadow-lg shadow-stone-900/20 hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/25 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                    >
                        View All Products
                        <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
}