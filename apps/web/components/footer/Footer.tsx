import React from 'react'

function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <a href="#" className="text-xl font-bold text-gray-900 dark:text-white">
                        <span>Shop</span>Verse
                    </a>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Your one-stop destination for quality products at unbeatable prices. Shop with confidence and enjoy a seamless online shopping experience.
                    </p>
                    <div className="flex gap-3 mt-4">
                        <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                            <span className="sr-only">Facebook</span>
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                            <span className="sr-only">Instagram</span>
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                            <span className="sr-only">Twitter</span>
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                            <span className="sr-only">LinkedIn</span>
                        </a>
                    </div>
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
    )
}

export default Footer
