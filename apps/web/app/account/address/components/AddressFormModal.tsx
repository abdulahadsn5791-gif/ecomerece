import React from 'react';
import { X } from 'lucide-react';
import { useThemeStore } from '@ecomerece/frontend';
import type { createMyAddressDtoType } from '@ecomerece/shared';

interface AddressFormModalProps {
    editId: string | null;
    setFormOpen: (open: boolean) => void;
    formData: createMyAddressDtoType;
    handleInputChange: (field: keyof createMyAddressDtoType, value: string) => void;
    formError: string;
    handleSubmit: () => void;
    isPending?: boolean;
}

export default function AddressFormModal({
    editId,
    setFormOpen,
    formData,
    handleInputChange,
    formError,
    handleSubmit,
    isPending,
}: AddressFormModalProps) {

    
    const { darkMode } = useThemeStore();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{editId ? 'Edit Address' : 'Add New Address'}</h2>
                    <button
                        onClick={() => setFormOpen(false)}
                        className={`p-1 rounded-full cursor-pointer ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Street Address</label>
                        <input
                            type="text"
                            value={formData.streetAddress}
                            onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white focus:border-white' : 'border-gray-300 bg-white text-gray-900 focus:border-black'
                                }`}
                            placeholder="123 Main St, Apt 4"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white focus:border-white' : 'border-gray-300 bg-white text-gray-900 focus:border-black'
                                    }`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">State</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white focus:border-white' : 'border-gray-300 bg-white text-gray-900 focus:border-black'
                                    }`}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Postal Code</label>
                            <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white focus:border-white' : 'border-gray-300 bg-white text-gray-900 focus:border-black'
                                    }`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Country</label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white focus:border-white' : 'border-gray-300 bg-white text-gray-900 focus:border-black'
                                    }`}
                            />
                        </div>
                    </div>
                    {formError && <p className="text-red-500 text-sm">{formError}</p>}
                    <button
                        disabled={isPending}
                        onClick={handleSubmit}
                        className={`w-full px-4 py-2 rounded-full font-semibold transition-colors cursor-pointer disabled:opacity-50 ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                            }`}
                    >
                        {isPending ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </div>
        </div>
    );
}