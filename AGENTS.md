# AGENTS.md

## Commands

```bash
bun install              # install all workspace deps
bun run dev              # API (8000) + Web (3000) concurrently via --filter
bun run typecheck        # tsc --noEmit across all workspaces
bun run lint             # biome lint src
bun run lint:fix         # biome check src --write
bun run format           # biome format src --write
bun run check            # biome check src
bun test                 # test suite
bun run test:watch       # test suite in watch mode
# NOTE: `bun run lint:imports` references scripts/check-imports.ts which does not exist.
```

**Validator order:** `lint:fix` -> `typecheck` -> `test`

## Architecture

DDD + CQRS + Hexagonal (Ports & Adapters). Full spec in `PROJECT_DOCUMENTATION.md`.

**Monorepo workspaces (Bun):**

| Workspace | Role |
|---|---|
| `apps/api` | Hono v4 API (Bun runtime), modules follow 4-layer DDD |
| `apps/web` | Next.js 16 storefront + admin |
| `apps/mobile` | React Native placeholder |
| `packages/domain` | Pure TS aggregates, VOs, events, ports (zero runtime deps) |
| `packages/shared` | Zod schemas, DTOs, API envelopes |
| `packages/frontend` | Cross-platform headless SDK (React Query, Zustand, platform adapters) |

**Path aliases** (root `tsconfig.json`):
- `@ecomerece/domain` -> `packages/domain/index.ts`
- `@ecomerece/shared` -> `packages/shared/index.ts`
- `@ecomerece/frontend` -> `packages/frontend/index.ts`

## Adding a New Module

Build bottom-up, exactly this order:

1. `packages/domain/modules/<name>/` - VOs, events, ports (interface), read models, aggregate
2. `apps/api/modules/<name>/infrastructure/` - Mongoose model, mapper (4 methods: `toDocument`, `toUpdatePayload`, `fromDocument`, `fromDocuments`), repository impl
3. `apps/api/modules/<name>/application/` - Queries/commands DTOs, handlers, internal service, app service (orchestrates: load -> command -> save -> events)
4. `apps/api/modules/<name>/presentation/` - messages, controller (extends `BaseController`), routes, `*.module.ts` (DI wiring, bus registration)
5. Register new routes in `apps/api/routes/index.ts`

**Dependency rule:** Domain never imports Infrastructure. Infrastructure never imports Presentation. Cross-module communication uses QueryBus, CommandBus, or EventBus (registered in each module's `*.module.ts`).

## Testing

```bash
bun test                    # all tests
bun test <path>             # single file
bun test --watch            # watch mode
```

## Code Style

- **Formatter:** Biome, spaces (indent 2), line width 100, single quotes
- `noExplicitAny` is OFF (allows `any`)
- Aggregates: private state, public command methods, `this.raise()` for events, `this.getEvents()` / `this.clearEvents()` in app service after save

## Gotchas

- Bun runs TS directly in dev (`bun run --watch`); no transpile step needed
- MongoDB transactions require a replica set (`?replicaSet=rs0` in connection string)
- Rate limiter keys on `cf-connecting-ip` or `x-forwarded-for` header
- Auth middleware checks live DB state (ban/block/delete) after JWT verification
- `lucide-react` pinned to `0.468.0` and `react`/`react-dom` pinned to `19.2.8` via root `overrides`
- Production: `pm2 start ecosystem.config.js` (fork mode, Bun, port 8000)
- Root `lint:imports` script is broken (references missing `scripts/check-imports.ts`)
