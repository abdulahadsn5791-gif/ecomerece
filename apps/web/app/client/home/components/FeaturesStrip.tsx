"use client";

import { useThemeStore } from "@ecomerece/frontend";
import type { HomeFeatureResponse } from "@ecomerece/shared";
import { Headset, RefreshCw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    "Free shipping": Truck,
    "30-day returns": RefreshCw,
    "Secure payment": ShieldCheck,
    "24/7 support": Headset,
};

const defaultIcons: LucideIcon[] = [Truck, RefreshCw, ShieldCheck, Headset];

export default function FeaturesStrip({ features }: { features: HomeFeatureResponse[] }) {
    const { darkMode } = useThemeStore();
    const borderColor = darkMode ? "border-neutral-800" : "border-neutral-200";

    if (!features.length) return null;

    return (
        <section
            className={`border-b py-2 transition-colors duration-500 ${darkMode ? "bg-neutral-950 border-neutral-800" : "bg-white border-neutral-200"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4">
                    {features.map((f, idx) => {
                        const Icon = iconMap[f.title] || defaultIcons[idx % defaultIcons.length];
                        const mobileBorderR = idx % 2 === 0 ? "border-r" : "border-r-0";
                        const mobileBorderB = idx < 2 ? "border-b" : "border-b-0";
                        const lgBorderL = idx === 0 ? "lg:border-l-0" : "lg:border-l";

                        return (
                            <div
                                key={f.id}
                                style={{ "--accent": f.accent } as React.CSSProperties}
                                className={`group relative flex items-center gap-3 sm:gap-4 px-3 py-6 sm:px-6 transition-colors duration-300 hover:bg-[var(--accent)]/5 ${borderColor} ${mobileBorderR} ${mobileBorderB} ${lgBorderL} lg:border-r-0 lg:border-b-0`}
                            >
                                <span className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />

                                <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0">
                                    <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--accent)] transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--accent)] transition-all duration-300 group-hover:w-3.5 group-hover:h-3.5" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[var(--accent)]" strokeWidth={1.75} />
                                    </div>
                                </div>

                                <div className="min-w-0">
                                    <h4
                                        className={`font-semibold text-sm sm:text-base mb-0.5 truncate ${darkMode ? "text-white" : "text-neutral-900"
                                            }`}
                                    >
                                        {f.title}
                                    </h4>
                                    <p className={`text-xs sm:text-sm truncate ${darkMode ? "text-neutral-400" : "text-neutral-500"}`}>
                                        {f.detail}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
