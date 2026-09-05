// components/HeroBanner.tsx
"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useThemeStore } from "@ecomerece/frontend";

type Slide = {
    tag: string;
    title: string;
    subhead: string;
    subtitle: string;
    image: string;
    /** Vivid variant — used for chip/dot backgrounds and dark-mode text */
    accent: string;
    /** Deepened variant — used for text/borders in light mode so contrast holds on white */
    accentText: string;
};

const slides: Slide[] = [
    {
        tag: "New arrivals",
        title: "Discover premium products",
        subhead: "with everyday simplicity",
        subtitle:
            "Shop the latest in fashion, electronics and home essentials — curated quality, free shipping over $50.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
        accent: "#D4A24C",
        accentText: "#A6752A",
    },
    {
        tag: "Featured electronics",
        title: "Next-gen audio and tech",
        subhead: "built for immersive sound",
        subtitle:
            "Upgrade your setup with studio-grade headphones, smart devices and the latest gear.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
        accent: "#4A7FB5",
        accentText: "#2F5F8C",
    },
    {
        tag: "Mid-season apparel",
        title: "Curated fashion styles",
        subhead: "that define your everyday look",
        subtitle:
            "Contemporary apparel in premium fabrics, made for comfort that lasts.",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
        accent: "#D8607C",
        accentText: "#B84364",
    },
];

export default function HeroBanner() {
    const { darkMode } = useThemeStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const slide = slides[currentIndex];

    // Auto-advance, but respect reduced-motion and pause while the visitor is looking at it
    useEffect(() => {
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion || paused) return;
        const timer = setInterval(() => {
            setCurrentIndex((i) => (i + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [paused]);

    const prevSlide = () => setCurrentIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
    const nextSlide = () => setCurrentIndex((i) => (i + 1) % slides.length);

    return (
        <section
            className={`py-14 sm:py-20 lg:py-28 transition-colors duration-500 ${darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"
                }`}
        >
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6"
                style={
                    {
                        "--accent": slide.accent,
                        "--accent-text": darkMode ? slide.accent : slide.accentText,
                    } as React.CSSProperties
                }
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    {/* Image card */}
                    <div className="order-1 lg:order-2 lg:col-span-6">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[16/10] lg:aspect-[4/5]">
                            {slides.map((s, i) => (
                                <div
                                    key={s.title}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${i === currentIndex ? "opacity-100" : "opacity-0"
                                        }`}
                                >
                                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent" />
                                </div>
                            ))}

                            {/* Tag chip, labels the photo directly rather than floating above the headline */}
                            <span className="absolute top-5 left-5 z-10 px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent)] text-white shadow-md">
                                {slide.tag}
                            </span>

                            {/* A numbered counter is fair game here — these tiles really are a sequence */}
                            <span className="absolute top-5 right-5 z-10 text-xs font-medium text-white/80 tabular-nums">
                                {String(currentIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                            </span>

                            {/* Carousel controls live on the image itself */}
                            <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIndex(i)}
                                            className={`h-1.5 rounded-full transition-all duration-500 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${i === currentIndex ? "w-6 bg-[var(--accent)]" : "w-1.5 bg-white/50 hover:bg-white/80"
                                                }`}
                                            aria-label={`Go to slide ${i + 1}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={prevSlide}
                                        className="w-9 h-9 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center transition-all duration-300 hover:bg-[var(--accent)] hover:text-white hover:scale-110 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-9 h-9 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center transition-all duration-300 hover:bg-[var(--accent)] hover:text-white hover:scale-110 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text content */}
                    <div className="order-2 lg:order-1 lg:col-span-6">
                        <div
                            key={slide.title}
                            className="animate-in fade-in slide-in-from-bottom-2 duration-700 motion-reduce:animate-none"
                        >
                            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-5">
                                {slide.title}
                                <span className="block text-[var(--accent-text)] mt-1">{slide.subhead}</span>
                            </h1>

                            <p
                                className={`text-base sm:text-lg leading-relaxed mb-8 max-w-lg ${darkMode ? "text-neutral-400" : "text-neutral-600"
                                    }`}
                            >
                                {slide.subtitle}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                <a
                                    href="#"
                                    className={`group inline-flex items-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[var(--accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-text)] focus-visible:ring-offset-2 ${darkMode
                                            ? "bg-white text-black focus-visible:ring-offset-neutral-950"
                                            : "bg-neutral-900 text-white focus-visible:ring-offset-white"
                                        }`}
                                >
                                    <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                                    Shop the collection
                                </a>
                                <a
                                    href="#"
                                    className={`group inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full font-semibold border transition-all duration-300 hover:border-[var(--accent-text)] hover:text-[var(--accent-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-text)] focus-visible:ring-offset-2 ${darkMode
                                            ? "border-neutral-700 text-white focus-visible:ring-offset-neutral-950"
                                            : "border-neutral-300 text-neutral-900 focus-visible:ring-offset-white"
                                        }`}
                                >
                                    View deals
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
                            </div>
                        </div>

                        {/* Trust strip stays put across slide changes, no reason to re-animate it */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-neutral-500">
                            <span className="pr-0 sm:pr-5 border-r-0 sm:border-r border-neutral-500/25">
                                10K+ products
                            </span>
                            <span className="pr-0 sm:pr-5 border-r-0 sm:border-r border-neutral-500/25">
                                50K+ happy customers
                            </span>
                            <span>4.8★ average rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}