"use client"

import { useState } from 'react';
import { z } from 'zod';

import Navbar from '@/components/navbar/NavBar';
import DeleteConfirmation from './components/DeleteConfirmation';

import Aside from '@/components/aside/Aside';
import Footer from '@/components/footer/Footer';
import AddressList from './components/AddressList';
import AddressHeader from './components/AddressHeader';

// ============ TYPE DEFINITIONS ============
interface AddressResponseReadModel {
    id: string;
    ownerId: string;
    defaultDate: Date | null;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullAddress: string;
    createdAt: Date;
}

// DTO schemas
const nameSchema = z.string().min(1).max(100);
const titleSchema = z.string().min(1).max(200);

const createMyAddressDto = z.object({
    streetAddress: titleSchema,
    city: nameSchema,
    state: nameSchema,
    postalCode: z.string().min(1).max(10),
    country: nameSchema,
});

type AddressDto = z.infer<typeof createMyAddressDto>;

// ============ MOCK DATA ============
const mockAddresses: AddressResponseReadModel[] = [
    {
        id: '1',
        ownerId: 'user1',
        defaultDate: new Date('2026-08-01'),
        streetAddress: '1234 Main Street, Apt 5B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        fullAddress: '1234 Main Street, Apt 5B, New York, NY 10001, USA',
        createdAt: new Date('2026-01-15'),
    },
    {
        id: '2',
        ownerId: 'user1',
        defaultDate: null,
        streetAddress: '5678 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
        fullAddress: '5678 Oak Avenue, Los Angeles, CA 90001, USA',
        createdAt: new Date('2026-03-22'),
    },
    {
        id: '3',
        ownerId: 'user1',
        defaultDate: null,
        streetAddress: '789 Pine Road',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'USA',
        fullAddress: '789 Pine Road, Chicago, IL 60601, USA',
        createdAt: new Date('2026-05-10'),
    },
];

// ============ COMPONENT ============
export default function AddressesPage() {
    // Theme state
    const [darkMode, setDarkMode] = useState(false);
    // Address list state
    const [addresses, setAddresses] = useState<AddressResponseReadModel[]>(mockAddresses);
    // Form state
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<AddressDto>({
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });
    const [formError, setFormError] = useState<string>('');
    // Delete confirmation state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    // Mobile menu state (main nav)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Mobile account menu state
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    // Toggle theme
    const toggleTheme = () => setDarkMode(!darkMode);

    // Toggle mobile main nav menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        setAccountMenuOpen(false); // close account menu when opening main menu
    };

    // Toggle mobile account menu
    const toggleAccountMenu = () => {
        setAccountMenuOpen(!accountMenuOpen);
        setMobileMenuOpen(false); // close main menu when opening account menu
    };

    // Open create form
    const openCreateForm = () => {
        setEditId(null);
        setFormData({ streetAddress: '', city: '', state: '', postalCode: '', country: '' });
        setFormError('');
        setFormOpen(true);
        setMobileMenuOpen(false);
        setAccountMenuOpen(false);
    };

    // Open edit form
    const openEditForm = (address: AddressResponseReadModel) => {
        setEditId(address.id);
        setFormData({
            streetAddress: address.streetAddress,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
        });
        setFormError('');
        setFormOpen(true);
        setMobileMenuOpen(false);
        setAccountMenuOpen(false);
    };

    // Handle form input change
    const handleInputChange = (field: keyof AddressDto, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Submit form (create or update)
    const handleSubmit = () => {
        try {
            const parsed = createMyAddressDto.parse(formData);
            if (editId) {
                // Update existing address
                setAddresses(prev =>
                    prev.map(addr =>
                        addr.id === editId
                            ? { ...addr, ...parsed, fullAddress: `${parsed.streetAddress}, ${parsed.city}, ${parsed.state} ${parsed.postalCode}, ${parsed.country}` }
                            : addr
                    )
                );
            } else {
                // Create new address
                const newAddress: AddressResponseReadModel = {
                    id: Date.now().toString(),
                    ownerId: 'user1',
                    defaultDate: null,
                    streetAddress: parsed.streetAddress,
                    city: parsed.city,
                    state: parsed.state,
                    postalCode: parsed.postalCode,
                    country: parsed.country,
                    fullAddress: `${parsed.streetAddress}, ${parsed.city}, ${parsed.state} ${parsed.postalCode}, ${parsed.country}`,
                    createdAt: new Date(),
                };
                setAddresses(prev => [...prev, newAddress]);
            }
            setFormOpen(false);
            setFormError('');
        } catch (error) {
            if (error instanceof z.ZodError) {
                setFormError(error.errors.map(e => e.message).join(', '));
            }
        }
    };

    // Delete address (after confirmation)
    const handleDelete = (id: string) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        setDeleteId(null);
    };

    // Set address as default
    const handleSetDefault = (id: string) => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                defaultDate: addr.id === id ? new Date() : null,
            }))
        );
    };

    // Navigation items



    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                {/* ============ MAIN CONTENT (wider with sidebar) ============ */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar (hidden on mobile) */}
                        <Aside />
                        {/* Main content */}
                        <main className="lg:col-span-3">
                            <AddressHeader />
                            {/* Address List */}
                            <AddressList addresses={addresses} />
                        </main>
                    </div>
                </div>

                {/* ============ MODAL (Create/Update form) ============ */}
                {/* {formOpen && (<Form/>)} */}
                {/* ============ DELETE CONFIRMATION ============ */}
                {deleteId && (<DeleteConfirmation />)}

            </div>
        </div>
    );
}