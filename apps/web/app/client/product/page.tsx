"use client"

import { useState } from 'react';
import {
    Phone,
    Mail,
    Globe,
    Package,
    Gift,
    HelpCircle,
    Search,
    Heart,
    User,
    ShoppingCart,
    Moon,
    Sun,
    Truck,
    RefreshCw,
    CheckCircle,
    Zap,
    Edit,
    Trash2,
    Plus,
    ArrowRight,
    //   Facebook,
    //   Instagram,
    //   Twitter,
    //   Linkedin,
} from 'lucide-react';

// ============ DATA ============
const categories = ['Home', 'Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Gaming', 'Deals', 'New Arrivals'];

const variants = [
    { id: 1, title: 'Black', price: 149.99, discountedPrice: 149.99 },
    { id: 2, title: 'Silver', price: 179.99, discountedPrice: 159.99 },
    { id: 3, title: 'Blue', price: 199.99, discountedPrice: 179.99 },
];

const reviewsData = [
    {
        author: 'Sarah Johnson',
        date: '2026-08-15',
        rating: 5,
        text: 'Absolutely love these headphones! The noise cancellation is top-notch and they are extremely comfortable for long listening sessions.'
    },
    {
        author: 'Michael Chen',
        date: '2026-08-10',
        rating: 4,
        text: 'Great sound quality and build. Battery life is excellent. Only minor issue is the ear cups could be a bit softer.'
    },
    {
        author: 'Emily Davis',
        date: '2026-08-05',
        rating: 5,
        text: 'Best headphones I have ever owned. Worth every penny. Highly recommend for anyone looking for premium audio experience.'
    }
];

const relatedProducts = [
    { id: 1, vendor: 'SoundMax', name: 'Portable Bluetooth Speaker - Deep Bass', price: '$59.99', image: 'https://picsum.photos/seed/related1/400/400' },
    { id: 2, vendor: 'TechNova', name: 'Wireless Earbuds Pro', price: '$89.99', image: 'https://picsum.photos/seed/related2/400/400' },
    { id: 3, vendor: 'AudioTech', name: 'Over-Ear Studio Headphones', price: '$199.99', image: 'https://picsum.photos/seed/related3/400/400' },
    { id: 4, vendor: 'FitLife', name: 'Sports Wireless Earphones', price: '$49.99', image: 'https://picsum.photos/seed/related4/400/400' },
    { id: 5, vendor: 'BassBoost', name: 'Noise-Cancelling Earbuds', price: '$129.99', image: 'https://picsum.photos/seed/related5/400/400' },
];

export default function ProductPage() {
    // State for dark mode
    const [darkMode, setDarkMode] = useState(false);
    // State for selected variant
    const [selectedVariant, setSelectedVariant] = useState(variants[0]);
    // State for active tab
    const [activeTab, setActiveTab] = useState('description');

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    // Handler for thumbnail click (not implemented fully, just visual)
    const handleThumbnailClick = (src: string) => {
        const mainImage = document.querySelector('#mainImage img') as HTMLImageElement;
        if (mainImage) mainImage.src = src;
        // Update active thumbnail class manually
        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
        // We'll add active class by event target
    };

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                {/* ============ TOP BAR ============ */}
                <div className="bg-gray-100 dark:bg-gray-800 text-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-2 py-2">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                <Phone className="w-4 h-4" /> +1 (555) 123-4567
                            </span>
                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                <Mail className="w-4 h-4" /> support@shopverse.com
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                <Globe className="w-4 h-4" /> English
                            </a>
                            <a href="#" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                <Package className="w-4 h-4" /> Track Order
                            </a>
                            <a href="#" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                <Gift className="w-4 h-4" /> Gift Cards
                            </a>
                            <a href="#" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                <HelpCircle className="w-4 h-4" /> Help Center
                            </a>
                        </div>
                    </div>
                </div>

                {/* ============ HEADER ============ */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-8 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 flex-wrap py-4">
                        <a href="#" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            <span className="text-black dark:text-white">Shop</span>Verse
                        </a>
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            <span>{darkMode ? 'Light' : 'Dark'}</span>
                        </button>
                        {/* Search bar */}
                        <div className="flex-1 max-w-md flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 border border-transparent focus-within:border-black dark:focus-within:border-white focus-within:bg-white dark:focus-within:bg-gray-900 transition-all">
                            <input
                                type="text"
                                placeholder="Search products, brands, and more..."
                                className="flex-1 bg-transparent border-none outline-none py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Nav actions */}
                        <div className="flex items-center gap-2">
                            <button className="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Heart className="w-5 h-5" />
                                <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">3</span>
                            </button>
                            <button className="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                <User className="w-5 h-5" />
                            </button>
                            <button className="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">5</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* ============ NAVIGATION ============ */}
                <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-24 z-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto">
                        {categories.map((item, idx) => (
                            <a
                                key={item}
                                href="#"
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${idx === 0
                                    ? 'text-black dark:text-white border-black dark:border-white'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
                                    } transition-colors`}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* ============ BREADCRUMB ============ */}
                <div className="bg-white dark:bg-gray-900 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white">Home</a>
                        <span>/</span>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white">Electronics</a>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium">Wireless Noise-Cancelling Headphones Pro</span>
                    </div>
                </div>

                {/* ============ PRODUCT MAIN SECTION ============ */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Gallery */}
                        <div className="flex flex-col gap-4">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
                                <img
                                    id="mainImage"
                                    src="https://picsum.photos/seed/product1/600/600"
                                    alt="Product main"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {['product1', 'product1b', 'product1c', 'product1d'].map((seed, idx) => (
                                    <button
                                        key={seed}
                                        onClick={() => {
                                            const mainImage = document.getElementById('mainImage') as HTMLImageElement;
                                            if (mainImage) mainImage.src = `https://picsum.photos/seed/${seed}/600/600`;
                                        }}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${idx === 0 ? 'border-black dark:border-white' : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <img src={`https://picsum.photos/seed/${seed}/100/100`} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product info */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Wireless Noise-Cancelling Headphones Pro</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-yellow-500">★★★★★</span>
                                <span className="text-gray-600 dark:text-gray-300">4.8</span>
                                <span className="text-gray-500 dark:text-gray-400">(2,345 reviews)</span>
                            </div>
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-3xl font-bold">${selectedVariant.discountedPrice.toFixed(2)}</span>
                                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">${selectedVariant.price.toFixed(2)}</span>
                                <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded-full text-sm font-semibold">-25%</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Experience crystal-clear audio with our best-selling noise-cancelling headphones.
                                Features active noise cancellation, 40-hour battery life, and premium comfort.
                            </p>

                            {/* Variant selector */}
                            <div className="mb-6">
                                <label className="font-semibold block mb-2">Select Variant:</label>
                                <div className="flex gap-2 flex-wrap">
                                    {variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 rounded-full border transition-colors ${selectedVariant.id === variant.id
                                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white'
                                                }`}
                                        >
                                            {variant.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 flex-wrap mb-6">
                                <button className="flex-1 min-w-[160px] px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                                </button>
                                <button className="flex-1 min-w-[160px] px-6 py-3 bg-blue-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                                    <Zap className="w-5 h-5" /> Buy Now
                                </button>
                                <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Meta info */}
                            <div className="flex gap-4 flex-wrap text-sm text-gray-600 dark:text-gray-300">
                                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> In Stock</span>
                                <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> Free Shipping over $50</span>
                                <span className="flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 30-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============ TABS ============ */}
                <section className="py-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                            {['description', 'ingredients', 'disclaimer', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                        ? 'text-black dark:text-white border-black dark:border-white'
                                        : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-white'
                                        }`}
                                >
                                    {tab === 'reviews' ? 'Reviews (3)' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="max-w-3xl text-gray-600 dark:text-gray-300">
                            {activeTab === 'description' && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product Description</h3>
                                    <p>These premium wireless headphones deliver exceptional sound quality with active noise cancellation. Perfect for travel, work, or everyday listening. Includes carrying case, USB-C charging cable, and 3.5mm audio cable.</p>
                                    <p className="mt-4">Key Features:</p>
                                    <ul className="list-disc pl-6 mt-2 space-y-1">
                                        <li>Active Noise Cancellation (ANC)</li>
                                        <li>40-hour battery life</li>
                                        <li>Bluetooth 5.3</li>
                                        <li>Built-in microphone for calls</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'ingredients' && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ingredients / Materials</h3>
                                    <p>This product does not contain any consumable ingredients. Materials used:</p>
                                    <ul className="list-disc pl-6 mt-2 space-y-1">
                                        <li>Aluminum alloy frame</li>
                                        <li>Memory foam ear cushions</li>
                                        <li>Protein leather</li>
                                        <li>ABS plastic</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'disclaimer' && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Disclaimer</h3>
                                    <ul className="list-disc pl-6 mt-2 space-y-1">
                                        <li>Product specifications may vary slightly from description.</li>
                                        <li>Do not expose to extreme temperatures.</li>
                                        <li>Battery life depends on usage and settings.</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Reviews</h3>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold mb-4 hover:bg-gray-800 dark:hover:bg-gray-200">
                                        <Plus className="w-4 h-4" /> Write a Review
                                    </button>
                                    {reviewsData.map((review, idx) => (
                                        <div key={idx} className="border-b border-gray-200 dark:border-gray-700 py-4">
                                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                                <span className="font-semibold">{review.author}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                                                <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 mb-2">{review.text}</p>
                                            <div className="flex gap-2">
                                                <button className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Edit className="w-3 h-3" /> Edit
                                                </button>
                                                <button className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ============ RELATED PRODUCTS ============ */}
                <section className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                        <div className="overflow-x-auto">
                            <div className="flex gap-4 w-max">
                                {relatedProducts.map(product => (
                                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 w-48 flex-shrink-0">
                                        <div className="m-2 aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="px-3 pb-3">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{product.vendor}</div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{product.name}</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">{product.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============ FOOTER ============ */}
                <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <a href="#" className="text-xl font-bold text-gray-900 dark:text-white">
                                <span>Shop</span>Verse
                            </a>
                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                Your one-stop destination for quality products at unbeatable prices. Shop with confidence and enjoy a seamless online shopping experience.
                            </p>
                            {/* <div className="flex gap-3 mt-4">
                <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div> */}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Customer Service</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">FAQs</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Shipping Policy</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Returns & Refunds</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Order Tracking</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Support Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Categories</h4>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Fashion & Apparel</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Electronics & Gadgets</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Home & Furniture</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Beauty & Health</a></li>
                                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Sports & Outdoors</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p>&copy; 2026 ShopVerse. All rights reserved. | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
                    </div>
                </footer>
            </div>
        </div>
    );
}