// components/Categories.tsx
"use client";

import { useThemeStore } from "@ecomerece/frontend";
import {
    ArrowRight,
    Laptop,
    Monitor,
    Keyboard,
    Mouse,
    Headphones,
    Camera,
    Gamepad2,
    Armchair,
    Router,
    MemoryStick,
    HardDrive,
    Plug,
    type LucideIcon,
} from "lucide-react";

type Category = {
    name: string;
    icon: LucideIcon;
    image: string;
    /** Signature hue for this department — drives the icon badge and hover ring */
    accent: string;
};

const categories: Category[] = [
    {
        name: "Laptops",
        icon: Laptop,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
        accent: "#4A7FB5",
    },
    {
        name: "Monitors",
        icon: Monitor,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80",
        accent: "#7FA88C",
    },
    {
        name: "Keyboards",
        icon: Keyboard,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
        accent: "#D4A24C",
    },
    {
        name: "Mouse",
        icon: Mouse,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80",
        accent: "#D8607C",
    },
    {
        name: "Headsets & Mics",
        icon: Headphones,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        accent: "#9C6FB0",
    },
    {
        name: "Webcams & Cameras",
        icon: Camera,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
        accent: "#3E9C9C",
    },
    {
        name: "Gaming Consoles",
        icon: Gamepad2,
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80",
        accent: "#9C6FB0",
    },
    {
        name: "Gaming Furniture",
        icon: Armchair,
        image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80",
        accent: "#D8607C",
    },
    {
        name: "Networking",
        icon: Router,
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80",
        accent: "#4A7FB5",
    },
    {
        name: "Memory / RAM",
        icon: MemoryStick,
        image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=400&q=80",
        accent: "#D4A24C",
    },
    {
        name: "Storage",
        icon: HardDrive,
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80",
        accent: "#7FA88C",
    },
    {
        name: "Power Supply",
        icon: Plug,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
        accent: "#3E9C9C",
    },
];

export default function Categories() {
    const { darkMode } = useThemeStore();

    return (
        <section
            className={`py-15 sm:py-10 transition-colors duration-500 ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                            Shop by category
                        </h2>
                        <p className={`text-sm sm:text-base ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>
                            Find exactly what your setup needs.
                        </p>
                    </div>
                    <a
                        href="#"
                        className={`group hidden sm:inline-flex items-center gap-2 font-semibold text-sm shrink-0 transition-colors ${darkMode
                            ? "text-neutral-400 hover:text-white"
                            : "text-neutral-600 hover:text-black"
                            }`}
                    >
                        View all
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </a>
                </div>

                {/* Horizontal scroll strip of circular category tiles, snap-scrolled on touch devices */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {categories.map((cat) => {
                        const IconComponent = cat.icon;
                        return (
                            <a
                                key={cat.name}
                                href="#"
                                style={{ "--accent": cat.accent } as React.CSSProperties}
                                className="group flex flex-col items-center gap-3 shrink-0 w-24 sm:w-28 snap-start focus-visible:outline-none"
                            >
                                <div
                                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:border-[var(--accent)] group-hover:scale-105 group-focus-visible:border-[var(--accent)] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${darkMode ? "border-neutral-800" : "border-neutral-200"
                                        }`}
                                >
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/10 transition-colors duration-300" />
                                    <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md ring-2 ring-white">
                                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                                    {cat.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}