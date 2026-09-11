"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useThemeStore } from "@ecomerece/frontend";
import type { HomeSlideResponse, HomePromoResponse } from "@ecomerece/shared";

export default function HeroBanner({ slides, promos }: { slides: HomeSlideResponse[]; promos: HomePromoResponse[] }) {
    const { darkMode } = useThemeStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const slide = slides[currentIndex];

    const mainPromos = promos.slice(0, 2);
    const extraPromos = promos.slice(2);

    useEffect(() => {
        if (!slides.length) return;
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion || paused) return;
        const timer = setInterval(() => {
            setCurrentIndex((i) => (i + 1) % slides.length);
        }, 2000);
        return () => clearInterval(timer);
    }, [paused, slides.length]);

    useEffect(() => {
        if (currentIndex >= slides.length && slides.length > 0) {
            setCurrentIndex(0);
        }
    }, [slides.length, currentIndex]);

    const prevSlide = () => setCurrentIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
    const nextSlide = () => setCurrentIndex((i) => (i + 1) % slides.length);

    const getExtraGridClass = (count: number) => {
        switch (count) {
            case 1:
                return "grid-cols-1";
            case 2:
                return "grid-cols-2";
            case 3:
                return "grid-cols-2 sm:grid-cols-3";
            default:
                return "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4";
        }
    };

    const oddCardOut = extraPromos.length > 2 && extraPromos.length % 2 !== 0;

    if (!slides.length && !promos.length) return null;

    return (
        <section
            className={`py-3 sm:py-5 transition-colors duration-500 ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-3.5 sm:gap-4">

                {/* Top Row: Hero Slider + Main 2 Promos */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-4">

                    {/* Hero Slider */}
                    {slides.length > 0 && (
                        <div
                            className="lg:col-span-2 relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl h-[380px] sm:h-[420px] lg:h-[460px]"
                            style={{ "--accent": slide?.accent } as React.CSSProperties}
                            onMouseEnter={() => setPaused(true)}
                            onMouseLeave={() => setPaused(false)}
                        >
                            {slides.map((s, i) => (
                                <div
                                    key={s.id}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${i === currentIndex ? "opacity-100" : "opacity-0"
                                        }`}
                                >
                                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/45 to-transparent" />
                                </div>
                            ))}

                            {/* Content Area */}
                            {slide && (
                                <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-10 lg:px-12 max-w-lg">
                                    <span className="inline-flex w-fit px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--accent)] text-white mb-3 shadow-sm">
                                        {slide.tag}
                                    </span>

                                    <h1
                                        key={slide.title}
                                        className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-white mb-2"
                                    >
                                        {slide.title}
                                        <span className="block text-white/80 mt-0.5 text-lg sm:text-xl lg:text-2xl font-semibold">
                                            {slide.subhead}
                                        </span>
                                    </h1>

                                    <p className="text-xs sm:text-sm leading-relaxed text-white/70 mb-5 max-w-sm line-clamp-2 sm:line-clamp-none">
                                        {slide.subtitle}
                                    </p>

                                    <a
                                        href="#"
                                        className="group inline-flex items-center gap-2 w-fit px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white text-neutral-900 font-semibold text-xs sm:text-sm transition-transform duration-200 hover:scale-102 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                                    >
                                        {slide.cta}
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
                                    </a>
                                </div>
                            )}

                            {/* Controls */}
                            <div className="absolute bottom-4 left-5 right-5 sm:left-10 sm:right-10 z-10 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIndex(i)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-5 bg-[var(--accent)]" : "w-1.5 bg-white/50 hover:bg-white/80"
                                                }`}
                                            aria-label={`Go to slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={prevSlide}
                                        className="w-8 h-8 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center transition-all duration-200 hover:bg-[var(--accent)] hover:text-white"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-8 h-8 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center transition-all duration-200 hover:bg-[var(--accent)] hover:text-white"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Promos Column — First 2 Promos */}
                    {mainPromos.length > 0 && (
                        <div className={`${slides.length > 0 ? "lg:col-span-1" : "lg:col-span-3"} grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4 h-[180px] sm:h-[420px] lg:h-[460px]`}>
                            {mainPromos.map((p) => (
                                <a
                                    key={p.id}
                                    href={p.link || "#"}
                                    style={{ "--accent": p.accent } as React.CSSProperties}
                                    className={`group relative rounded-xl sm:rounded-2xl overflow-hidden h-full flex items-end p-3 sm:p-5 shadow-md hover:shadow-xl transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${darkMode ? "focus-visible:ring-offset-neutral-950" : "focus-visible:ring-offset-white"
                                        }`}
                                >
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent" />

                                    <div className="relative z-10 flex items-end justify-between w-full gap-2 sm:gap-3">
                                        <div>
                                            <h3 className="text-xs sm:text-base lg:text-lg font-bold text-white leading-snug mb-0.5">{p.title}</h3>
                                            <p className="text-[10px] sm:text-xs lg:text-sm text-white/75 line-clamp-1">{p.subtitle}</p>
                                        </div>
                                        <div className="rounded-full bg-white text-neutral-900 flex items-center justify-center shrink-0 shadow duration-300 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:scale-105 w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9">
                                            <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                </div>

                {/* Bottom Row: Additional Promos (3 to 6+ total) */}
                {extraPromos.length > 0 && (
                    <div className={`grid ${getExtraGridClass(extraPromos.length)} gap-2.5 sm:gap-3.5 lg:gap-4`}>
                        {extraPromos.map((p, idx) => {
                            const isLastOdd = oddCardOut && idx === extraPromos.length - 1;
                            return (
                                <a
                                    key={p.id}
                                    href={p.link || "#"}
                                    style={{ "--accent": p.accent } as React.CSSProperties}
                                    className={`group relative rounded-xl sm:rounded-2xl overflow-hidden h-[130px] sm:h-[180px] lg:h-[200px] flex items-end p-3 sm:p-5 shadow-md hover:shadow-xl transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${isLastOdd ? "col-span-2 sm:col-span-1" : ""} ${darkMode ? "focus-visible:ring-offset-neutral-950" : "focus-visible:ring-offset-white"
                                        }`}
                                >
                                    <img
                                        src={p.image}
                                        alt={p.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent" />

                                    <div className="relative z-10 flex items-end justify-between w-full gap-2 sm:gap-3">
                                        <div>
                                            <h3 className="text-xs sm:text-base lg:text-lg font-bold text-white leading-snug mb-0.5">{p.title}</h3>
                                            <p className="text-[10px] sm:text-xs lg:text-sm text-white/75 line-clamp-1">{p.subtitle}</p>
                                        </div>
                                        <div className="rounded-full bg-white text-neutral-900 flex items-center justify-center shrink-0 shadow duration-300 group-hover:bg-[var(--accent)] group-hover:text-white group-hover:scale-105 w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9">
                                            <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}

            </div>
        </section>
    );
}
