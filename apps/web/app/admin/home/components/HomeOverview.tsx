import { useThemeStore } from '@ecomerece/frontend/theme';
import {
  ImageIcon,
  Tag,
  Layers,
  Sparkles,
  Box,
  Clock,
} from 'lucide-react';
import React from 'react';
import type { HomeResponseReadModel } from '@ecomerece/shared';

interface HomeOverviewProps {
  data: HomeResponseReadModel;
  darkMode: boolean;
  formatDate: (date: string | Date) => string;
}

export const HomeOverview = ({ data, darkMode, formatDate }: HomeOverviewProps) => {
  const stats: {
    icon: typeof ImageIcon;
    label: string;
    value: number;
    color: string;
  }[] = [
    { icon: ImageIcon, label: 'Slides', value: data.slides.length, color: 'bg-blue-500' },
    { icon: Tag, label: 'Categories', value: data.categories.length, color: 'bg-violet-500' },
    { icon: Layers, label: 'Promos', value: data.promos.length, color: 'bg-orange-500' },
    { icon: Sparkles, label: 'Features', value: data.features.length, color: 'bg-emerald-500' },
    { icon: Box, label: 'Containers', value: data.productContainers.length, color: 'bg-rose-500' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-violet-900/30' : 'bg-violet-100'}`}
        >
          <ImageIcon className="w-7 h-7 text-violet-500" />
        </div>
        <div>
          <h2
            className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}
          >
            Home Layout
          </h2>
          <p
            className={`flex items-center gap-2 mt-1 text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
          >
            <Clock className="w-3.5 h-3.5" />
            Last updated {formatDate(data.updatedAt)} &middot; v{data.version}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-transform duration-200 hover:-translate-y-1 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.color}`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p
                className={`text-xs font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
              >
                {stat.label}
              </p>
              <p
                className={`text-lg font-bold ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
