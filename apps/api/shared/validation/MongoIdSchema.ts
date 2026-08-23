import mongoose from 'mongoose';
import z from 'zod';

export const MongoIdStringSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid DB ObjectId');

export const MongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid DB ObjectId');

export type MongoIdType = z.infer<typeof MongoIdSchema>;
export const toMongoObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export type MongoIdStringType = z.infer<typeof MongoIdStringSchema>;
