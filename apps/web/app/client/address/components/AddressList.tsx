import Home from '@/app/page'
import { CheckCircle, MapPin, Pencil, Star, Trash2 } from 'lucide-react'
import React from 'react'

function AddressList({ addresses }) {
    return (
        <div>
            {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map(address => (
                        <div
                            key={address.id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative"
                        >
                            {address.defaultDate && (
                                <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-semibold mb-3">
                                    <CheckCircle className="w-3 h-3" /> Default
                                </span>
                            )}
                            <div className="flex items-start gap-3">
                                <MapPin
                                    className="w-5 h-5 mt-1 text-gray-500 dark:text-gray-400 shrink-0" />
                                <p className="text-gray-700 dark:text-gray-300">{address.fullAddress}</p>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                Added: {address.createdAt.toLocaleDateString()}
                            </p>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={() => openEditForm(address)}
                                    className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Pencil className="w-3 h-3" /> Edit
                                </button>
                                <button
                                    onClick={() => setDeleteId(address.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-full text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                                {!address.defaultDate && (
                                    <button
                                        onClick={() => handleSetDefault(address.id)}
                                        className="inline-flex items-center gap-1 px-3 py-1 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-full text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ml-auto"
                                    >
                                        <Star className="w-3 h-3" /> Set Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                        <Home className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No addresses yet</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Add a new address to get started.</p>
                    <button
                        onClick={() => openCreateForm}
                        className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                        Add Address
                    </button>
                </div>
            )}
        </div>
    )
}

export default AddressList
