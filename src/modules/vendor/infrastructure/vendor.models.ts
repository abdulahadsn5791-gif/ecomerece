import mongoose, { type HydratedDocument, type InferSchemaType, Schema } from 'mongoose';

const deletedSchema = new Schema(
    {
        deleted: { type: Boolean, default: false, required: true },
        deletedFrom: { type: Date, default: null },
        deletedBy: { type: String, default: null },
        reason: { type: String, default: null },
    },
    { _id: false },
);

const imagesSchema = new Schema(
    {
        logo: { type: String, required: true },
        banner: { type: String, required: true },
    },
    { _id: false },
);

const addressSchema = new Schema({
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
});

const contactSchema = new Schema(
    {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: addressSchema, required: true },
    },
    { _id: false },
);

const verificationSchema = new Schema(
    {
        isVerified: { type: Boolean, default: false },
        verifiedAt: Date,
        rejectedReason: String,
    },
    { _id: false },
);

export const VendorSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        ownerId: {
            type: String,
            ref: 'User',
            required: true,
            index: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
            unique: true,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },

        description: {
            type: String,
            required: true,
        },

        images: {
            type: imagesSchema,
            required: true,
        },

        contact: {
            type: contactSchema,
            required: true,
        },


        verification: {
            type: verificationSchema,
            required: true,
        },

        version: {
            type: Number,
            default: 0,
        },

        deleted: {
            type: deletedSchema,
            required: true,
        },
    },

    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },

        versionKey: false,
    },
);

export type VendorPersistence = InferSchemaType<typeof VendorSchema>;
export type VendorPersistenceWithId = VendorPersistence & {
    _id: string;
};
export type VendorDocument = HydratedDocument<VendorPersistence>;

export const VendorModel = mongoose.model<VendorPersistence>('Vendor', VendorSchema);
