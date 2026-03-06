# Root Env Centralization

## Context / Problem

Environment variables are partially centralized already, but project guidance still references `apps/server/.env`, and some tooling (notably web env loading) still allows app-local overrides. This creates drift between runtime, build, and documentation.

## Goals

- Centralize env sourcing to repo root files only.
- Support production-specific values through a dedicated root `.env.prod` flow.
- Update contributor rules so future changes keep env handling centralized.

## Non-Goals

- Rotating or regenerating existing secrets.
- Introducing a new configuration package or runtime secret manager.
- Changing deployment infrastructure beyond env-file selection.

## Assumptions

- Development defaults continue to live in root `.env`.
- Production deployments can provide `NODE_ENV=production` and/or use `--env-file .env.prod`.
- Root `.env.prod` remains untracked by git; templates/examples may be tracked.

## Dependencies

- `dotenv` for server/auth/db runtime and scripts.
- Vite `loadEnv` behavior for frontend build-time env.
- Docker Compose `--env-file` behavior for production stack.

## Phases

### Phase 1: Standardize Env Resolution in Code

- [x] Ensure server/auth/db load root `.env`, with `.env.prod` overrides for production.
- [x] Remove `apps/web` local env overrides so web reads from root env only.
- [x] Ensure production mode in web loads `.env.prod` values.
- Tests for this phase:
- [x] `bun check-types`

### Phase 2: Production Env File and Docs

- [x] Add production env template at root.
- [x] Update docs to explain `.env` (dev) and `.env.prod` (production) usage.
- [x] Update production compose guidance to use root `.env.prod`.
- Tests for this phase:
- [x] `bun lint`

### Phase 3: Agent Rule Update

- [x] Update `AGENTS.md` to enforce root-only env files and `.env.prod` for production.
- Tests for this phase:
- [x] Confirm rule text is present and unambiguous.

## Task Checklist

- [x] Create/update env loading logic in affected packages/apps.
- [x] Add root production env template.
- [x] Update docs (`README`, `apps/server/README`, compose references).
- [x] Update `AGENTS.md` with centralized env rule.
- [x] Run validation commands and mark completed tasks.
