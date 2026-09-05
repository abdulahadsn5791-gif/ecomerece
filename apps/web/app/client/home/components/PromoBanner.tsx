// components/PromoBanner.tsx
"use client";

import { useThemeStore } from "@ecomerece/frontend";
import { ArrowRight, Sparkles, Timer } from "lucide-react";

export default function PromoBanner() {
    const { darkMode } = useThemeStore();

    return (
        <section className={`py-20 transition-colors duration-500 ${darkMode ? "bg-neutral-950" : "bg-white"
            }`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl border ${darkMode ? "border-neutral-800" : "border-neutral-200"
                    }`}>
                    {/* Background Image */}
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
                        alt="Promotional banner"
                        className="w-full h-[350px] sm:h-[450px] lg:h-[520px] object-cover scale-105 hover:scale-100 transition-transform duration-700"
                        loading="lazy"
                    />

                    {/* Clean Dark Overlay (Solid, no multi-stop multi-opacity gradient) */}
                    <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-[2px]" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-xl px-8 sm:px-12 lg:px-16">

                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 bg-white/10 text-white border border-white/20 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>Mid-Season Sale</span>
                            </div>

                            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
                                Up to 50% Off<br />
                                <span className="text-neutral-300">Premium Styles</span>
                            </h2>

                            <p className="text-neutral-300 text-base sm:text-lg mb-8 max-w-md font-normal leading-relaxed">
                                Limited time offer on our most coveted pieces. Don't miss out on these exclusive deals.
                            </p>

                            <div className="flex items-center gap-4 flex-wrap">
                                <a
                                    href="#featured"
                                    className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 font-semibold rounded-full shadow-lg hover:bg-neutral-200 transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base"
                                >
                                    Shop the Sale <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>

                                <div className="inline-flex items-center gap-2 px-4 py-3 text-white text-xs sm:text-sm font-medium">
                                    <Timer className="w-4 h-4 text-neutral-400" />
                                    <span>Ends Sunday Midnight</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}