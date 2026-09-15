"use client"
import { useEffect } from 'react';
import { useGetHomeLayout } from '@ecomerece/frontend/home';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { trackView } from '@/lib/analytics';
import HeroBanner from './client/home/components/HeroBanner';
import FeaturesStrip from './client/home/components/FeaturesStrip';
import Categories from './client/home/components/Categories';
import Products from './client/home/components/Products';
import Navbar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import { Loader2 } from 'lucide-react';
import BgProvider from './providers/BgProvider';

export default function Home() {
  const { darkMode } = useThemeStore();
  const { data: homeLayout, isLoading } = useGetHomeLayout();

  useEffect(() => {
    trackView('page', 'home');
  }, []);

  const slides = homeLayout?.slides
    ? [...homeLayout.slides].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];
  const promos = homeLayout?.promos || [];
  const categories = homeLayout?.categories || [];
  const features = homeLayout?.features || [];
  const containers = homeLayout?.productContainers
    ? [...homeLayout.productContainers].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar />
      <BgProvider>
        <HeroBanner slides={slides} promos={promos} />
        <Categories categories={categories} />
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          containers.map((container) => (
            <Products key={container.id} container={container} />
          ))
        )}
        <FeaturesStrip features={features} />
      </BgProvider>
      <Footer />

    </div>
  );
}
