// components/Categories.tsx
"use client";

import { useThemeStore } from "@ecomerece/frontend";
import {
    ArrowRight,
    Laptop,
    Shirt,
    Home,
    Smile,
    Dumbbell,
    BookOpen,
    Gamepad2,
    Puzzle,
    Gem,
    type LucideIcon,
} from "lucide-react";

type Category = {
    name: string;
    count: number;
    icon: LucideIcon;
    image: string;
    badge: string;
    blurb: string;
    /** Signature hue for this department — drives icon chip, badge and hover tint */
    accent: string;
    /** Extra grid spans applied at the lg breakpoint only (mobile/tablet stay uniform) */
    span: string;
    /** Larger tiles get richer imagery and bigger type, but only once the bento spans kick in at lg */
    prominent?: boolean;
};

const categories: Category[] = [
    {
        name: "Fashion",
        count: 2340,
        icon: Shirt,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
        badge: "Trending now",
        blurb: "Coats, denim, sneakers and everyday staples",
        accent: "#D8607C",
        span: "lg:col-span-2 lg:row-span-2",
        prominent: true,
    },
    {
        name: "Electronics",
        count: 1890,
        icon: Laptop,
        image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
        badge: "Most popular",
        blurb: "Laptops, audio and smart home gear",
        accent: "#4A7FB5",
        span: "",
    },
    {
        name: "Home & Living",
        count: 3120,
        icon: Home,
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&q=80",
        badge: "Best seller",
        blurb: "Furniture, decor and kitchen essentials",
        accent: "#7FA88C",
        span: "lg:row-span-2",
        prominent: true,
    },
    {
        name: "Beauty",
        count: 1450,
        icon: Smile,
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
        badge: "Just added",
        blurb: "Skincare, makeup and fragrance",
        accent: "#9C6FB0",
        span: "",
    },
    {
        name: "Gaming",
        count: 1210,
        icon: Gamepad2,
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1000&q=80",
        badge: "Level up",
        blurb: "Consoles, accessories and collectibles",
        accent: "#9C6FB0",
        span: "lg:col-span-2",
        prominent: true,
    },
    {
        name: "Sports",
        count: 980,
        icon: Dumbbell,
        image: "https://images.unsplash.com/photo-1517649763962-0c6232660102?w=800&q=80",
        badge: "Staff picks",
        blurb: "Activewear and outdoor kit",
        accent: "#3E9C9C",
        span: "",
    },
    {
        name: "Books",
        count: 2670,
        icon: BookOpen,
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&q=80",
        badge: "Reader favorites",
        blurb: "Fiction, non-fiction and rare finds",
        accent: "#4A7FB5",
        span: "",
    },
    {
        name: "Toys",
        count: 890,
        icon: Puzzle,
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
        badge: "Kid approved",
        blurb: "Puzzles, building sets and plushies",
        accent: "#D4A24C",
        span: "",
    },
    {
        name: "Jewelry",
        count: 740,
        icon: Gem,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
        badge: "Limited stock",
        blurb: "Rings, necklaces and fine pieces",
        accent: "#D4A24C",
        span: "",
    },
];

export default function Categories() {
    const { darkMode } = useThemeStore();
    const totalItems = categories.reduce((sum, c) => sum + c.count, 0);

    return (
        <section
            className={`py-14 sm:py-20 lg:py-28 transition-colors duration-500 ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-3 lg:mb-4">
                            Shop by category
                        </h2>
                        <p
                            className={`text-sm sm:text-base leading-relaxed ${darkMode ? "text-neutral-400" : "text-neutral-600"
                                }`}
                        >
                            {totalItems.toLocaleString()} products across {categories.length}{" "}
                            departments, organized by what you&apos;re actually looking for.
                        </p>
                    </div>
                    <a
                        href="#"
                        className={`group inline-flex items-center gap-2 font-semibold text-sm shrink-0 transition-colors ${darkMode
                                ? "text-neutral-400 hover:text-white"
                                : "text-neutral-600 hover:text-black"
                            }`}
                    >
                        Explore all categories
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </a>
                </div>

                {/* Grid: compact 2-up on phones, dense bento with varied spans from lg up */}
                <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-flow-dense lg:auto-rows-[220px] gap-3 sm:gap-4 lg:gap-6">
                    {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                            <a
                                key={cat.name}
                                href="#"
                                style={{ "--accent": cat.accent } as React.CSSProperties}
                                className={`group relative h-40 sm:h-56 lg:h-auto rounded-2xl sm:rounded-3xl lg:rounded-[2rem] overflow-hidden border p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-md sm:shadow-lg hover:shadow-2xl transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 ${cat.span
                                    } ${darkMode
                                        ? "border-neutral-800/80 bg-neutral-900 focus-visible:ring-offset-neutral-950"
                                        : "border-neutral-200/80 bg-neutral-50 focus-visible:ring-offset-white"
                                    }`}
                            >
                                {/* Background image */}
                                <div className="absolute inset-0 z-0 overflow-hidden">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${cat.prominent
                                                ? "opacity-70 group-hover:opacity-90"
                                                : "opacity-35 group-hover:opacity-60"
                                            }`}
                                        loading="lazy"
                                    />
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t ${darkMode
                                                ? "from-neutral-950 via-neutral-950/50 to-transparent"
                                                : "from-neutral-950/90 via-neutral-950/40 to-transparent"
                                            }`}
                                    />
                                    {/* Accent wash on hover ties the department color into the image */}
                                    <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-20 transition-opacity duration-500 mix-blend-overlay" />
                                </div>

                                {/* Top row: icon chip + badge */}
                                <div className="relative z-10 flex items-center justify-between gap-2">
                                    <div
                                        className={`rounded-lg sm:rounded-xl lg:rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none w-8 h-8 sm:w-10 sm:h-10 ${cat.prominent ? "lg:w-14 lg:h-14" : "lg:w-11 lg:h-11"
                                            }`}
                                    >
                                        <IconComponent
                                            className={`w-4 h-4 sm:w-5 sm:h-5 ${cat.prominent ? "lg:w-6 lg:h-6" : ""}`}
                                        />
                                    </div>
                                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-white/10 text-white border border-white/20 backdrop-blur-md text-right leading-tight">
                                        {cat.badge}
                                    </span>
                                </div>

                                {/* Bottom row: name, count, blurb, CTA */}
                                <div className="relative z-10 flex items-end justify-between gap-2 sm:gap-4">
                                    <div className="min-w-0">
                                        <p className="text-[10px] sm:text-xs font-medium text-neutral-300 mb-0.5 sm:mb-1">
                                            {cat.count.toLocaleString()} items
                                        </p>
                                        <h3
                                            className={`font-bold text-white tracking-tight transition-colors duration-300 group-hover:text-[var(--accent)] text-sm sm:text-lg ${cat.prominent ? "lg:text-4xl lg:mb-2" : "lg:text-xl"
                                                }`}
                                        >
                                            {cat.name}
                                        </h3>
                                        {cat.prominent && (
                                            <p className="text-sm text-neutral-300 max-w-xs hidden lg:block">
                                                {cat.blurb}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        className={`rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg sm:shadow-xl shrink-0 transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:scale-110 motion-reduce:transition-none w-7 h-7 sm:w-9 sm:h-9 ${cat.prominent ? "lg:w-14 lg:h-14" : "lg:w-10 lg:h-10"
                                            }`}
                                    >
                                        <ArrowRight
                                            className={`w-3 h-3 sm:w-4 sm:h-4 ${cat.prominent ? "lg:w-5 lg:h-5" : ""}`}
                                        />
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}