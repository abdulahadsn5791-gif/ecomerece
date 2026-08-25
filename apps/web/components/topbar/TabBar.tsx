import React from 'react';
import { Phone, Mail, Package, HelpCircle } from 'lucide-react';

function TabBar() {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 text-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center flex-wrap gap-2 py-2" >

                < div className="flex items-center gap-6" >
                    <a
                        href="tel:+15551234567"
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Phone className="w-4 h-4" />
                        +1(555) 123 - 4567
                    </a>
                    < a
                        href="mailto:support@shopverse.com"
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Mail className="w-4 h-4" />
                        support@shopverse.com
                    </a>
                </div>


                <div className="flex items-center gap-6" >
                    <a
                        href="#"
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Package className="w-4 h-4" />
                        Track Order
                    </a>
                    < a
                        href="#"
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Help Center
                    </a>
                </div>
            </div>
        </div>
    );
}

export default TabBar;