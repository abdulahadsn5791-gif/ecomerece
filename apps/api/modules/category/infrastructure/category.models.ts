import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";
import { Schema } from "mongoose";

const deletedSchema = new Schema(
    {
        deleted: { type: Boolean, default: false, required: true },
        deletedFrom: { type: Date, default: null },
        deletedBy: { type: String, default: null },
        reason: { type: String, default: null },
    },
    { _id: false },
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


export const CategorySchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        version: {
            type: Number,
            default: 0,
        },
        block: {
            type: blockSchema,
            required: true,
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

export type AddressPersistence = InferSchemaType<typeof CategorySchema>;
export type AddressDocument = HydratedDocument<AddressPersistence>;
export const AddressModel = mongoose.model<AddressPersistence>('Address', CategorySchema);
