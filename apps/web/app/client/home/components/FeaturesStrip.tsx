// components/FeaturesStrip.tsx
"use client";

import { useThemeStore } from "@ecomerece/frontend";
import { Headset, RefreshCw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

type Feature = {
    icon: LucideIcon;
    title: string;
    detail: string;
    /** Ties back into the same accent palette used across Categories and the hero */
    accent: string;
};

const features: Feature[] = [
    { icon: Truck, title: "Free shipping", detail: "On orders over $50", accent: "#7FA88C" },
    { icon: RefreshCw, title: "30-day returns", detail: "Easy, free returns", accent: "#3E9C9C" },
    { icon: ShieldCheck, title: "Secure payment", detail: "Your data, protected", accent: "#4A7FB5" },
    { icon: Headset, title: "24/7 support", detail: "Real people, real fast", accent: "#D4A24C" },
];

export default function FeaturesStrip() {
    const { darkMode } = useThemeStore();
    const borderColor = darkMode ? "border-neutral-800" : "border-neutral-200";

    return (
        <section
            className={`border-b py-2 transition-colors duration-500 ${darkMode ? "bg-neutral-950 border-neutral-800" : "bg-white border-neutral-200"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4">
                    {features.map((f, idx) => {
                        const Icon = f.icon;
                        // Table-style dividers: right + bottom borders on mobile's 2x2 layout,
                        // collapsing to left-only borders once it's a single row at lg.
                        const mobileBorderR = idx % 2 === 0 ? "border-r" : "border-r-0";
                        const mobileBorderB = idx < 2 ? "border-b" : "border-b-0";
                        const lgBorderL = idx === 0 ? "lg:border-l-0" : "lg:border-l";

                        return (
                            <div
                                key={f.title}
                                style={{ "--accent": f.accent } as React.CSSProperties}
                                className={`group flex items-center gap-3 sm:gap-4 px-3 py-6 sm:px-6 transition-colors duration-300 ${borderColor} ${mobileBorderR} ${mobileBorderB} ${lgBorderL} lg:border-r-0 lg:border-b-0`}
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 bg-[var(--accent)]/10 text-[var(--accent)] transition-colors duration-300 group-hover:bg-[var(--accent)] group-hover:text-white">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4
                                        className={`font-semibold text-sm sm:text-base mb-0.5 truncate ${darkMode ? "text-white" : "text-neutral-900"
                                            }`}
                                    >
                                        {f.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-neutral-500 truncate">{f.detail}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}