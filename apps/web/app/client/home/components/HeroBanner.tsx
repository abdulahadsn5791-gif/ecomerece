// components/HeroBanner.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

const slides = [
    {
        id: 1,
        image:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
        tag: "New Season Collection",
        title: "Elevate Your Everyday Style",
        subtitle:
            "Discover handpicked pieces designed to blend comfort with timeless elegance.",
        cta: "Shop Now",
    },
    {
        id: 2,
        image:
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80",
        tag: "Limited Time Offer",
        title: "Up to 40% Off Premium Essentials",
        subtitle:
            "Refresh your wardrobe with luxury staples at unbeatable prices. Limited stock available.",
        cta: "Shop Sale",
    },
    {
        id: 3,
        image:
            "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=1920&q=80",
        tag: "Accessories Edit",
        title: "Complete Your Look",
        subtitle:
            "From statement bags to delicate jewelry — find the perfect finishing touches.",
        cta: "Explore Accessories",
    },
    {
        id: 4,
        image:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80",
        tag: "Sustainable Fashion",
        title: "Style That Cares",
        subtitle:
            "Our eco-conscious collection is crafted with responsibly sourced materials.",
        cta: "Shop Sustainable",
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const goTo = useCallback((index: number, dir: number = 1) => {
        setDirection(dir);
        setCurrent((prev) => {
            if (index < 0) return slides.length - 1;
            if (index >= slides.length) return 0;
            return index;
        });
    }, []);

    const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

    useEffect(() => {
        if (!isAutoPlaying) return;
        autoPlayRef.current = setInterval(() => {
            setDirection(1);
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isAutoPlaying]);

    const handleManualNav = (fn: () => void) => {
        setIsAutoPlaying(false);
        fn();
        setTimeout(() => setIsAutoPlaying(true), 6000);
    };

    return (
        <section
            className="relative h-[85vh] min-h-[520px] max-h-[800px] w-full overflow-hidden group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Current Slide */}
            <div
                key={current}
                className={`absolute inset-0 ${direction === 1 ? "animate-slide-in-right" : "animate-slide-in-left"
                    }`}
            >
                <img
                    src={slides[current].image}
                    alt={slides[current].title}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-xl">
                            <div
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 mb-5 animate-fade-in-up"
                                style={{ animationDelay: "0.3s" }}
                            >
                                <Sparkles size={13} className="text-amber-400" />
                                <span className="text-xs font-semibold text-white tracking-widest uppercase">
                                    {slides[current].tag}
                                </span>
                            </div>

                            <h1
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4 animate-fade-in-up"
                                style={{ animationDelay: "0.45s" }}
                            >
                                {slides[current].title}
                            </h1>

                            <p
                                className="text-base sm:text-lg md:text-xl text-stone-200 leading-relaxed mb-7 max-w-md animate-fade-in-up"
                                style={{ animationDelay: "0.6s" }}
                            >
                                {slides[current].subtitle}
                            </p>

                            <div
                                className="flex flex-wrap gap-4 animate-fade-in-up"
                                style={{ animationDelay: "0.75s" }}
                            >
                                <a
                                    href="#featured"
                                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-stone-900 font-semibold rounded-full shadow-xl shadow-stone-900/20 hover:bg-stone-100 hover:shadow-2xl hover:shadow-stone-900/25 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                                >
                                    {slides[current].cta}
                                    <ArrowRight size={16} />
                                </a>
                                <a
                                    href="#categories"
                                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                                >
                                    Browse Categories
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Arrow Controls */}
            <button
                onClick={() => handleManualNav(prev)}
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-stone-900 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Previous slide"
            >
                <ArrowLeft size={18} />
            </button>
            <button
                onClick={() => handleManualNav(next)}
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-stone-900 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Next slide"
            >
                <ArrowRight size={18} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => {
                            setIsAutoPlaying(false);
                            goTo(index, index > current ? 1 : -1);
                            setTimeout(() => setIsAutoPlaying(true), 6000);
                        }}
                        className={`transition-all duration-500 rounded-full ${index === current
                                ? "w-9 h-2.5 bg-white"
                                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Slide Counter */}
            <div className="absolute bottom-7 right-4 sm:right-6 z-20 text-white/70 text-xs font-medium tracking-wider">
                <span className="text-white font-bold text-lg">{current + 1}</span> /{" "}
                {slides.length}
            </div>

            {/* Auto-play Progress */}
            <div className="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white/20">
                <div
                    key={current}
                    className="h-full bg-amber-500 transition-all duration-[5000ms] ease-linear"
                    style={{
                        animation: `progress 5s linear forwards`,
                        animationPlayState: isAutoPlaying ? "running" : "paused",
                    }}
                />
            </div>
        </section>
    );
}