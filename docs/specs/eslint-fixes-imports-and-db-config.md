# ESLint Fixes for Imports and Drizzle Config

## Context / Problem

- Running `eslint . --fix` still reports 14 issues (11 errors, 3 warnings).
- Warnings are import order issues in frontend files.
- Errors come from restricted static devtools import and CommonJS/global usage in `packages/db/drizzle.config.cjs`.

## Goals

- Resolve all currently reported lint issues without weakening lint rules.
- Keep runtime behavior unchanged for web root route and Drizzle config loading.
- Verify with targeted `eslint` run on touched files.

## Non-Goals

- Broader refactors outside listed lint findings.
- Any schema, API, or feature behavior changes.

## Assumptions

- `drizzle-kit` supports TypeScript config files (`drizzle.config.ts`) when explicitly passed via `--config`.
- Dynamic import in `apps/web/src/routes/__root.tsx` satisfies the restricted import rule.

## Dependencies

- Existing ESLint config and import order plugin.
- `dotenv` + Node ESM runtime for DB config loading.

## Phases

### Phase 1: Frontend lint fixes

- Reorder imports in affected frontend files.
- Replace restricted static router-devtools import with dynamic import pattern.

### Phase 2: DB config lint fixes

- Replace `drizzle.config.cjs` with ESM TypeScript config.
- Update `packages/db/package.json` scripts to point to new config path.

### Phase 3: Validation

- Run `eslint` against touched files.
- Confirm zero remaining issues for these files.

## Task List

- [x] Create spec.
- [x] Reorder imports in `apps/web/imports/School.tsx`.
- [x] Reorder imports in `apps/web/src/components/sourcing-logistics-section.tsx`.
- [x] Update `apps/web/src/routes/__root.tsx` to dynamic import router devtools panel.
- [x] Migrate `packages/db/drizzle.config.cjs` to `packages/db/drizzle.config.ts`.
- [x] Update DB scripts to use `drizzle.config.ts`.
- [x] Run lint verification and record result.

## Test Plan by Phase

- Phase 1 tests:
  - `eslint apps/web/imports/School.tsx apps/web/src/components/sourcing-logistics-section.tsx apps/web/src/routes/__root.tsx`
- Phase 2 tests:
  - `eslint packages/db/drizzle.config.ts packages/db/package.json` (or root lint scoped to file path support)
- Phase 3 tests:
  - `eslint` across all touched files in one command.
