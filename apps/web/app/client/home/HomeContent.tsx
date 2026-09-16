'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { trackView } from '@/lib/analytics';
import HeroBanner from './components/HeroBanner';
import FeaturesStrip from './components/FeaturesStrip';
import Categories from './components/Categories';
import Products from './components/Products';
import Navbar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import BgProvider from '@/app/providers/BgProvider';

interface HomeContentProps {
  initialData: any;
}

export default function HomeContent({ initialData }: HomeContentProps) {
  const { darkMode } = useThemeStore();

  useEffect(() => {
    trackView('page', 'home');
  }, []);

  const slides = initialData?.slides
    ? [...initialData.slides].sort((a: any, b: any) => a.displayOrder - b.displayOrder)
    : [];
  const promos = initialData?.promos || [];
  const categories = initialData?.categories || [];
  const features = initialData?.features || [];
  const containers = initialData?.productContainers
    ? [...initialData.productContainers].sort((a: any, b: any) => a.displayOrder - b.displayOrder)
    : [];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar />
      <BgProvider>
        <HeroBanner slides={slides} promos={promos} />
        <Categories categories={categories} />
        {containers.map((container: any) => (
          <Products key={container.id} container={container} />
        ))}
        <FeaturesStrip features={features} />
      </BgProvider>
      <Footer />
    </div>
  );
}
