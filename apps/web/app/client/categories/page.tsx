"use client";

import { useGetPaginatedCategories } from "@ecomerece/frontend/category";
import { useThemeStore } from "@ecomerece/frontend/theme";
import { ArrowRight, Loader2, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const { darkMode } = useThemeStore();
  const { data, isLoading, isError } = useGetPaginatedCategories({ limit: 50, direction: "next" });

  const categories = data?.data ?? [];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-neutral-950 text-white" : "bg-white text-neutral-900"
      }`}
    >
      {/* Hero strip */}
      <section
        className={`border-b py-14 sm:py-20 transition-colors duration-500 ${
          darkMode ? "bg-neutral-950 border-neutral-800" : "bg-neutral-50 border-neutral-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border shadow-sm ${
                darkMode
                  ? "bg-neutral-900 border-neutral-800 text-neutral-300"
                  : "bg-white border-neutral-200 text-neutral-600"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Browse
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">All Categories</h1>
          <p
            className={`text-sm sm:text-base max-w-xl ${
              darkMode ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            Explore our full catalogue — find exactly what your routine needs.
          </p>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
            </div>
          )}

          {isError && (
            <div
              className={`rounded-2xl border p-10 text-center ${
                darkMode ? "border-neutral-800 bg-neutral-900/60" : "border-neutral-200 bg-neutral-50"
              }`}
            >
              <p className="font-semibold mb-1">Something went wrong</p>
              <p className={`text-sm ${darkMode ? "text-neutral-500" : "text-neutral-500"}`}>
                Could not load categories. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !isError && categories.length === 0 && (
            <div
              className={`rounded-2xl border p-10 text-center ${
                darkMode ? "border-neutral-800 bg-neutral-900/60" : "border-neutral-200 bg-neutral-50"
              }`}
            >
              <LayoutGrid className="w-10 h-10 mx-auto mb-3 text-neutral-400" />
              <p className="font-semibold mb-1">No categories yet</p>
              <p className={`text-sm ${darkMode ? "text-neutral-500" : "text-neutral-500"}`}>
                Check back soon — new categories are on the way.
              </p>
            </div>
          )}

          {!isLoading && !isError && categories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/?categoryId=${category.id}`}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    darkMode
                      ? "bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 focus-visible:ring-neutral-400 focus-visible:ring-offset-neutral-950"
                      : "bg-white border-neutral-200 hover:border-neutral-300 focus-visible:ring-neutral-500 focus-visible:ring-offset-white"
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`aspect-[4/3] overflow-hidden ${
                      darkMode ? "bg-neutral-950" : "bg-neutral-100"
                    }`}
                  >
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* dark scrim on hover */}
                    <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/10 transition-colors duration-300 pointer-events-none" />
                  </div>

                  {/* Content */}
                  <div
                    className={`flex items-center justify-between gap-3 px-4 py-4 ${
                      darkMode ? "border-t border-neutral-800" : "border-t border-neutral-100"
                    }`}
                  >
                    <div>
                      <h2 className="font-bold text-base leading-tight">{category.title}</h2>
                      <p
                        className={`text-xs mt-0.5 ${
                          darkMode ? "text-neutral-500" : "text-neutral-500"
                        }`}
                      >
                        Browse products →
                      </p>
                    </div>

                    <span
                      className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 group-hover:scale-110 ${
                        darkMode
                          ? "bg-neutral-800 border-neutral-700 text-neutral-300 group-hover:bg-white group-hover:text-neutral-900 group-hover:border-white"
                          : "bg-neutral-100 border-neutral-200 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900"
                      }`}
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
