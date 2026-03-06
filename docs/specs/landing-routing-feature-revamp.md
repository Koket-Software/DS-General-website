# Landing Routing Feature Revamp

## Context / Problem

- Landing files were copied from another project and currently coexist with legacy demo feature modules, creating mixed routing patterns and folder structure drift.
- The app must keep dashboard/admin routes stable while restoring maintainable, feature-based organization for landing pages.
- Root layout currently wraps too broadly; landing shell concerns should be isolated from dashboard/auth/system routes.

## Goals

- Keep existing public landing URLs unchanged.
- Keep dashboard routes and auth/system routes functional.
- Introduce a strict landing feature area under `apps/web/src/features/landing`.
- Group landing routes under a pathless parent route for clean topology.
- Remove legacy non-dashboard/demo feature modules that conflict with the copied landing implementation.
- Update sitemap generation defaults to match active landing routes.

## Non-Goals

- Changing dashboard feature behavior or route paths.
- Redesigning UI visuals beyond required structural refactors.
- Broad backend or schema changes.

## Assumptions

- TanStack file-based routing with `_landing` pathless parent preserves public URLs while changing internal route IDs.
- Existing copied landing assets in `apps/web/assets` and `apps/web/imports` remain required and should be kept.
- Existing dirty worktree changes are intentional and must not be reverted.

## Dependencies

- TanStack Router file-based route generation via Vite plugin.
- Existing dashboard feature modules under `apps/web/src/features/dashboard`.
- Sitemap scripts in `apps/web/scripts` and utility in `apps/web/src/utils/generate-sitemap.ts`.

## Phases

### Phase 0: Spec

- Create and maintain this spec before implementation changes.

### Phase 1: Route Topology + Layout Split

- Add `apps/web/src/routes/_landing.tsx` as pathless landing shell route.
- Move landing route files into `apps/web/src/routes/_landing/**`.
- Keep auth/system routes (`/login`, `/register`, `/forbidden`, `/rate-limit`) at root route level.
- Keep `/dashboard/**` route behavior unchanged.
- Remove legacy `_site` route artifact.

### Phase 2: Feature-Based Landing Structure

- Create `apps/web/src/features/landing` with page-level entries and section/data/legal/layout modules.
- Move copied landing components from `apps/web/src/components` into the landing feature area.
- Move landing data files into landing feature data modules.
- Convert landing route files to thin wrappers importing feature page entries.

### Phase 3: Legacy Cleanup

- Remove legacy non-dashboard feature modules:
  - `features/App.tsx`
  - `features/blog`
  - `features/booking`
  - `features/careers`
  - `features/components`
  - `features/contact`
  - `features/gallery`
  - `features/home`
  - `features/layout`
  - `features/navigation`
  - `features/sectors`
  - `features/services`
  - `features/work-samples`
- Remove stale route/helper leftovers no longer referenced.

### Phase 4: Sitemap Alignment

- Update sitemap defaults to current active landing URLs.
- Remove assumptions about removed public sections from dynamic sitemap script.
- Regenerate `apps/web/public/sitemap.xml`.

### Phase 5: Validation

- Run:
  - `bun run --filter web check-types`
  - `bun run --filter web generate-sitemap`
  - `bun run --filter web build:no-sitemap`
  - `bun check-types`
  - `bun lint`
- Confirm no imports remain from removed legacy feature paths.
- Confirm no route references remain to `_site`.

## Task Checklist

- [x] Phase 0 spec created.
- [x] Add `_landing` pathless route and move landing route files under it.
- [x] Split root shell so landing layout is not global.
- [x] Move landing components/data into `features/landing`.
- [x] Convert landing routes to thin feature-page wrappers.
- [x] Remove legacy non-dashboard feature modules.
- [x] Update sitemap utility and dynamic script behavior.
- [x] Regenerate sitemap.
- [x] Run all validation gates and capture outcomes.

## Test Plan by Phase

### Phase 1 tests

- Route generation/type safety includes `_landing` route IDs but preserves public URL paths.
- `/dashboard/**` remains sibling to landing route group and not wrapped by landing shell.

### Phase 2 tests

- Landing routes render expected pages using feature imports only.
- Route wrappers do not import old `src/components` landing modules.

### Phase 3 tests

- No unresolved imports from removed legacy features.
- Dashboard route modules compile unchanged.

### Phase 4 tests

- Generated sitemap includes only active URLs.
- No stale defaults like `/about-us`, `/services`, `/products`, `/projects`, `/blogs` unless active routes exist.

### Phase 5 tests

- All required commands pass.
