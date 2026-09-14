'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { useCreateMyVendor } from '@ecomerece/frontend/vendor';
import { MapPin, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { ImageInput } from '@/components/image';
import MutationButton from '@/components/Mutationbutton';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputCls = (darkMode: boolean) =>
  darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500';

function SectionCard({
  darkMode,
  title,
  description,
  children,
}: {
  darkMode: boolean;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[28px] p-6 space-y-4 ${
        darkMode
          ? 'bg-neutral-900 border border-neutral-800'
          : 'bg-white shadow-sm border border-transparent'
      }`}
    >
      <div>
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {description && (
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  darkMode,
  children,
}: {
  label: string;
  darkMode: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <span
        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
          darkMode ? 'text-neutral-400' : 'text-neutral-500'
        }`}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export function VendorCreateForm() {
  const { darkMode } = useThemeStore();
  const router = useRouter();
  const create = useCreateMyVendor();

  const [store, setStore] = useState({ title: '', slug: '', description: '' });
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [localError, setLocalError] = useState('');

  const canSave = useMemo(() => {
    const slugValid = SLUG_PATTERN.test(store.slug.trim());
    const storeValid =
      store.title.trim().length >= 3 &&
      slugValid &&
      store.slug.trim().length >= 3 &&
      store.description.trim().length >= 10;
    const addressValid =
      contact.streetAddress.trim().length > 0 &&
      contact.city.trim().length > 0 &&
      contact.state.trim().length > 0 &&
      contact.postalCode.trim().length > 0 &&
      contact.country.trim().length > 0;
    const contactValid =
      contact.phone.trim().length > 0 && EMAIL_PATTERN.test(contact.email.trim()) && addressValid;
    return storeValid && contactValid && logo.trim().length > 0 && banner.trim().length > 0;
  }, [store, contact, logo, banner]);

  const handleSubmit = async () => {
    setLocalError('');
    if (store.title.trim().length < 3)
      return setLocalError('Store name must be at least 3 characters.');
    if (store.slug.trim().length < 3) return setLocalError('Slug must be at least 3 characters.');
    if (!SLUG_PATTERN.test(store.slug.trim()))
      return setLocalError('Slug may only contain lowercase letters, numbers, and single hyphens.');
    if (store.description.trim().length < 10)
      return setLocalError('Description must be at least 10 characters.');
    if (!contact.phone.trim()) return setLocalError('Phone number is required.');
    if (!EMAIL_PATTERN.test(contact.email.trim()))
      return setLocalError('Enter a valid email address.');
    if (
      !contact.streetAddress.trim() ||
      !contact.city.trim() ||
      !contact.state.trim() ||
      !contact.postalCode.trim() ||
      !contact.country.trim()
    )
      return setLocalError('Complete every address field.');
    if (!logo.trim() || !banner.trim()) return setLocalError('A logo and banner are required.');

    try {
      await create.mutateAsync({
        title: store.title.trim(),
        slug: store.slug.trim(),
        description: store.description.trim(),
        contacts: {
          phone: contact.phone.trim(),
          email: contact.email.trim(),
          address: {
            streetAddress: contact.streetAddress.trim(),
            city: contact.city.trim(),
            state: contact.state.trim(),
            postalCode: contact.postalCode.trim(),
            country: contact.country.trim(),
          },
        },
        image: { logo: logo.trim(), banner: banner.trim() },
      });
      router.push('/vendor/dashboard');
    } catch {
      /* surfaced via create.error */
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard
        darkMode={darkMode}
        title="Store information"
        description="Your store name, URL slug, and short description."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Store name" darkMode={darkMode}>
              <input
                type="text"
                value={store.title}
                onChange={(e) => setStore((p) => ({ ...p, title: e.target.value }))}
                placeholder="Store name"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
            <Field label="Slug" darkMode={darkMode}>
              <input
                type="text"
                value={store.slug}
                onChange={(e) => setStore((p) => ({ ...p, slug: e.target.value }))}
                placeholder="my-store"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
          </div>
          <div
            className={`px-4 py-3 rounded-2xl text-sm ${darkMode ? 'bg-neutral-800/60 text-neutral-300' : 'bg-neutral-50 text-neutral-600'}`}
          >
            <p className="text-xs">Public store URL: /vendor/{store.slug.trim() || '…'}</p>
          </div>
          <Field label="Description" darkMode={darkMode}>
            <textarea
              value={store.description}
              onChange={(e) => setStore((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              placeholder="Tell customers about your store"
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 resize-y ${inputCls(darkMode)}`}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        darkMode={darkMode}
        title="Contact information"
        description="How customers can reach you."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" darkMode={darkMode}>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+1 555 000 0000"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
            <Field label="Email" darkMode={darkMode}>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                placeholder="support@store.com"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <MapPin
              className={`w-3.5 h-3.5 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            />
            <span className={darkMode ? 'text-neutral-400' : 'text-neutral-500'}>Address</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Street address" darkMode={darkMode}>
                <input
                  type="text"
                  value={contact.streetAddress}
                  onChange={(e) => setContact((p) => ({ ...p, streetAddress: e.target.value }))}
                  placeholder="Street address"
                  className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
                />
              </Field>
            </div>
            <Field label="City" darkMode={darkMode}>
              <input
                type="text"
                value={contact.city}
                onChange={(e) => setContact((p) => ({ ...p, city: e.target.value }))}
                placeholder="City"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
            <Field label="State" darkMode={darkMode}>
              <input
                type="text"
                value={contact.state}
                onChange={(e) => setContact((p) => ({ ...p, state: e.target.value }))}
                placeholder="State"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
            <Field label="Postal code" darkMode={darkMode}>
              <input
                type="text"
                value={contact.postalCode}
                onChange={(e) => setContact((p) => ({ ...p, postalCode: e.target.value }))}
                placeholder="Postal code"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
            <Field label="Country" darkMode={darkMode}>
              <input
                type="text"
                value={contact.country}
                onChange={(e) => setContact((p) => ({ ...p, country: e.target.value }))}
                placeholder="Country"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        darkMode={darkMode}
        title="Store images"
        description="Upload a logo and banner, or paste external image URLs. New vendor accounts await admin verification."
      >
        <div className="space-y-4">
          <Field label="Logo" darkMode={darkMode}>
            <ImageInput value={logo} onChange={setLogo} darkMode={darkMode} tone="emerald" />
          </Field>
          <Field label="Banner" darkMode={darkMode}>
            <ImageInput value={banner} onChange={setBanner} darkMode={darkMode} tone="emerald" />
          </Field>
        </div>
      </SectionCard>

      {localError && (
        <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>{localError}</p>
      )}
      {create.error && (
        <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
          {create.error instanceof Error
            ? create.error.message
            : 'Could not create the vendor account.'}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/vendor/dashboard')}
          className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
            darkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Cancel
        </button>
        <MutationButton
          variant="success"
          size="md"
          isLoading={create.isPending}
          disabled={!canSave}
          icon={Store}
          onClick={handleSubmit}
        >
          Create vendor
        </MutationButton>
      </div>
    </div>
  );
}
