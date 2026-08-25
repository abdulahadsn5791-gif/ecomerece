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
    ShoppingBag,
    Moon,
    Sun,
    Truck,
    RefreshCw,
    ShieldCheck,
    Headset,
    ArrowRight,

} from 'lucide-react';
import Footer from '@/components/footer/Footer';

const categories = [
    { name: 'Fashion', count: '2,340 products', bg: 'bg-blue-50 dark:bg-blue-900' },
    { name: 'Electronics', count: '1,890 products', bg: 'bg-gray-50 dark:bg-gray-800' },
    { name: 'Home & Living', count: '3,120 products', bg: 'bg-blue-100 dark:bg-blue-800' },
    { name: 'Beauty', count: '1,450 products', bg: 'bg-gray-100 dark:bg-gray-700' },
    { name: 'Sports', count: '980 products', bg: 'bg-blue-50 dark:bg-blue-900' },
    { name: 'Books', count: '2,670 products', bg: 'bg-gray-50 dark:bg-gray-800' },
    { name: 'Gaming', count: '1,210 products', bg: 'bg-blue-100 dark:bg-blue-800' },
    { name: 'Toys', count: '890 products', bg: 'bg-gray-100 dark:bg-gray-700' },
    { name: 'Jewelry', count: '740 products', bg: 'bg-blue-50 dark:bg-blue-900' },
];

const featuredProducts = [
    {
        id: 1,
        vendor: 'TechNova',
        name: 'Wireless Noise-Cancelling Headphones Pro',
        rating: 5,
        reviews: '2,345',
        price: '$149.99',
        originalPrice: '$199.99',
        image: 'https://picsum.photos/seed/featured1/600/600',
    },
    {
        id: 2,
        vendor: 'FitLife',
        name: 'SmartWatch Series 8 - Fitness Tracker',
        rating: 5,
        reviews: '1,890',
        price: '$299.00',
        originalPrice: '$349.00',
        image: 'https://picsum.photos/seed/featured2/600/600',
    },
    {
        id: 3,
        vendor: 'RunWay',
        name: 'Premium Running Sneakers - Comfort Fit',
        rating: 4,
        reviews: '1,234',
        price: '$89.99',
        originalPrice: '$129.99',
        image: 'https://picsum.photos/seed/featured3/600/600',
    },
    {
        id: 4,
        vendor: 'Luxe',
        name: 'Luxury Leather Handbag - Brown',
        rating: 5,
        reviews: '987',
        price: '$179.99',
        originalPrice: '$299.99',
        image: 'https://picsum.photos/seed/featured4/600/600',
    },
    {
        id: 5,
        vendor: 'SoundMax',
        name: 'Portable Bluetooth Speaker - Deep Bass',
        rating: 4,
        reviews: '1,876',
        price: '$59.99',
        originalPrice: '$79.99',
        image: 'https://picsum.photos/seed/featured5/600/600',
    },
];

const newArrivals = [
    {
        id: 6,
        vendor: 'BrightHome',
        name: 'Smart LED Desk Lamp with Wireless Charging',
        rating: 4,
        reviews: '654',
        price: '$49.99',
        originalPrice: '$79.99',
        image: 'https://picsum.photos/seed/new1/600/600',
    },
    {
        id: 7,
        vendor: 'AdventureX',
        name: '4K Action Camera - Waterproof Edition',
        rating: 5,
        reviews: '1,567',
        price: '$199.00',
        originalPrice: '$249.00',
        image: 'https://picsum.photos/seed/new2/600/600',
    },
    {
        id: 8,
        vendor: 'BaristaPro',
        name: 'Espresso Machine - Barista Quality',
        rating: 4,
        reviews: '432',
        price: '$429.00',
        originalPrice: '$499.00',
        image: 'https://picsum.photos/seed/new3/600/600',
    },
    {
        id: 9,
        vendor: 'GameOn',
        name: 'Pro Gaming Controller - Custom Edition',
        rating: 5,
        reviews: '3,210',
        price: '$69.99',
        originalPrice: '$89.99',
        image: 'https://picsum.photos/seed/new4/600/600',
    },
    {
        id: 10,
        vendor: 'GameOn',
        name: 'Pro Gaming Controller - Custom Edition',
        rating: 5,
        reviews: '3,210',
        price: '$69.99',
        originalPrice: '$89.99',
        image: 'https://picsum.photos/seed/new4/600/600',
    },

    {
        id: 11,
        vendor: 'GameOn',
        name: 'Pro Gaming Controller - Custom Edition',
        rating: 5,
        reviews: '3,210',
        price: '$69.99',
        originalPrice: '$89.99',
        image: 'https://picsum.photos/seed/new4/600/600',
    },
    {
        id: 12,
        vendor: 'GameOn',
        name: 'Pro Gaming Controller - Custom Edition',
        rating: 5,
        reviews: '3,210',
        price: '$69.99',
        originalPrice: '$89.99',
        image: 'https://picsum.photos/seed/new4/600/600',
    },
    {
        id: 13,
        vendor: 'GameOn',
        name: 'Pro Gaming Controller - Custom Edition',
        rating: 5,
        reviews: '3,210',
        price: '$69.99',
        originalPrice: '$89.99',
        image: 'https://picsum.photos/seed/new4/600/600',
    },
];

export default function Home() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark', !darkMode);
    };

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">



                {/* Hero */}
                <section className="bg-gray-100 dark:bg-gray-800 py-20 text-center relative overflow-hidden">
                    {/* Floating gadgets (images with animation) */}
                    <div className="absolute inset-0 pointer-events-none">
                        <img
                            src="https://picsum.photos/seed/headphones2/200/200"
                            alt="Headphones"
                            className="absolute top-10 left-5 w-30 h-30 rounded-2xl shadow-lg opacity-20 hover:opacity-50 animate-bounce"
                            style={{ animationDelay: '0s' }}
                        />
                        <img
                            src="https://picsum.photos/seed/smartwatch/200/200"
                            alt="Smartwatch"
                            className="absolute top-20 right-8 w-25 h-25 rounded-2xl shadow-lg opacity-20 hover:opacity-50 animate-bounce"
                            style={{ animationDelay: '1s' }}
                        />
                        <img
                            src="https://picsum.photos/seed/camera/200/200"
                            alt="Camera"
                            className="absolute bottom-15 left-15 w-35 h-35 rounded-2xl shadow-lg opacity-20 hover:opacity-50 animate-bounce"
                            style={{ animationDelay: '2s' }}
                        />
                        <img
                            src="https://picsum.photos/seed/phone/200/200"
                            alt="Phone"
                            className="absolute bottom-20 right-20 w-30 h-30 rounded-2xl shadow-lg opacity-20 hover:opacity-50 animate-bounce"
                            style={{ animationDelay: '0.5s' }}
                        />
                        <img
                            src="https://picsum.photos/seed/laptop/200/200"
                            alt="Laptop"
                            className="absolute top-45 left-35 w-20 h-20 rounded-2xl shadow-lg opacity-20 hover:opacity-50 animate-bounce"
                            style={{ animationDelay: '1.5s' }}
                        />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto px-4">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                            Discover Premium Products<br />
                            <span className="text-black dark:text-white">With Apple‑like Simplicity</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Shop the latest trends in fashion, electronics, and home essentials. Free shipping on orders over $50.
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <a href="#" className="inline-flex items-center gap-2 px-7 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-md">
                                <ShoppingBag className="w-5 h-5" /> Shop Now
                            </a>
                            <a href="#" className="inline-flex items-center gap-2 px-7 py-3 border border-black dark:border-white text-black dark:text-white rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                View Deals
                            </a>
                        </div>
                        <div className="flex justify-center gap-10 mt-10 flex-wrap">
                            <div><div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div><div className="text-sm text-gray-500 dark:text-gray-400">Products</div></div>
                            <div><div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div><div className="text-sm text-gray-500 dark:text-gray-400">Happy Customers</div></div>
                            <div><div className="text-2xl font-bold text-gray-900 dark:text-white">4.8★</div><div className="text-sm text-gray-500 dark:text-gray-400">Average Rating</div></div>
                            <div><div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div><div className="text-sm text-gray-500 dark:text-gray-400">Support</div></div>
                        </div>
                    </div>
                </section>

                {/* Features Strip */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md transition-colors">
                            <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto mb-3">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Free Shipping</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">On orders over $50</p>
                        </div>
                        <div className="text-center p-5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-700 text-white flex items-center justify-center mx-auto mb-3">
                                <RefreshCw className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">30‑Day Returns</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Easy & free returns</p>
                        </div>
                        <div className="text-center p-5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gray-600 dark:bg-gray-500 text-white flex items-center justify-center mx-auto mb-3">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">100% protected</p>
                        </div>
                        <div className="text-center p-5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 text-white flex items-center justify-center mx-auto mb-3">
                                <Headset className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">24/7 Support</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Always here to help</p>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-baseline mb-8 flex-wrap gap-3">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Shop by Category</h2>
                            <a href="#" className="inline-flex items-center gap-1 text-black dark:text-white font-medium hover:underline">
                                View All Categories <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            {categories.map((cat) => (
                                <div
                                    key={cat.name}
                                    className={`${cat.bg} rounded-xl p-3 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 border border-transparent hover:border-black dark:hover:border-white`}
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{cat.name}</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">{cat.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-baseline mb-8 flex-wrap gap-3">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Products</h2>
                            <a href="#" className="inline-flex items-center gap-1 text-black dark:text-white font-medium hover:underline">
                                View All Products <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
                            {featuredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 border border-gray-200 dark:border-gray-700 max-w-[210px] mx-auto w-full group"
                                >
                                    <div className="bg-gray-100 dark:bg-gray-700 aspect-square m-2 rounded-2xl overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="px-3 pb-3 flex flex-col gap-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{product.vendor}</span>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{product.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="text-yellow-500">{"★".repeat(product.rating)}</span>
                                            <span>({product.reviews})</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">{product.price}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 line-through">{product.originalPrice}</span>
                                            </div>
                                            <button className="inline-flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                                <ShoppingCart className="w-3 h-3" /> Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* New Arrivals */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-baseline mb-8 flex-wrap gap-3">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">New Arrivals</h2>
                            <a href="#" className="inline-flex items-center gap-1 text-black dark:text-white font-medium hover:underline">
                                View All New Arrivals <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            {newArrivals.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 border border-gray-200 dark:border-gray-700 max-w-[210px] mx-auto w-full group"
                                >
                                    <div className="bg-gray-100 dark:bg-gray-700 aspect-square m-2 rounded-2xl overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="px-3 pb-3 flex flex-col gap-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{product.vendor}</span>
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{product.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="text-yellow-500">{"★".repeat(product.rating)}</span>
                                            <span>({product.reviews})</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">{product.price}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 line-through">{product.originalPrice}</span>
                                            </div>
                                            <button className="inline-flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                                <ShoppingCart className="w-3 h-3" /> Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trusted Brands */}
                <section className="bg-gray-100 dark:bg-gray-800 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Trusted by Leading Brands</h2>
                        <div className="flex justify-center items-center flex-wrap gap-8 opacity-70">
                            {['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Dell', 'LG', 'Bose'].map((brand) => (
                                <span key={brand} className="text-xl font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    {brand}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}