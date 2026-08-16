import type { Context, Next } from 'hono';
import { TooManyRequestError } from '../errors/app-error';
import { redis } from '../lib/redis';

interface Bucket {
    tokens: number;
    lastRefill: number;
}

const CAPACITY = 10;
const REFILL_RATE = 1;

async function consumeToken(ip: string): Promise<boolean> {
    const key = `bucket:${ip}`;

    const bucketData = await redis.get(key);

    let bucket: Bucket;

    if (!bucketData) {
        bucket = {
            tokens: CAPACITY,
            lastRefill: Date.now(),
        };
    } else {
        bucket = JSON.parse(bucketData as string);
    }

    const now = Date.now();

    const elapsedSeconds = (now - bucket.lastRefill) / 1000;

    bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsedSeconds * REFILL_RATE);

    bucket.lastRefill = now;

    if (bucket.tokens < 1) {
        await redis.set(key, JSON.stringify(bucket), {
            EX: 3600,
        });

        return false;
    }

    bucket.tokens -= 1;

    await redis.set(key, JSON.stringify(bucket), {
        EX: 3600,
    });

    return true;
}

export async function rateLimiter(c: Context, next: Next) {
    const ip =
        c.req.header('cf-connecting-ip') ||
        c.req.header('x-forwarded-for')?.split(',')[0] ||
        'unknown';

    const allowed = await consumeToken(ip);

    if (!allowed) {
        throw new TooManyRequestError('Too Many Requests');
    }

    await next();
}
