'use client';

import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import {
  Activity,
  Anchor,
  Apple,
  Armchair,
  Award,
  Baby,
  Banknote,
  Battery,
  BatteryCharging,
  Bed,
  Beer,
  Bike,
  Bluetooth,
  Box,
  Brush,
  Cake,
  Camera,
  Candy,
  Car,
  Cloud,
  CloudRain,
  Coins,
  Coffee,
  Compass,
  CookingPot,
  Cookie,
  Cpu,
  CreditCard,
  Crown,
  CupSoda,
  Diamond,
  DoorOpen,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Fuel,
  Gamepad2,
  Gem,
  Gift,
  GlassWater,
  Globe,
  HardDrive,
  Headphones,
  Headset,
  Heart,
  HeartPulse,
  Home,
  IceCream,
  Keyboard,
  Lamp,
  LampDesk,
  Laptop,
  Leaf,
  Lightbulb,
  Map as MapIcon,
  MapPin,
  Medal,
  MemoryStick,
  Monitor,
  Moon,
  Mouse,
  Package,
  PackageCheck,
  Paintbrush,
  Pencil,
  Plane,
  Plug,
  Printer,
  Pizza,
  Radio,
  Receipt,
  Router,
  Ship,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Snowflake,
  Sofa,
  Sparkles,
  Speaker,
  Star,
  Stethoscope,
  Store,
  Sun,
  Tablet,
  Tag,
  Tags,
  ToyBrick,
  TrainFront,
  Trophy,
  Truck,
  Tv,
  Usb,
  Utensils,
  Video,
  Wallet,
  Watch,
  Wifi,
  Wind,
  type LucideIcon,
} from 'lucide-react';

export const DEFAULT_ICON_NAME = 'Box';

export const ICON_MAP: Record<string, LucideIcon> = {
  ShoppingCart,
  ShoppingBag,
  ShoppingBasket,
  Truck,
  Package,
  PackageCheck,
  Tag,
  Tags,
  Receipt,
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  Store,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Headphones,
  Headset,
  Camera,
  Video,
  Gamepad2,
  Keyboard,
  Mouse,
  Printer,
  Speaker,
  Tv,
  Radio,
  Plug,
  Battery,
  BatteryCharging,
  Cpu,
  MemoryStick,
  HardDrive,
  Router,
  Wifi,
  Bluetooth,
  Usb,
  Watch,
  Bed,
  Sofa,
  Armchair,
  Lamp,
  Lightbulb,
  LampDesk,
  Brush,
  Paintbrush,
  DoorOpen,
  Home,
  Sparkles,
  Star,
  Heart,
  Gem,
  Diamond,
  Crown,
  Gift,
  Cake,
  Shirt,
  Footprints,
  Baby,
  ToyBrick,
  Coffee,
  GlassWater,
  CupSoda,
  Utensils,
  Beer,
  CookingPot,
  Apple,
  Candy,
  Cookie,
  Pizza,
  IceCream,
  Leaf,
  Dumbbell,
  HeartPulse,
  Stethoscope,
  Activity,
  Trophy,
  Medal,
  Award,
  Car,
  Bike,
  Plane,
  TrainFront,
  Ship,
  Fuel,
  Map: MapIcon,
  MapPin,
  Compass,
  Globe,
  Anchor,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Droplets,
  Flame,
  Box,
};

export const ICON_NAMES: string[] = Object.keys(ICON_MAP);

export function hasIcon(name?: string | null): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  return ICON_NAMES.some((n) => n.toLowerCase() === lower);
}

export function resolveIconName(name?: string | null): string {
  if (!name) return DEFAULT_ICON_NAME;
  if (ICON_MAP[name]) return name;
  const lower = name.toLowerCase();
  const match = ICON_NAMES.find((n) => n.toLowerCase() === lower);
  return match ?? name;
}

function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z])([0-9])/g, '$1-$2')
    .toLowerCase();
}

type IconComponentType = ComponentType<LucideProps>;

type IconLoader = () => Promise<{ default: ComponentType<LucideProps> }>;
const createLazyIcon = dynamic as unknown as (loader: IconLoader) => IconComponentType;

const lazyCache = new Map<string, IconComponentType>();

/**
 * Renders any lucide icon by name. Names inside `ICON_MAP` resolve to a small,
 * statically-imported set (fast, SSR-safe). Any other valid lucide icon name is
 * loaded lazily on demand via code-splitting, so the backend can store unlimited
 * icon names without bloating the initial bundle.
 */
export function getIconComponent(name?: string | null): IconComponentType {
  const resolved = resolveIconName(name);
  const staticIcon = ICON_MAP[resolved];
  if (staticIcon) return staticIcon;

  const kebab = toKebab(resolved);
  const cached = lazyCache.get(kebab);
  if (cached) return cached;

  const Lazy = createLazyIcon(async () => {
    const mod: any = await import('lucide-react/dynamicIconImports');
    const map:
      | Record<string, () => Promise<{ default: ComponentType<any> }>>
      | undefined = mod?.default ?? mod?.dynamicIconImports;
    const loader = map?.[kebab];
    if (!loader) return { default: Box };
    const iconMod = await loader();
    return { default: (iconMod.default ?? Box) as ComponentType<any> };
  }) as IconComponentType;

  lazyCache.set(kebab, Lazy);
  return Lazy;
}

export function DynamicIcon({ name, ...props }: LucideProps & { name?: string | null }) {
  const Icon = getIconComponent(name) as LucideIcon;
  return <Icon {...props} />;
}