'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import {
  useGetMyVendor,
  useUpdateMyVendorContact,
  useUpdateMyVendorImage,
  useUpdateMyVendorMeta,
} from '@ecomerece/frontend/vendor';
import { Loader2, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ImageInput } from '@/components/image';
import Mutationbutton from '@/components/Mutationbutton';

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

const inputCls = (darkMode: boolean) =>
  darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500';

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

export function VendorSettingsPage() {
  const { darkMode } = useThemeStore();
  const { data: vendor, isLoading, isError, error } = useGetMyVendor();

  const updateMeta = useUpdateMyVendorMeta();
  const updateContact = useUpdateMyVendorContact();
  const updateImage = useUpdateMyVendorImage();

  const [meta, setMeta] = useState({ title: '', slug: '', description: '' });
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
  const synced = useRef(false);

  useEffect(() => {
    if (vendor && !synced.current) {
      synced.current = true;
      setMeta({ title: vendor.title, slug: vendor.slug, description: vendor.description });
      setContact({
        phone: vendor.contact.phone,
        email: vendor.contact.email,
        streetAddress: vendor.contact.address.streetAddress,
        city: vendor.contact.address.city,
        state: vendor.contact.address.state,
        postalCode: vendor.contact.address.postalCode,
        country: vendor.contact.address.country,
      });
      setLogo(vendor.images.logo);
      setBanner(vendor.images.banner);
    }
  }, [vendor]);

  if (isLoading) {
    return (
      <main className="lg:col-span-3">
        <div
          className={`rounded-[28px] p-10 flex items-center justify-center gap-3 text-sm ${
            darkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-white shadow-sm text-neutral-500'
          }`}
        >
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading your account…
        </div>
      </main>
    );
  }

  if (isError || !vendor) {
    return (
      <main className="lg:col-span-3">
        <div
          className={`rounded-[28px] p-10 text-center text-sm ${
            darkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-white shadow-sm text-neutral-500'
          }`}
        >
          Couldn&apos;t load your vendor account. {(error as Error)?.message ?? ''}
        </div>
      </main>
    );
  }

  const canSaveMeta =
    meta.title.trim().length >= 3 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug.trim()) &&
    meta.description.trim().length >= 10;

  return (
    <main className="lg:col-span-3 space-y-6">
      <SectionCard darkMode={darkMode} title="Account settings">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Update your store&apos;s public information here. Verification and approval status are
            managed by the admin and cannot be changed.
          </p>
        </div>
        <div
          className={`px-4 py-3 rounded-2xl text-sm ${darkMode ? 'bg-neutral-800/60 text-neutral-300' : 'bg-neutral-50 text-neutral-600'}`}
        >
          <p className="font-semibold mb-0.5">Slug</p>
          <p className="text-xs">/vendor/{vendor.slug}</p>
        </div>
      </SectionCard>

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
                value={meta.title}
                onChange={(e) => setMeta((p) => ({ ...p, title: e.target.value }))}
                placeholder="Store name"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
            <Field label="Slug" darkMode={darkMode}>
              <input
                type="text"
                value={meta.slug}
                onChange={(e) => setMeta((p) => ({ ...p, slug: e.target.value }))}
                placeholder="my-store"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
          </div>
          <Field label="Description" darkMode={darkMode}>
            <textarea
              value={meta.description}
              onChange={(e) => setMeta((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              placeholder="Tell customers about your store"
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 resize-y ${inputCls(darkMode)}`}
            />
          </Field>
          <div className="flex items-center justify-end gap-3">
            {updateMeta.isSuccess && (
              <span
                className={`text-xs font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
              >
                Saved
              </span>
            )}
            <Mutationbutton
              variant="success"
              size="sm"
              isLoading={updateMeta.isPending}
              disabled={!canSaveMeta}
              onClick={() =>
                updateMeta
                  .mutateAsync({
                    title: meta.title.trim(),
                    slug: meta.slug.trim(),
                    description: meta.description.trim(),
                  })
                  .then(() => updateMeta.reset())
                  .catch(() => undefined)
              }
            >
              Save store info
            </Mutationbutton>
          </div>
          {updateMeta.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(updateMeta.error as Error).message}
            </p>
          )}
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
          <div className="flex items-center justify-end gap-3">
            {updateContact.isSuccess && (
              <span
                className={`text-xs font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
              >
                Saved
              </span>
            )}
            <Mutationbutton
              variant="success"
              size="sm"
              isLoading={updateContact.isPending}
              onClick={() =>
                updateContact
                  .mutateAsync({
                    phone: contact.phone.trim(),
                    email: contact.email.trim(),
                    address: {
                      streetAddress: contact.streetAddress.trim(),
                      city: contact.city.trim(),
                      state: contact.state.trim(),
                      postalCode: contact.postalCode.trim(),
                      country: contact.country.trim(),
                    },
                  })
                  .then(() => updateContact.reset())
                  .catch(() => undefined)
              }
            >
              Save contact info
            </Mutationbutton>
          </div>
          {updateContact.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(updateContact.error as Error).message}
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard
        darkMode={darkMode}
        title="Store images"
        description="Upload a logo and banner. Files are uploaded to the same image pipeline used across the back-office."
      >
        <div className="space-y-4">
          <Field label="Logo" darkMode={darkMode}>
            <ImageInput value={logo} onChange={setLogo} darkMode={darkMode} tone="emerald" />
          </Field>
          <Field label="Banner" darkMode={darkMode}>
            <ImageInput value={banner} onChange={setBanner} darkMode={darkMode} tone="emerald" />
          </Field>
          <div className="flex items-center justify-end gap-3">
            {updateImage.isSuccess && (
              <span
                className={`text-xs font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
              >
                Saved
              </span>
            )}
            <Mutationbutton
              variant="success"
              size="sm"
              isLoading={updateImage.isPending}
              disabled={!logo.trim() || !banner.trim()}
              onClick={() =>
                updateImage
                  .mutateAsync({ logo: logo.trim(), banner: banner.trim() })
                  .then(() => updateImage.reset())
                  .catch(() => undefined)
              }
            >
              Save images
            </Mutationbutton>
          </div>
          {updateImage.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(updateImage.error as Error).message}
            </p>
          )}
        </div>
      </SectionCard>
    </main>
  );
}
