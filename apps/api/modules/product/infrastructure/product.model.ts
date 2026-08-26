import mongoose, { type HydratedDocument, type InferSchemaType, Schema } from 'mongoose';

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

        version: {
            type: Number,
            required: true,
            default: 0,
        },
        categoryId: {
            type: String,
            required: true,
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

        disclaimer: {
            required: true,
            type: DisclaimerInfoSchema,
        },

        image: {
            type: ImageInfoSchema,
            required: true,
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
