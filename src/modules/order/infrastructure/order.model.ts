import mongoose, { Document, type HydratedDocument, InferSchemaType, Schema } from 'mongoose';
import { idType } from '../../../../shared/dtos/id-schema';

const deletedSchema = new mongoose.Schema(
    {
        deleted: { type: Boolean, default: false, required: true },
        deletedFrom: { type: Date, default: null },
        deletedBy: { type: String, default: null },
        reason: { type: String, default: null },
    },
    { _id: false },
);

const itemSchema = new mongoose.Schema(
    {
        variantId: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
    },
    { _id: false },
);

const OrderModelSchema = new Schema(
    {
        _id: { type: String, required: true },

        idempotentKey: { type: String, required: true, unique: true },

        version: {
            type: Number,
            required: true,
            default: 0,
        },
        buyerId: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        waitingTime: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'returned', 'refunded', 'cancelled'],
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        deleted: {
            type: deletedSchema,
            required: true,
        },
        items: {
            type: [itemSchema],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
export interface OrderPersistence {
    _id: string;
    idempotentKey: string;
    version: number;
    buyerId: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'returned' | 'refunded' | 'cancelled';
    address: string;
    deleted: {
        deleted: boolean;
        deletedFrom?: Date | null;
        deletedBy?: string | null;
        reason?: string | null;
    };
    items: Array<{
        variantId: string;
        quantity: number;
        unitPrice: number;
    }>;
    waitingTime: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type OrderDocument = HydratedDocument<OrderPersistence>;
export const OrderModel = mongoose.model<OrderPersistence>('Order', OrderModelSchema);
