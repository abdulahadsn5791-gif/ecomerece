import { HomeResponseReadModel } from '@ecomerece/shared';
import HomeContent from './client/home/HomeContent';

export const revalidate = process.env.NODE_ENV === 'development' ? false : 3600;

const EMPTY_LAYOUT: HomeResponseReadModel = {
  slides: [],
  promos: [],
  categories: [],
  features: [],
  productContainers: [],
} as any;

async function getHomeLayout(): Promise<HomeResponseReadModel> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const res = await fetch(`${baseUrl}/home`, {
      ...(process.env.NODE_ENV === 'development'
        ? { cache: 'no-store' }
        : { next: { revalidate: 3600 } }),
    });

    if (!res.ok) {
      return EMPTY_LAYOUT;
    }

    const payload = await res.json();
    if (!payload.success) {
      return EMPTY_LAYOUT;
    }

    return payload.data;
  } catch {
    return EMPTY_LAYOUT;
  }
}

export default async function Home() {
  const homeLayout = await getHomeLayout();

  return <HomeContent initialData={homeLayout} />;
}
