import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";


const deletedSchema = new mongoose.Schema(
    {
        deleted: { type: Boolean, default: false, required: true },
        deletedFrom: { type: Date, default: null },
        deletedBy: { type: String, default: null },
        reason: { type: String, default: null },
    },
    { _id: false },
);


const OrderItemsModelSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },

        quantity: {
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

        totalPrice: {
            type: Number,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        orderId: {
            type: String,
            required: true,
        },

        vendorId: {
            type: String,
            required: true,
        },

        variantId: {
            type: String,
            required: true,
        },


        version: {
            type: Number,
            required: true,
            default: 0,
        },

        deleted: {
            type: deletedSchema,
            required: true,
        },

    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export type OrderItemsPersistence = InferSchemaType<typeof OrderItemsModelSchema>;

export type OrderItemsDocument = HydratedDocument<OrderItemsPersistence>;

export const OrderItemsModel = mongoose.model<OrderItemsPersistence>('Order-Items', OrderItemsModelSchema);





