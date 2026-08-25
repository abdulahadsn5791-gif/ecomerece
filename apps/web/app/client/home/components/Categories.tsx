// components/Categories.tsx
"use client";

import {
    Shirt,
    Watch,
    Gem,
    Footprints,
    Handbag,
    Glasses,
    Sparkles,
    ArrowUpRight,
} from "lucide-react";

const categories = [
    {
        name: "Apparel",
        icon: Shirt,
        count: "1,200+ items",
        image:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&q=80",
        iconColor: "text-amber-600",
    },
    {
        name: "Watches",
        icon: Watch,
        count: "340+ items",
        image:
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=500&q=80",
        iconColor: "text-sky-600",
    },
    {
        name: "Jewelry",
        icon: Gem,
        count: "520+ items",
        image:
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&q=80",
        iconColor: "text-rose-600",
    },
    {
        name: "Footwear",
        icon: Footprints,
        count: "780+ items",
        image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&q=80",
        iconColor: "text-emerald-600",
    },
    {
        name: "Handbags",
        icon: Handbag,
        count: "460+ items",
        image:
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&q=80",
        iconColor: "text-violet-600",
    },
    {
        name: "Eyewear",
        icon: Glasses,
        count: "290+ items",
        image:
            "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=500&q=80",
        iconColor: "text-stone-600",
    },
];

export default function Categories() {
    return (
        <section id="categories" className="py-20 sm:py-24 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-10 sm:mb-14 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={16} className="text-amber-500" />
                            <span className="text-xs font-semibold text-amber-600 tracking-widest uppercase">
                                Curated Selection
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900">
                            Shop by Category
                        </h2>
                    </div>
                    <a
                        href="#"
                        className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors group"
                    >
                        View All
                        <ArrowUpRight
                            size={16}
                            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                    </a>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                    {categories.map((category, index) => (
                        <a
                            key={category.name}
                            href="#"
                            className="group relative bg-white rounded-2xl card-shadow hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2 animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent" />

                                {/* Icon Badge */}
                                <div className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                                    <category.icon size={16} className={category.iconColor} />
                                </div>

                                {/* Name & Count */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-semibold text-sm sm:text-base leading-tight">
                                        {category.name}
                                    </h3>
                                    <p className="text-stone-300 text-[11px] sm:text-xs mt-0.5">
                                        {category.count}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-md">
                                <ArrowUpRight size={14} className="text-stone-700" />
                            </div>
                        </a>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="mt-6 sm:hidden text-center">
                    <a
                        href="#"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900"
                    >
                        View All Categories
                        <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
}