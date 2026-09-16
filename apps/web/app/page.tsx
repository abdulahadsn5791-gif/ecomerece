import { HomeResponseReadModel } from '@ecomerece/shared';
import HomeContent from './client/home/HomeContent';

export const revalidate = 3600;

async function getHomeLayout(): Promise<HomeResponseReadModel> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${baseUrl}/home`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch home layout');
  }

  const payload = await res.json();
  if (!payload.success) {
    throw new Error('Failed to fetch home layout');
  }

  return payload.data;
}

export default async function Home() {
  const homeLayout = await getHomeLayout();

  return <HomeContent initialData={homeLayout} />;
}
