import React from 'react';

interface AddressSkeletonProps {
    darkMode: boolean;
}

export default function AddressSkeleton({ darkMode }: AddressSkeletonProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
                <div
                    key={n}
                    className={`border rounded-2xl p-5 shadow-sm animate-pulse ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}
                >
                    <div className={`h-4 w-20 rounded mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-10 w-full rounded mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-4 w-32 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            ))}
        </div>
    );
}