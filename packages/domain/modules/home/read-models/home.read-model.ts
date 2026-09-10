export type HomeReadModel = {
    id: string;
    categories: Array<{ name: string; image: string; accent: string }>;
    features: Array<{ title: string; detail: string; icon: string; accent: string }>;
    slides: Array<{ tag: string; title: string; subhead: string; subtitle: string; cta: string; image: string; accent: string }>;
    promos: Array<{ title: string; subtitle: string; image: string; accent: string }>;
    productContainers: Array<{ id: string; heading: string; subTitle: string; displayOrder: number }>;
    version: number;
    updatedAt: Date;
};