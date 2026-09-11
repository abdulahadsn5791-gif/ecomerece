"use client";

import { useThemeStore } from "@ecomerece/frontend";
import type { HomeCategoryResponse } from "@ecomerece/shared";
import { ArrowRight } from "lucide-react";
import { DynamicIcon } from "@/lib/icons";

export default function Categories({ categories }: { categories: HomeCategoryResponse[] }) {
    const { darkMode } = useThemeStore();

    if (!categories.length) return null;

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

                {/* Horizontal scroll strip of circular category tiles */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {categories.map((cat) => {
                        return (
                            <a
                                key={cat.id}
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
                                        <DynamicIcon name={cat.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
