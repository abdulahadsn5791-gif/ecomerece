import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Id, ImageSource } from '@ecomerece/domain';
import { config } from 'dotenv';
import { CloudinaryAdapter } from '../modules/image-storage/infrastructure/cloudinary.adapter';
import { loadCloudinaryConfig } from '../modules/image-storage/infrastructure/cloudinary.config';
import { ProductModel } from '../modules/product/infrastructure/product.model';
import { ProductVariantModel } from '../modules/product-variant/infrastructure/product-variant.model';

config({ path: resolve(import.meta.dir, '../.env') });

const ASSETS_DIR = resolve(import.meta.dir, 'seed-assets');
const IMAGE_POOL = [
  '1596462502278-27bfdc403348',
  '1556228720-195a672e8a03',
  '1611930022073-b7a4ba5fcccd',
  '1556228578-0d85b1a4d571',
  '1535585209827-a15fcdbc4c2d',
  '1583209814683-c023dd293cc6',
  '1598440947619-2c35fc9aa908',
  '1571781926291-c477ebfd024b',
  '1608248543803-ba4f8c70ae0b',
  '1620916566398-39f1143ab7be',
  '1576091160550-2173dba999ef',
  '1612817288484-6f916006741a',
  '1586495777744-4413f21062fa',
  '1559599101-f09722fb4948',
  '1580618672591-eb180b1a973f',
  '1596178065887-1198b6148b2b',
  '1585232004423-244e0e6904e3',
  '1616394584738-fc6e612e71b9',
  '1601049541289-9b1b7bbbfe19',
  '1619451334792-150fd785ee74',
  '1576091160399-112ba8d25d1d',
  '1600948836101-f9ffda59d250',
  '1622398925373-3f91b1e275f5',
  '1535378917042-10a22c95931a',
  '1503023345310-bd7c1de61c7d',
];

const HAIRCARE_CATEGORY = '01a0a4ba-6660-714e-a85d-e95b3d442fb2';
const SKINCARE_CATEGORY = '01a0a516-1c89-7123-8db2-4c0a66facf82';

const VENDORS = [
  '01a09f82-cd47-7621-81e2-b40a319d4996',
  '01a09f85-4bdc-767a-83dc-db90e852c94a',
  '01a09f87-ec73-7533-bf05-306d7bd4cda0',
];

const VENDOR_TITLES = ['Tech Hub Plus', 'Sunrise Electronics', 'Green Leaf Grocery'];

interface SeedVariant {
  label: string;
  price: number;
  discountPct: number;
}

interface SeedProduct {
  title: string;
  categoryId: string;
  vendorIdx: number;
  description: string;
  inStock: boolean;
  ingredients: { isIngredients: boolean; items: string[] };
  disclaimers: { name: string; title: string }[];
  variantSeeds: SeedVariant[];
  rating: { average: number; totalCount: number };
  imageCount: number;
}

const products: SeedProduct[] = [
  {
    title: 'Hydra Silk Shampoo',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'A sulfate-free hydrating shampoo that gently cleanses while locking moisture into every strand. Infused with silk proteins and argan oil for soft, bouncy hair.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [{ name: 'For external use only', title: 'Avoid direct contact with eyes.' }],
    variantSeeds: [
      { label: '250ml', price: 16, discountPct: 20 },
      { label: '500ml', price: 26, discountPct: 15 },
      { label: '1000ml', price: 38, discountPct: 10 },
    ],
    rating: { average: 4.6, totalCount: 312 },
    imageCount: 4,
  },
  {
    title: 'Argan Repair Conditioner',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 1,
    description:
      'Rich conditioner with cold-pressed argan oil that repairs split ends, reduces frizz, and restores a silky, healthy shine without weighing hair down.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [
      { label: '250ml', price: 18, discountPct: 20 },
      { label: '500ml', price: 29, discountPct: 15 },
    ],
    rating: { average: 4.4, totalCount: 208 },
    imageCount: 4,
  },
  {
    title: 'Volumizing Root Lift Spray',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Lightweight root-lift spray that gives flat hair an instant boost of volume and fullness. Heat-activated formula lasts all day without stickiness.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [
      { label: '150ml', price: 14, discountPct: 25 },
      { label: '300ml', price: 22, discountPct: 15 },
    ],
    rating: { average: 4.2, totalCount: 96 },
    imageCount: 4,
  },
  {
    title: 'Keratin Smoothing Hair Mask',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'Weekly deep-conditioning mask packed with keratin and shea butter to tame frizz, smooth the cuticle, and leave hair glass-like and manageable.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [{ label: '300g', price: 24, discountPct: 20 }],
    rating: { average: 4.7, totalCount: 451 },
    imageCount: 3,
  },
  {
    title: 'Coconut Nourish Hair Oil',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 1,
    description:
      'A 100% natural coconut oil blend that deeply nourishes the hair shaft, controls frizz, and adds a brilliant shine. Great as a pre-wash treatment or finishing oil.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [
      { label: '60ml', price: 12, discountPct: 20 },
      { label: '120ml', price: 19, discountPct: 10 },
    ],
    rating: { average: 4.5, totalCount: 174 },
    imageCount: 3,
  },
  {
    title: 'Color Protect Shampoo',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Sulfate-free shampoo designed to shield color-treated hair from fading. Antioxidant-rich formula keeps vibrancy and gloss between salon visits.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [
      { label: '250ml', price: 17, discountPct: 20 },
      { label: '500ml', price: 27, discountPct: 15 },
    ],
    rating: { average: 4.3, totalCount: 268 },
    imageCount: 4,
  },
  {
    title: 'Micellar Scalp Cleanser',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'Gentle micellar scalp rinse that removes buildup, oil, and product residue while balancing the scalp microbiome. Refreshing and non-stripping.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [{ label: '200ml', price: 15, discountPct: 20 }],
    rating: { average: 4.1, totalCount: 63 },
    imageCount: 3,
  },
  {
    title: 'Curl Defining Cream',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 1,
    description:
      'Defining cream for wavy and curly hair that shapes curls, reduces frizz, and offers flexible hold. Hydrating and free from sulfates and parabens.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [
      { label: '150ml', price: 19, discountPct: 15 },
      { label: '250ml', price: 28, discountPct: 10 },
    ],
    rating: { average: 4.6, totalCount: 189 },
    imageCount: 4,
  },
  {
    title: 'Heat Shield Protectant Mist',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Thermal protectant spray shielding hair up to 230°C. Lightweight mist prevents heat damage and helps styles hold while adding a soft shine.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [{ label: '150ml', price: 13, discountPct: 25 }],
    rating: { average: 4.0, totalCount: 81 },
    imageCount: 3,
  },
  {
    title: 'Sea Salt Texturizing Spray',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'Beach-wave spray that creates tousled, lived-in texture with a matte finish. Enriched with sea salt and aloe for grip without stiffness.',
    inStock: false,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [
      { label: '150ml', price: 14, discountPct: 20 },
      { label: '250ml', price: 21, discountPct: 15 },
    ],
    rating: { average: 3.9, totalCount: 52 },
    imageCount: 4,
  },
  {
    title: 'Biotin Boost Hair Serum',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 1,
    description:
      'Leave-in serum with biotin and saw palmetto that supports thicker-looking, fuller hair. Apply to damp hair to reduce breakage and boost body.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [{ label: '50ml', price: 22, discountPct: 20 }],
    rating: { average: 4.4, totalCount: 143 },
    imageCount: 3,
  },
  {
    title: 'Anti-Dandruff Zinc Shampoo',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Dermatologist-tested shampoo with zinc pyrithione that fights dandruff and soothes an itchy scalp while keeping hair soft and residue-free.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [
      { label: '250ml', price: 15, discountPct: 20 },
      { label: '500ml', price: 24, discountPct: 15 },
    ],
    rating: { average: 4.5, totalCount: 298 },
    imageCount: 4,
  },
  {
    title: 'Leave-In Detangling Milk',
    categoryId: HAIRCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'Feather-light leave-in milk that detangles knots, prevents breakage, and adds slip for effortless combing. Works on all hair types.',
    inStock: true,
    ingredients: { isIngredients: false, items: [] },
    disclaimers: [],
    variantSeeds: [{ label: '200ml', price: 16, discountPct: 20 }],
    rating: { average: 4.3, totalCount: 117 },
    imageCount: 3,
  },
  {
    title: 'Hyaluronic Glow Serum',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 1,
    description:
      'Lightweight hydrating serum with three molecular weights of hyaluronic acid that plumps skin, smooths fine lines, and locks in lasting moisture.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Hyaluronic Acid', 'Glycerin', 'Niacinamide', 'Panthenol'],
    },
    disclaimers: [{ name: 'Patch test', title: 'Do a patch test before first use.' }],
    variantSeeds: [
      { label: '30ml', price: 28, discountPct: 20 },
      { label: '50ml', price: 42, discountPct: 15 },
    ],
    rating: { average: 4.8, totalCount: 523 },
    imageCount: 4,
  },
  {
    title: 'Vitamin C Brightening Cream',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Daily moisturizer with stabilized vitamin C that brightens dull skin, evens tone, and defends against environmental stressors.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Ascorbic Acid', 'Squalane', 'Vitamin E', 'Hyaluronic Acid'],
    },
    disclaimers: [],
    variantSeeds: [
      { label: '30ml', price: 32, discountPct: 20 },
      { label: '50ml', price: 46, discountPct: 15 },
    ],
    rating: { average: 4.6, totalCount: 342 },
    imageCount: 4,
  },
  {
    title: 'Retinol Renewal Night Serum',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'Overnight retinol serum that accelerates cell turnover, reduces the look of fine lines, and refines texture for a smoother, younger-looking complexion.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Retinol', 'Ceramides', 'Vitamin E', 'Hyaluronic Acid'],
    },
    disclaimers: [{ name: 'Use at night', title: 'Apply before bed and wear SPF during the day.' }],
    variantSeeds: [{ label: '30ml', price: 38, discountPct: 25 }],
    rating: { average: 4.7, totalCount: 289 },
    imageCount: 3,
  },
  {
    title: 'Gentle Foam Cleanser',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 1,
    description:
      'Whipped low-pH foam cleanser that dissolves makeup and impurities without stripping the skin barrier. Calming and suited to sensitive skin.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Coco-Betaine', 'Glycerin', 'Betaine', 'Allantoin'],
    },
    disclaimers: [],
    variantSeeds: [
      { label: '125ml', price: 14, discountPct: 20 },
      { label: '250ml', price: 23, discountPct: 15 },
    ],
    rating: { average: 4.4, totalCount: 431 },
    imageCount: 4,
  },
  {
    title: 'Broad Spectrum SPF50 Sunscreen',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Weightless SPF 50+ fluid that provides broad-spectrum UVA/UVB protection with a non-greasy, invisible finish on all skin tones.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Zinc Oxide', 'Titanium Dioxide', 'Vitamin E', 'Aloe Vera'],
    },
    disclaimers: [],
    variantSeeds: [{ label: '50ml', price: 19, discountPct: 20 }],
    rating: { average: 4.5, totalCount: 367 },
    imageCount: 4,
  },
  {
    title: 'Rose Deep Hydration Toner',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'Alcohol-free toner with damask rose water that refreshes, balances pH, and preps the skin for serums while soothing redness.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Rose Water', 'Glycerin', 'Allantoin', 'Panthenol'],
    },
    disclaimers: [],
    variantSeeds: [
      { label: '200ml', price: 12, discountPct: 20 },
      { label: '400ml', price: 20, discountPct: 15 },
    ],
    rating: { average: 4.2, totalCount: 156 },
    imageCount: 4,
  },
  {
    title: 'Niacinamide Pore Control',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 1,
    description:
      '10% niacinamide concentrate that visibly minimizes pores, controls excess sebum, and improves the look of uneven skin tone.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Niacinamide', 'Zinc PCA', 'Hyaluronic Acid'],
    },
    disclaimers: [],
    variantSeeds: [{ label: '30ml', price: 25, discountPct: 20 }],
    rating: { average: 4.6, totalCount: 415 },
    imageCount: 3,
  },
  {
    title: 'Collagen Firming Eye Cream',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Creamy eye treatment with collagen and caffeine that firms the eye area, reduces puffiness, and softens the look of dark circles.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Collagen', 'Caffeine', 'Peptides', 'Shea Butter'],
    },
    disclaimers: [],
    variantSeeds: [{ label: '15ml', price: 21, discountPct: 25 }],
    rating: { average: 4.3, totalCount: 122 },
    imageCount: 3,
  },
  {
    title: 'Charcoal Detox Clay Mask',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'Deep-clearing 5-minute mask with activated charcoal and kaolin clay that draws out impurities, unclogs pores, and leaves skin matte.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Kaolin', 'Activated Charcoal', 'Bentonite', 'Glycerin'],
    },
    disclaimers: [],
    variantSeeds: [
      { label: '50ml', price: 18, discountPct: 20 },
      { label: '100ml', price: 29, discountPct: 15 },
    ],
    rating: { average: 4.1, totalCount: 204 },
    imageCount: 4,
  },
  {
    title: 'Aloe Vera Soothing Moisturizer',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 1,
    description:
      'Gel moisturizer with 92% aloe vera that instantly soothes, cools, and hydrates sensitive or sun-exposed skin without clogging pores.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Aloe Vera', 'Water', 'Glycerin', 'Sodium Hyaluronate'],
    },
    disclaimers: [],
    variantSeeds: [
      { label: '150ml', price: 13, discountPct: 20 },
      { label: '300ml', price: 21, discountPct: 15 },
    ],
    rating: { average: 4.5, totalCount: 384 },
    imageCount: 4,
  },
  {
    title: 'Glycolic Acid Smoothing Peel',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Weekly 10% glycolic acid peel pads that slough dead skin, smooth rough texture, and reveal a brighter, more radiant complexion.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Glycolic Acid', 'Aloe Vera', 'Green Tea Extract'],
    },
    disclaimers: [{ name: 'Weekly use', title: 'Use once a week and avoid the eye area.' }],
    variantSeeds: [{ label: '30 pads', price: 23, discountPct: 20 }],
    rating: { average: 4.2, totalCount: 167 },
    imageCount: 3,
  },
  {
    title: 'Lip Repair Balm',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 0,
    description:
      'Nourishing overnight balm with shea butter, jojoba oil, and vitamin E that repairs dry, cracked lips and restores a smooth pout.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Shea Butter', 'Jojoba Oil', 'Beeswax', 'Vitamin E'],
    },
    disclaimers: [],
    variantSeeds: [
      { label: '10ml', price: 6, discountPct: 20 },
      { label: '20ml', price: 10, discountPct: 15 },
    ],
    rating: { average: 4.7, totalCount: 268 },
    imageCount: 4,
  },
  {
    title: 'Cucumber Cooling Face Mist',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 1,
    description:
      'Refreshing face mist with cucumber and green tea that cools, hydrates, and helps set makeup. Perfect for on-the-go skincare refresh.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Cucumber Extract', 'Green Tea', 'Water', 'Glycerin'],
    },
    disclaimers: [],
    variantSeeds: [{ label: '100ml', price: 9, discountPct: 20 }],
    rating: { average: 4.0, totalCount: 88 },
    imageCount: 3,
  },
  {
    title: 'Tea Tree Balancing Cleanser',
    categoryId: SKINCARE_CATEGORY,
    vendorIdx: 2,
    description:
      'Purifying cleanser with tea tree oil and salicylic acid that helps clear blemishes and control shine while keeping skin calm.',
    inStock: true,
    ingredients: {
      isIngredients: true,
      items: ['Water', 'Tea Tree Oil', 'Salicylic Acid', 'Glycerin', 'Witch Hazel'],
    },
    disclaimers: [],
    variantSeeds: [
      { label: '150ml', price: 15, discountPct: 20 },
      { label: '250ml', price: 24, discountPct: 15 },
    ],
    rating: { average: 4.1, totalCount: 133 },
    imageCount: 4,
  },
];

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function runPool(tasks: (() => Promise<void>)[], concurrency: number): Promise<void> {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
    while (cursor < tasks.length) {
      const task = tasks[cursor];
      cursor += 1;
      await task();
    }
  });
  await Promise.all(workers);
}

async function downloadImage(photoId: string, filePath: string): Promise<void> {
  const url = `https://images.unsplash.com/photo-${photoId}?w=1000&h=1000&fit=crop&q=80`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${photoId} failed (HTTP ${res.status})`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  await mkdir(resolve(filePath, '..'), { recursive: true });
  await writeFile(filePath, bytes);
}

async function ensureDownloaded(photoId: string, filePath: string): Promise<void> {
  try {
    await readFile(filePath);
  } catch {
    await downloadImage(photoId, filePath);
  }
}

function buildStoredFiles() {
  const files: { path: string; photoId: string }[] = [];
  products.forEach((product, index) => {
    const slug = slugify(product.title);
    for (let n = 1; n <= product.imageCount; n += 1) {
      const poolIndex = (index * product.imageCount + (n - 1)) % IMAGE_POOL.length;
      files.push({
        path: resolve(ASSETS_DIR, slug, `img-${n}.jpg`),
        photoId: IMAGE_POOL[poolIndex],
      });
    }
  });
  return files;
}

async function main(): Promise<void> {
  await mkdir(ASSETS_DIR, { recursive: true });

  const mongo = await import('../lib/mongo');
  await mongo.connectDB();
  console.log('[seed] connected to MongoDB');

  const adapter = new CloudinaryAdapter(loadCloudinaryConfig());

  const storedFiles = buildStoredFiles();
  console.log(`[seed] downloading ${storedFiles.length} source images to ${ASSETS_DIR}`);
  await runPool(
    storedFiles.map((file, index) => async () => {
      try {
        await ensureDownloaded(file.photoId, file.path);
      } catch (error) {
        console.warn(
          `[seed] image ${index + 1}/${storedFiles.length} failed (${file.photoId}):`,
          error instanceof Error ? error.message : error,
        );
      }
    }),
    6,
  );

  const stats = {
    created: 0,
    skipped: 0,
    imagesUploaded: 0,
    imagesFailed: 0,
    variants: 0,
    errors: 0,
  };
  const startedAt = Date.now();

  for (let i = 0; i < products.length; i += 1) {
    const seed = products[i];
    const title = seed.title;
    const exists = await ProductModel.exists({
      title: { $regex: `^${escapeRegExp(title)}$`, $options: 'i' },
    });
    if (exists) {
      console.log(`[seed] SKIP ${title} (already exists)`);
      stats.skipped += 1;
      continue;
    }

    try {
      const slug = slugify(title);
      const images: { url: string; alt: string; default: boolean; imageKey: string }[] = [];
      for (let n = 1; n <= seed.imageCount; n += 1) {
        const filePath = resolve(ASSETS_DIR, slug, `img-${n}.jpg`);
        try {
          const bytes = await readFile(filePath);
          const stored = await adapter.upload(ImageSource.fromBytes(bytes, 'image/jpeg'), {
            folder: ['products', slug],
            fileName: `img-${n}.jpg`,
            overwrite: true,
            access: 'public',
          });
          images.push({
            url: stored.publicUrl,
            alt: title,
            default: n === 1,
            imageKey: stored.key.value,
          });
          stats.imagesUploaded += 1;
        } catch (error) {
          console.warn(
            `[seed] image ${n} for "${title}" skipped:`,
            error instanceof Error ? error.message : error,
          );
          stats.imagesFailed += 1;
        }
      }

      if (images.length === 0) {
        console.warn(`[seed] "${title}" has no images — skipping product`);
        stats.errors += 1;
        continue;
      }

      const variantDocuments = seed.variantSeeds.map((variant) => {
        const discountedPrice = roundMoney(variant.price * (1 - variant.discountPct / 100));
        return {
          _id: Id.create().value,
          productId: 'PENDING',
          discountedPrice,
          price: variant.price,
          title: `${title} — ${variant.label}`,
          deleted: { deleted: false, deletedFrom: null, deletedBy: null, reason: null },
          version: 1,
          active: true,
        };
      });

      const prices = variantDocuments.map((v) => v.price);
      const discountedPrices = variantDocuments.map((v) => v.discountedPrice);
      const aggregateDiscounted =
        Math.round(
          (discountedPrices.reduce((sum, value) => sum + value, 0) / discountedPrices.length) * 100,
        ) / 100;
      const quantity = 80 + i * 17;

      const productId = Id.create().value;
      variantDocuments.forEach((v) => {
        v.productId = productId;
      });

      const productDoc = {
        _id: productId,
        inStock: seed.inStock,
        version: 1,
        categoryId: seed.categoryId,
        vendorTitle: VENDOR_TITLES[seed.vendorIdx],
        title,
        appearance: 'public',
        block: { blocked: false, blockedFrom: null, blockedBy: null, reason: null },
        deleted: { deleted: false, deletedFrom: null, deletedBy: null, reason: null },
        description: seed.description,
        vendorId: VENDORS[seed.vendorIdx],
        ingredient: {
          isIngredients: seed.ingredients.isIngredients,
          ingredients: seed.ingredients.items,
        },
        rating: { average: seed.rating.average, totalCount: seed.rating.totalCount },
        disclaimer: {
          isDisclaimer: seed.disclaimers.length > 0,
          disclaimers: seed.disclaimers,
        },
        price: {
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          minDiscountedPrice: Math.min(...discountedPrices),
          maxDiscountedPrice: Math.max(...discountedPrices),
        },
        image: { images },
        stats: {
          views: 1200 + i * 231,
          clicks: 300 + i * 42,
          purchases: quantity,
          revenue: roundMoney(quantity * aggregateDiscounted),
          quantity,
          addToCart: 150 + i * 19,
          wishlist: 40 + i * 8,
          refunds: 2 + (i % 7),
          refundAmount: roundMoney((2 + (i % 7)) * 9),
        },
        createdAt: new Date(Date.now() - (27 - i) * 86_400_000),
        updatedAt: new Date(),
      };

      const [createdProduct] = await ProductModel.create([productDoc]);
      await ProductVariantModel.insertMany(
        variantDocuments.map((v) => ({
          ...v,
          productId: createdProduct._id.toString(),
        })),
      );
      stats.created += 1;
      stats.variants += variantDocuments.length;
      console.log(
        `[seed] CREATED ${title} (${images.length} images, ${variantDocuments.length} variants)`,
      );
    } catch (error) {
      console.error(`[seed] FAILED ${title}:`, error instanceof Error ? error.message : error);
      stats.errors += 1;
    }
  }

  console.log('---------------------------------------------');
  console.log('[seed] done');
  console.log(`  created:         ${stats.created}`);
  console.log(`  skipped:         ${stats.skipped}`);
  console.log(`  variants:        ${stats.variants}`);
  console.log(`  images uploaded: ${stats.imagesUploaded}`);
  console.log(`  images failed:   ${stats.imagesFailed}`);
  console.log(`  errors:          ${stats.errors}`);
  console.log(`  elapsed:         ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
  console.log('---------------------------------------------');

  await mongo.disconnectDB();
}

await main();
