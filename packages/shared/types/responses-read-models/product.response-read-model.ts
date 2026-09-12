import type { Metrics } from '../StatTypes';

/** Public-safe subset of denormalized product stats. Revenue-sensitive fields are stripped. */
export type PublicProductStats = Pick<
  Metrics,
  'views' | 'clicks' | 'purchases' | 'quantity' | 'addToCart' | 'wishlist'
>;

export interface ProductResponseReadModel {
  id: string;
  minPrice: number;
  maxPrice: number;
  minDiscountedPrice: number;
  maxDiscountedPrice: number;
  version: number;
  averageRating: number;
  totalReviews: number;
  categoryId: string;
  title: string;
  vendorTitle: string;
  inStock: boolean;
  appearance: 'public' | 'private';
  description: string;
  vendorId: string;
  ingredient: {
    isIngredients: boolean;
    ingredients: string[];
  };
  disclaimer: {
    isDisclaimer: boolean;
    disclaimers: {
      name: string;
      title: string;
    }[];
  };
  image: {
    images: {
      url: string;
      alt: string;
      default: boolean;
    }[];
  };
  stats?: PublicProductStats;
  createdAt: Date;
}

/** Admin/vendor response — includes the full denormalized metrics, revenue included. */
export interface ProductAdminResponseReadModel extends Omit<ProductResponseReadModel, 'stats'> {
  stats?: Metrics;
}
