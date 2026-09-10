'use client';

import { useGetHomeLayout, useThemeStore } from '@ecomerece/frontend';
import { motion } from 'framer-motion';
import { HomeSkeleton } from './components/HomeSkeleton';
import { HomeErrorState } from './components/HomeErrorState';
import { HomeOverview } from './components/HomeOverview';
import { SlidesSection } from './components/SlidesSection';
import { CategoriesSection } from './components/CategoriesSection';
import { PromosSection } from './components/PromosSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ContainersSection } from './components/ContainersSection';

export default function AdminHomePage() {
  const { darkMode } = useThemeStore();
  const { data, isLoading, error, refetch, isFetching } = useGetHomeLayout();

  const formatDate = (date: string | Date) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date));
    } catch {
      return 'Unknown';
    }
  };

  if (isLoading) return <HomeSkeleton darkMode={darkMode} />;

  if (error || !data) {
    return <HomeErrorState refetch={refetch} isFetching={isFetching} />;
  }

  const borderColor = darkMode ? 'border-neutral-800' : 'border-neutral-100';

  return (
    <main className="lg:col-span-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`border rounded-[28px] p-6 sm:p-8 shadow-sm transition-colors duration-300 ${
          darkMode
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-white border-neutral-100'
        }`}
      >
        <HomeOverview data={data} darkMode={darkMode} formatDate={formatDate} />

        <div className={`my-8 border-t ${borderColor}`} />

        <div className="space-y-10">
          <section id="slides">
            <SlidesSection slides={data.slides} darkMode={darkMode} />
          </section>

          <div className={`border-t ${borderColor}`} />

          <section id="categories">
            <CategoriesSection categories={data.categories} darkMode={darkMode} />
          </section>

          <div className={`border-t ${borderColor}`} />

          <section id="promos">
            <PromosSection promos={data.promos} darkMode={darkMode} />
          </section>

          <div className={`border-t ${borderColor}`} />

          <section id="features">
            <FeaturesSection features={data.features} darkMode={darkMode} />
          </section>

          <div className={`border-t ${borderColor}`} />

          <section id="containers">
            <ContainersSection
              containers={data.productContainers}
              darkMode={darkMode}
            />
          </section>
        </div>
      </motion.div>
    </main>
  );
}
