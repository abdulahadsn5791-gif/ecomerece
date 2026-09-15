'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import type { ProductResponseReadModel, ProductVariantResponseReadModel } from '@ecomerece/shared';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ChevronRight,
  Edit,
  Heart,
  Package,
  Plus,
  RefreshCw,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackView } from '@/lib/analytics';

interface ProductPageProps {
  product: ProductResponseReadModel;
  variants?: ProductVariantResponseReadModel[];
  relatedProducts?: ProductResponseReadModel[];
}

const reviewsData = [
  {
    author: 'Sarah Johnson',
    date: '2026-08-15',
    rating: 5,
    text: "Absolutely love this product! The quality is top-notch and it's extremely well made.",
  },
  {
    author: 'Michael Chen',
    date: '2026-08-10',
    rating: 4,
    text: 'Great build and presentation. Only minor issue is shipping took an extra day.',
  },
];

function StarRating({ rating, size = 'w-4 h-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-neutral-300'}`}
        />
      ))}
    </div>
  );
}

export default function ProductContentPage({
  product,
  variants = [],
  relatedProducts = [],
}: ProductPageProps) {
  const { darkMode } = useThemeStore();

  useEffect(() => {
    trackView('product', product.id);
  }, [product.id]);

  // Safely compute active variants and fallback to empty array if undefined
  const activeVariants = (variants || []).filter((v) => v?.active);

  // Safely retrieve initial variant
  const initialVariant = activeVariants[0] || variants?.[0] || null;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponseReadModel | null>(
    initialVariant,
  );

  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const productImages = ['product1', 'product1b', 'product1c', 'product1d'];
  const avgRating = 4.8;
  const totalReviews = 2345;

  // Price safety checks
  const variantPrice = selectedVariant?.price ?? 0;
  const variantDiscountedPrice = selectedVariant?.discountedPrice ?? variantPrice;
  const hasDiscount = variantDiscountedPrice < variantPrice;
  const discountPercent =
    hasDiscount && variantPrice > 0
      ? Math.round((1 - variantDiscountedPrice / variantPrice) * 100)
      : 0;

  const card = darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white shadow-sm';
  const cardBorder = darkMode ? 'border-neutral-800' : 'border-neutral-100';
  const mutedText = darkMode ? 'text-neutral-400' : 'text-neutral-500';
  const headingText = darkMode ? 'text-white' : 'text-neutral-900';
  const iconBadge = darkMode ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-100 text-violet-600';
  const pillActive = 'bg-violet-600 text-white shadow-md shadow-violet-600/20';
  const pillIdle = darkMode
    ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black';

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'materials', label: product?.ingredient?.isIngredients ? 'Ingredients' : 'Materials' },
    { key: 'goodToKnow', label: 'Good to know' },
    { key: 'reviews', label: `Reviews (${reviewsData.length})` },
  ];

  const metaPills = [
    {
      label: 'In stock',
      icon: CheckCircle,
      className: darkMode
        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Free shipping over $50',
      icon: Truck,
      className: darkMode
        ? 'bg-blue-900/30 text-blue-400 border-blue-500/30'
        : 'bg-blue-100 text-blue-700 border-blue-200',
    },
    {
      label: '30-day returns',
      icon: RefreshCw,
      className: darkMode
        ? 'bg-violet-900/30 text-violet-400 border-violet-500/30'
        : 'bg-violet-100 text-violet-700 border-violet-200',
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`rounded-[28px] p-6 ${card}`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBadge}`}
            >
              <Package className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className={`flex items-center gap-1.5 text-sm mb-2 ${mutedText}`}>
                <a
                  href="#"
                  className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-neutral-900'}`}
                >
                  Home
                </a>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <a
                  href="#"
                  className={`transition-colors ${darkMode ? 'hover:text-white' : 'hover:text-neutral-900'}`}
                >
                  Store
                </a>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className={`font-medium truncate ${headingText}`}>{product?.title}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{product?.title}</h1>
              <p className={`text-sm mt-1 ${mutedText}`}>{product?.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Main product card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
          className={`rounded-[28px] p-6 sm:p-8 ${card}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Gallery */}
            <div className="flex flex-col gap-4">
              <div
                className={`aspect-square rounded-[20px] overflow-hidden border ${cardBorder} ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
              >
                <img
                  src={`https://picsum.photos/seed/${productImages[activeImage] || 'product1'}/600/600`}
                  alt={product?.title || 'Product image'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {productImages.map((seed, idx) => (
                  <button
                    key={seed}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors shrink-0 ${idx === activeImage ? 'border-violet-500' : cardBorder}`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={`https://picsum.photos/seed/${seed}/100/100`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={avgRating} />
                <span className="font-medium">{avgRating}</span>
                <span className={mutedText}>({totalReviews.toLocaleString()} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-3xl font-bold">${variantDiscountedPrice.toFixed(2)}</span>
                {hasDiscount && (
                  <>
                    <span className={`text-lg line-through ${mutedText}`}>
                      ${variantPrice.toFixed(2)}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${darkMode ? 'bg-violet-900/30 text-violet-400 border-violet-500/30' : 'bg-violet-100 text-violet-700 border-violet-200'}`}
                    >
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Meta badges */}
              <div className="flex gap-2 flex-wrap mb-6">
                {metaPills.map((pill) => (
                  <span
                    key={pill.label}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 ${pill.className}`}
                  >
                    <pill.icon className="w-3.5 h-3.5" /> {pill.label}
                  </span>
                ))}
              </div>

              {/* Variant selector */}
              {activeVariants.length > 0 && selectedVariant && (
                <div className="mb-6">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider block mb-2 ${mutedText}`}
                  >
                    Variant ({selectedVariant.title})
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {activeVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedVariant?.id === variant.id ? pillActive : pillIdle
                        }`}
                      >
                        {variant.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap mb-6">
                <button
                  className={`flex-1 min-w-[140px] px-5 py-3 sm:px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${darkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
                >
                  <ShoppingCart className="w-5 h-5" /> Add to cart
                </button>
                <button className="flex-1 min-w-[140px] px-5 py-3 sm:px-6 rounded-xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-violet-600/20 transition-colors hover:bg-violet-700">
                  <Zap className="w-5 h-5" /> Buy now
                </button>
                <button
                  onClick={() => setIsWishlisted((w) => !w)}
                  aria-pressed={isWishlisted}
                  aria-label="Save to wishlist"
                  className={`px-4 py-3 rounded-xl border flex items-center justify-center transition-colors ${isWishlisted ? 'border-violet-500 bg-violet-500/10' : `${cardBorder} ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}`}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-violet-500 text-violet-500' : ''}`}
                  />
                </button>
              </div>

              <p className={`leading-relaxed ${mutedText}`}>{product?.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          className={`rounded-[28px] p-6 sm:p-8 ${card}`}
        >
          <div className="flex gap-2 flex-wrap mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTab === tab.key ? pillActive : pillIdle}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={`rounded-[20px] border p-6 ${cardBorder}`}>
            {activeTab === 'description' && (
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>Product description</h3>
                <p className={`leading-relaxed ${mutedText}`}>{product?.description}</p>
              </div>
            )}
            {activeTab === 'materials' && (
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>
                  {product?.ingredient?.isIngredients ? 'Ingredients' : 'Materials & Composition'}
                </h3>
                <ul className={`list-disc pl-6 space-y-1 ${mutedText}`}>
                  {product?.ingredient?.ingredients?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  )) || <li>No ingredient data available</li>}
                </ul>
              </div>
            )}
            {activeTab === 'goodToKnow' && (
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>Good to know</h3>
                <ul className={`list-disc pl-6 space-y-1 ${mutedText}`}>
                  <li>Appearance setting: {product?.appearance}</li>
                  <li>Product version: {product?.version}</li>
                  <li>Carefully inspected and securely packaged prior to dispatch.</li>
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                  <h3 className={`text-xl font-semibold ${headingText}`}>Customer reviews</h3>
                  <button
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${darkMode ? 'bg-violet-500/15 text-violet-400 hover:bg-violet-500/25' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'}`}
                  >
                    <Plus className="w-4 h-4" /> Write a review
                  </button>
                </div>
                {reviewsData.map((review, idx) => (
                  <div key={idx} className={`border-b last:border-b-0 py-4 ${cardBorder}`}>
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className={`font-semibold ${headingText}`}>{review.author}</span>
                      <span className={`text-sm ${mutedText}`}>{review.date}</span>
                      <StarRating rating={review.rating} size="w-3.5 h-3.5" />
                    </div>
                    <p className={`mb-2 ${mutedText}`}>{review.text}</p>
                    <div className="flex gap-2">
                      <button
                        className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-xs font-medium transition-colors ${cardBorder} ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-xs font-medium transition-colors ${cardBorder} ${darkMode ? 'hover:bg-neutral-800' : 'hover:bg-neutral-100'}`}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Related products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
          className={`rounded-[28px] p-6 sm:p-8 ${card}`}
        >
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Package className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
            You might also like
          </h2>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-4 w-max">
              {relatedProducts?.map((related) => (
                <a
                  key={related.id}
                  href={`/product/${related.id}`}
                  className={`group rounded-2xl overflow-hidden border w-44 sm:w-48 shrink-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'}`}
                >
                  <div
                    className={`m-2 aspect-square rounded-xl overflow-hidden ${darkMode ? 'bg-neutral-900' : 'bg-neutral-100'}`}
                  >
                    <img
                      src={
                        related.image?.images?.find((img) => img.default)?.url ||
                        related.image?.images?.[0]?.url ||
                        '/placeholder.jpg'
                      }
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-3 pb-3">
                    <div className="text-sm font-semibold leading-snug mb-1">{related.title}</div>
                    <div className="text-base font-bold">${related.minDiscountedPrice}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
