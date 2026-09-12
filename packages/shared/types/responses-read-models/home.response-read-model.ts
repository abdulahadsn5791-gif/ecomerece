export type HomeCategoryResponse = {
  id: string;
  name: string;
  image: string;
  accent: string;
  icon: string;
};

export type HomeFeatureResponse = {
  id: string;
  title: string;
  detail: string;
  accent: string;
  icon: string;
};

export type HomeSlideResponse = {
  id: string;
  tag: string;
  title: string;
  subhead: string;
  subtitle: string;
  cta: string;
  image: string;
  accent: string;
  displayOrder: number;
};

export type HomePromoResponse = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
  link: string;
};

export type HomeContainerResponse = {
  id: string;
  heading: string;
  subTitle: string;
  query: {
    filter?: Record<string, unknown>;
    cursor?: string | null;
    limit?: number;
    direction?: 'next' | 'prev';
    sort?: Record<string, 1 | -1> | null;
  };
  displayOrder: number;
};

export type HomeResponseReadModel = {
  id: string;
  categories: HomeCategoryResponse[];
  features: HomeFeatureResponse[];
  slides: HomeSlideResponse[];
  promos: HomePromoResponse[];
  productContainers: HomeContainerResponse[];
  version: number;
  updatedAt: string | Date;
};
