import { Plus } from 'lucide-react'
import React from 'react'

function AddressHeader() {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Addresses</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your saved delivery addresses.</p>
            </div>
            <button
                onClick={() => openCreateForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold shadow-sm hover:shadow-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all"
            >
                <Plus className="w-4 h-4" /> Add New Address
            </button>
        </div>
    )
}

export default AddressHeader
