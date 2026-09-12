import { createHash } from 'node:crypto';
import { Id } from '@ecomerece/domain/value-objects/id.vo';

export type ViewEntityType = 'product' | 'category' | 'page';

/** Structural subset of the node-redis client so tests can inject a fake. */
export interface RedisLike {
  set(key: string, value: string, opts?: { NX?: boolean; EX?: number }): Promise<string | null>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
}

export interface EntityExistsRepo {
  Exists(id: Id): Promise<boolean>;
}

export interface StatsViewGuardDeps {
  redis?: RedisLike | null;
  productRepo?: EntityExistsRepo | null;
  categoryRepo?: EntityExistsRepo | null;
  maxViewsPerHourPerIdentity?: number;
  maxViewsPerHourPerEntity?: number;
  maxViewsPerDayPerEntity?: number;
}

export type ViewDecision = 'track' | 'skip';

const BOT_PATTERN =
  /(bot|crawler|spider|scraper|headless|curl|wget|python|java|php|perl|ruby|node|axios|postman|insomnia|go-http-client|http-client|lighthouse|facebookexternalhit|twitterbot|slurp|bingpreview|yandex|baiduspider|duckduckbot|petalbot|phantomjs|puppeteer|selenium)/i;

const DEFAULT_MAX_VIEWS_PER_HOUR_PER_IDENTITY = 1000;
const DEFAULT_MAX_VIEWS_PER_HOUR_PER_ENTITY = 20_000;
const DEFAULT_MAX_VIEWS_PER_DAY_PER_ENTITY = 200_000;
// 24h dedupe window with a grace period so a repeat visit the next night isn't
// blocked by clock skew across the Redis layer.
const DEDUPE_TTL_SECONDS = 48 * 60 * 60;
const HOUR_TTL_SECONDS = 60 * 60 + 60;
const DAY_TTL_SECONDS = 48 * 60 * 60;

export class StatsViewGuard {
  private readonly redis: RedisLike | null;
  private readonly productRepo: EntityExistsRepo | null;
  private readonly categoryRepo: EntityExistsRepo | null;
  private readonly maxViewsPerHourPerIdentity: number;
  private readonly maxViewsPerHourPerEntity: number;
  private readonly maxViewsPerDayPerEntity: number;

  constructor(deps: StatsViewGuardDeps = {}) {
    this.redis = deps.redis ?? null;
    this.productRepo = deps.productRepo ?? null;
    this.categoryRepo = deps.categoryRepo ?? null;
    this.maxViewsPerHourPerIdentity =
      deps.maxViewsPerHourPerIdentity ?? DEFAULT_MAX_VIEWS_PER_HOUR_PER_IDENTITY;
    this.maxViewsPerHourPerEntity =
      deps.maxViewsPerHourPerEntity ?? DEFAULT_MAX_VIEWS_PER_HOUR_PER_ENTITY;
    this.maxViewsPerDayPerEntity =
      deps.maxViewsPerDayPerEntity ?? DEFAULT_MAX_VIEWS_PER_DAY_PER_ENTITY;
  }

  /** Drops empty UAs and anything that matches crawler/bot/scraper signatures. */
  isBot(ua?: string | null): boolean {
    if (!ua) return true;
    const trimmed = ua.trim();
    if (trimmed.length === 0) return true;
    return BOT_PATTERN.test(trimmed);
  }

  visitorKey(visitorId?: string | null, ip?: string | null, ua?: string | null): string {
    if (visitorId && visitorId.trim().length > 0) {
      return `v:${StatsViewGuard.hash(visitorId.trim())}`;
    }
    return `a:${StatsViewGuard.hash(`${ip ?? 'unknown'}|${ua ?? 'unknown'}`)}`;
  }

  /**
   * Full anti-abuse decision for a single view event. Order matters — cheap
   * checks first, the Redis dedupe claim only passes to a DB existence check,
   * and rate counters never run for bot/duplicate traffic.
   */
  async shouldTrack(input: {
    type: ViewEntityType;
    id: string;
    visitorId?: string | null;
    ip?: string | null;
    ua?: string | null;
    now?: Date;
  }): Promise<ViewDecision> {
    if (this.isBot(input.ua)) return 'skip';

    const now = input.now ?? new Date();
    const date = now.toISOString().split('T')[0];
    const hour = `${date}:${String(now.getUTCHours()).padStart(2, '0')}`;

    if (this.redis) {
      // 1) Claim: at most one view per (entity, visitor, day).
      const key = StatsViewGuard.hash(
        `stats:view:${input.type}:${input.id}:${this.visitorKey(input.visitorId, input.ip, input.ua)}:${date}`,
      );
      const claimed = await this.redis.set(key, '1', { NX: true, EX: DEDUPE_TTL_SECONDS });
      if (claimed !== 'OK') return 'skip';
    }

    // 2) Existence check — only reached by first-time (claimed) views.
    if (!(await this.entityExists(input.type, input.id))) return 'skip';

    // 3) Rate caps. Runs only when Redis is present.
    if (this.redis) {
      const identityHourKey = `stats:rl:${input.type}:identity:${this.visitorKey(input.visitorId, input.ip, input.ua)}:${hour}`;
      const identityCount = await this.redis.incr(identityHourKey);
      if (identityCount === 1) {
        await this.redis.expire(identityHourKey, HOUR_TTL_SECONDS);
      }
      if (identityCount > this.maxViewsPerHourPerIdentity) return 'skip';

      const entityHourKey = `stats:rl:${input.type}:entity:${input.id}:${hour}`;
      const entityHourCount = await this.redis.incr(entityHourKey);
      if (entityHourCount === 1) {
        await this.redis.expire(entityHourKey, HOUR_TTL_SECONDS);
      }
      if (entityHourCount > this.maxViewsPerHourPerEntity) return 'skip';

      const entityDayKey = `stats:rl:${input.type}:entity:${input.id}:${date}`;
      const entityDayCount = await this.redis.incr(entityDayKey);
      if (entityDayCount === 1) {
        await this.redis.expire(entityDayKey, DAY_TTL_SECONDS);
      }
      if (entityDayCount > this.maxViewsPerDayPerEntity) return 'skip';
    }

    return 'track';
  }

  private async entityExists(type: ViewEntityType, id: string): Promise<boolean> {
    if (type === 'page') return true;
    const repo = type === 'product' ? this.productRepo : this.categoryRepo;
    if (!repo) return true; // no repo wired → trust the id
    return repo.Exists(Id.create(id));
  }

  private static hash(value: string): string {
    return createHash('sha256').update(value).digest('hex').slice(0, 32);
  }
}
