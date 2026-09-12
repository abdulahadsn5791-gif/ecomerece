"use client"
import { useState } from 'react';
import { useGetHomeLayout } from '@ecomerece/frontend/home';
import HeroBanner from './client/home/components/HeroBanner';
import FeaturesStrip from './client/home/components/FeaturesStrip';
import Categories from './client/home/components/Categories';
import Products from './client/home/components/Products';
import Navbar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const { data: homeLayout, isLoading } = useGetHomeLayout();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

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
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
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
        <Footer />
      </div>
    </div>
  );
}
