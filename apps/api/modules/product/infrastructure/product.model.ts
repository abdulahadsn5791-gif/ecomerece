import { METRIC_FIELDS } from '@ecomerece/shared';
import mongoose, { type HydratedDocument, type InferSchemaType, Schema } from 'mongoose';

const statsSchema = new Schema(
  METRIC_FIELDS.reduce<Record<string, unknown>>((acc, field) => {
    acc[field] = { type: Number, default: 0 };
    return acc;
  }, {}),
  { _id: false, minimize: false },
);

const RatingSummarySchema = new Schema(
  {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const productPriceSchema = new Schema(
  {
    minPrice: {
      type: Number,
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    minDiscountedPrice: {
      type: Number,
      required: true,
    },
    maxDiscountedPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const ProductImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      required: true,
      trim: true,
    },

    default: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const DisclaimerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const IngredientSchema = new Schema(
  {
    isIngredients: {
      type: Boolean,
      default: false,
    },

    ingredients: {
      type: [String],
    },
  },
  {
    _id: false,
  },
);

const blockSchema = new mongoose.Schema(
  {
    blocked: { type: Boolean, default: false, required: true },
    blockedFrom: { type: Date, default: null },
    blockedBy: { type: String, default: null },
    reason: { type: String, default: null },
  },
  { _id: false },
);

const deletedSchema = new mongoose.Schema(
  {
    deleted: { type: Boolean, default: false, required: true },
    deletedFrom: { type: Date, default: null },
    deletedBy: { type: String, default: null },
    reason: { type: String, default: null },
  },
  { _id: false },
);

const DisclaimerInfoSchema = new Schema(
  {
    isDisclaimer: {
      type: Boolean,
      default: false,
    },

    disclaimers: {
      type: [DisclaimerSchema],
    },
  },
  {
    _id: false,
  },
);

const ImageInfoSchema = new Schema(
  {
    images: {
      type: [ProductImageSchema],
    },
  },
  {
    _id: false,
  },
);

const ProductModelSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: false,
      index: true,
    },
    version: {
      type: Number,
      required: true,
      default: 0,
    },
    categoryId: {
      type: String,
      required: true,
    },

    vendorTitle: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    appearance: {
      type: String,
      enum: ['public', 'private'],
      required: true,
    },
    block: {
      type: blockSchema,
      required: true,
    },

    deleted: {
      type: deletedSchema,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    vendorId: {
      type: String,
      required: true,
      ref: 'Vendor',
    },
    ingredient: {
      required: true,
      type: IngredientSchema,
    },
    rating: {
      type: RatingSummarySchema,
      required: true,
      default: { average: 0, totalCount: 0 },
    },
    disclaimer: {
      required: true,
      type: DisclaimerInfoSchema,
    },
    price: {
      type: productPriceSchema,
    },
    image: {
      type: ImageInfoSchema,
      required: true,
    },
    stats: {
      type: statsSchema,
      default: () => ({
        views: 0,
        clicks: 0,
        purchases: 0,
        revenue: 0,
        quantity: 0,
        addToCart: 0,
        wishlist: 0,
        refunds: 0,
        refundAmount: 0,
      }),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export type ProductPersistence = InferSchemaType<typeof ProductModelSchema>;

export type ProductDocument = HydratedDocument<ProductPersistence>;

export const ProductModel = mongoose.model<ProductPersistence>('Product', ProductModelSchema);

// Read-path indexes for denormalized metric sorting (dashboards / top-products).
for (const metric of ['quantity', 'views', 'purchases', 'revenue']) {
  ProductModelSchema.index({ [`stats.${metric}`]: -1 }, { name: `by_stats_${metric}` });
}
