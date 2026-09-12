import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useThemeStore } from '@ecomerece/frontend/theme';
import type { createMyAddressDtoType } from '@ecomerece/shared';
import MutationButton from '@/components/Mutationbutton';
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

    const inputCls = `w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all ${darkMode
            ? 'border-neutral-700 bg-neutral-800/80 text-white focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400'
            : 'border-neutral-200 bg-white text-neutral-900 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
        }`;

    const labelCls = `block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-neutral-600'
        }`;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div
                className={`rounded-3xl shadow-2xl w-full max-w-md p-6 transition-colors border ${darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-100 text-neutral-900'
                    }`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{editId ? 'Edit Address' : 'Add New Address'}</h2>
                    <button
                        type="button"
                        onClick={() => setFormOpen(false)}
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500'
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Street Address</label>
                        <input
                            type="text"
                            value={formData.streetAddress}
                            onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                            className={inputCls}
                            placeholder="123 Main St, Apt 4"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>City</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>State</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Postal Code</label>
                            <input
                                type="text"
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Country</label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {formError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{formError}</span>
                        </div>
                    )}

                    <div className="pt-2">
                        <MutationButton
                            variant="primary"
                            fullWidth
                            isLoading={isPending}
                            loadingText={editId ? 'Updating Address...' : 'Saving Address...'}
                            onClick={handleSubmit}
                        >
                            {editId ? 'Update Address' : 'Save Address'}
                        </MutationButton>
                    </div>
                </div>
            </div>
        </div>
    );
}