// components/PromoBanner.tsx
"use client";

import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
    return (
        <section className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
                        alt="Promotional banner"
                        className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900/85 via-stone-900/60 to-transparent" />

                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-xl px-6 sm:px-10 lg:px-14 animate-fade-in-up">
                            <span className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold tracking-widest uppercase mb-4">
                                Mid-Season Sale
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-3">
                                Up to 50% Off
                                <br />
                                <span className="text-amber-400">Premium Styles</span>
                            </h2>
                            <p className="text-stone-300 text-sm sm:text-base mb-6 max-w-sm leading-relaxed">
                                Limited time offer on our most coveted pieces. Don't miss out
                                on these exclusive deals.
                            </p>
                            <a
                                href="#featured"
                                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-stone-900 font-semibold rounded-full shadow-xl hover:bg-stone-100 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                            >
                                Shop the Sale <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}