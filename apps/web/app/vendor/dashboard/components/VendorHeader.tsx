'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import type { VendorResponseReadModel } from '@ecomerece/shared';
import { BadgeCheck, Mail, ShieldAlert, ShieldQuestion } from 'lucide-react';

export const VendorHeader = ({ vendor }: { vendor: VendorResponseReadModel }) => {
  const { darkMode } = useThemeStore();
  const verified = vendor.verification.isVerified;

  const badge = verified ? (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        darkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      <BadgeCheck className="w-3.5 h-3.5" />
      Verified
    </span>
  ) : vendor.verification.rejectedReason ? (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        darkMode ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-50 text-rose-700'
      }`}
    >
      <ShieldAlert className="w-3.5 h-3.5" />
      Rejected
    </span>
  ) : (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        darkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-700'
      }`}
    >
      <ShieldQuestion className="w-3.5 h-3.5" />
      Pending
    </span>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div
        className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 ${
          darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
        }`}
      >
        {vendor.images.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={vendor.images.logo} alt={vendor.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-emerald-500">{vendor.title.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3">
          <h2
            className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}
          >
            {vendor.title}
          </h2>
          {badge}
        </div>
        <p className={`mt-1 text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
          {vendor.description}
        </p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
              darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            {vendor.contact.email}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${
              darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            @{vendor.slug}
          </span>
        </div>
      </div>
    </div>
  );
};
