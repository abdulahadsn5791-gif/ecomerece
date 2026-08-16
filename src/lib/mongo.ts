import mongoose from 'mongoose';

mongoose.set('strict', 'throw');
const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing');
}

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cache = global.mongooseCache || {
    conn: null,
    promise: null,
};

global.mongooseCache = cache;

export async function connectDB() {
    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        cache.promise = mongoose.connect(MONGO_URI);
    }

    cache.conn = await cache.promise;

    return cache.conn;
}
