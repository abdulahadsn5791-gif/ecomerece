import type { Context, MiddlewareHandler, Next } from 'hono';
import { TooManyRequestError } from '../errors/app-error';
import { redis } from '../lib/redis';

export interface RateLimiterOptions {
  windowMs?: number;
  max?: number;
  keyPrefix?: string;
  keyGenerator?: (c: Context) => string;
}

/** Structural subset of the node-redis client so tests can inject a fake. */
export interface RedisLike {
  eval(script: string, options: { keys: string[]; arguments: string[] }): Promise<unknown>;
}

interface RateLimiterDeps {
  redis?: RedisLike;
  now?: () => number;
}

const DEFAULT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const DEFAULT_MAX = Number(process.env.RATE_LIMIT_MAX || 60);

/**
 * Sliding window counter algorithm. Fixed sub-windows (one per windowMs slice)
 * are summed with a fractional weight for the current sub-window so requests
 * are spread smoothly across the window boundary instead of bursting at the
 * start of every fixed window. The whole check + increment runs atomically on
 * the Redis side via Lua.
 */
const SLIDING_WINDOW_SCRIPT = `
local key = KEYS[1]
local max = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local window = math.floor(now / windowMs)
local currentKey = key .. ':' .. window
local previousKey = key .. ':' .. (window - 1)

local current = tonumber(redis.call('GET', currentKey) or '0')
local previous = tonumber(redis.call('GET', previousKey) or '0')
local weight = (now - window * windowMs) / windowMs
local estimate = previous * (1 - weight) + current

if estimate >= max then
  return 0
end

redis.call('INCR', currentKey)
redis.call('PEXPIRE', currentKey, windowMs * 2)
return 1
`;

async function slidingWindowAllowed(
  client: RedisLike,
  key: string,
  max: number,
  windowMs: number,
  nowMs: number,
): Promise<boolean> {
  const allowed = await client.eval(SLIDING_WINDOW_SCRIPT, {
    keys: [key],
    arguments: [String(max), String(windowMs), String(nowMs)],
  });
  return Number(allowed) === 1;
}

function ipFromContext(c: Context): string {
  return (
    c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for')?.split(',')[0] || 'unknown'
  );
}

export function createRateLimiter(
  options: RateLimiterOptions = {},
  deps: RateLimiterDeps = {},
): MiddlewareHandler {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const max = options.max ?? DEFAULT_MAX;
  const keyPrefix = options.keyPrefix ?? 'rl';
  const keyGenerator = options.keyGenerator ?? ipFromContext;
  const client = deps.redis ?? redis;
  const now = deps.now ?? Date.now;

  return async function slidingWindowRateLimiter(c: Context, next: Next) {
    const key = `${keyPrefix}:${keyGenerator(c)}`;
    const allowed = await slidingWindowAllowed(client, key, max, windowMs, now());
    if (!allowed) {
      throw new TooManyRequestError('Too many requests. Please wait a moment and try again.');
    }
    await next();
  };
}

export const rateLimiter = createRateLimiter();
