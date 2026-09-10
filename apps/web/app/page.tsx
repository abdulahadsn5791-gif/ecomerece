"use client"
import { useState } from 'react';
import {
  Phone,
  Mail,
  Globe,
  Package,
  Gift,
  HelpCircle,
  Search,
  Heart,
  User,
  ShoppingCart,
  ShoppingBag,
  Moon,
  Sun,
  Truck,
  RefreshCw,
  ShieldCheck,
  Headset,
  ArrowRight,

} from 'lucide-react';
import HeroBanner from './client/home/components/HeroBanner';
import FeaturesStrip from './client/home/components/FeaturesStrip';
import Categories from './client/home/components/Categories';
import Products from './client/home/components/Products';
import Navbar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';




export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <HeroBanner />
        <Categories />
        <Products />

        <FeaturesStrip />
        <Footer />
      </div>
    </div>
  );
}