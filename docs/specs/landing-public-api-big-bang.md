# Landing Public API Big-Bang

## Context / Problem

- Landing pages are primarily static and do not consume the real public API surface.
- Query and prefetch behavior is inconsistent across landing routes.
- Article and career detail routes are ID-based and need slug-based canonical paths.
- About page needs a true org chart hierarchy, but public org payload currently lacks `managerId`.

## Goals

- Migrate landing pages to real public API calls with TanStack Query + TanStack Router loader prefetching.
- Standardize landing `lib/` modules to `*Api.ts`, `*Schema.ts`, `*Query.ts`.
- Add optimistic UX for landing mutations (`contact` submit, `career` application submit).
- Move article and career details to slug routes.
- Add dynamic tag filters where relevant.
- Keep current landing visual language while replacing static data.

## Non-Goals

- Adding new product landing sections/pages.
- Rebranding or redesigning the landing theme.
- Supporting legacy ID URLs for articles/careers.

## Assumptions

- Existing backend public endpoints remain the source of truth.
- Phone/email/address copy remains static unless backed by existing API fields.
- Query options and route loaders are canonical for prefetch and cache hydration.

## Dependencies

- Server org module update to expose `managerId` in public payload.
- Existing public endpoints in `/api/v1/*/client`.
- Shared query client from `apps/web/src/main.tsx`.

## Phases

### Phase 1: Data Layer Standardization

- [x] Add missing endpoint constants (`ORG_CLIENT`, `SOCIALS_CLIENT`).
- [x] Add missing landing `lib/` modules:
  - [x] `blogs`
  - [x] `vacancies`
  - [x] `contacts`
  - [x] `org`
  - [x] `socials`
- [x] Normalize existing landing `lib/` modules to:
  - [x] endpoint-based keys
  - [x] normalized params
  - [x] query options for prefetch
  - [x] `placeholderData: keepPreviousData` for paginated lists

Phase 1 tests:

- [x] `bun check-types`
- [x] `bun lint`

### Phase 2: Backend Org Public Payload

- [x] Extend public org schema/response to include `managerId`.
- [x] Ensure repository public query selects `managerId`.
- [x] Keep validation and public query constraints intact.

Phase 2 tests:

- [x] `bun check-types`
- [x] `bun lint`

### Phase 3: Gallery Integration (First Internal Slice)

- [x] Replace static gallery section data with `gallery/client` + `gallery-categories/client`.
- [x] Add `/gallery` route search validation + loader prefetch.
- [x] Use URL-driven filters (`categorySlug`, pagination/search/sort).
- [x] Add loading, empty, and error states.
- [x] Prefetch next page after current page success.

Phase 3 tests:

- [x] `bun check-types`
- [x] `bun lint`

### Phase 4: Home/About/Sector API Wiring

- [x] Wire home sections:
  - [x] services
  - [x] case studies
  - [x] testimonials
  - [x] FAQs
  - [x] blogs preview
- [x] Wire about page:
  - [x] partners
  - [x] services/case studies blocks
  - [x] org chart from `org/client`
- [x] Wire sourcing page from business-sector public slug endpoint.
- [x] Remove replaced static data sources/imports.

Phase 4 tests:

- [x] `bun check-types`
- [x] `bun lint`

### Phase 5: Articles + Tags + Slug Migration

- [x] Migrate article detail route to slug path.
- [x] Replace static article list/detail with blogs API list/detail.
- [x] Add tag filter chips backed by tags API.
- [x] Prefetch blog detail on card hover/focus.
- [x] Remove legacy ID article route.

Phase 5 tests:

- [x] `bun check-types`
- [x] `bun lint`

### Phase 6: Career + Contact + Socials

- [x] Migrate career detail route to slug path.
- [x] Replace career list/detail static data with vacancies API.
- [x] Remove static responsibilities/requirements blocks.
- [x] Implement optimistic vacancy application submit.
- [x] Implement optimistic contact submit.
- [x] Load social links from `socials/client` in footer/contact.
- [x] Remove legacy ID career route.

Phase 6 tests:

- [x] `bun check-types`
- [x] `bun lint`

### Phase 7: Router Prefetch + Performance Gates

- [x] Add route loaders and parallel prefetch for landing routes with remote data.
- [x] Keep derived state in render and avoid avoidable effect-driven state.
- [x] Validate bundle/perf scripts.

Phase 7 tests:

- [x] `bun run --filter web build:no-sitemap`
- [x] `bun run --filter web perf:lint`
- [x] `bun run --filter web perf:budget`

## Acceptance Criteria

- Every targeted landing page renders API-backed data with no static fallback leak for migrated sections.
- URL search params drive list filtering/pagination where defined.
- Articles and career detail URLs are slug-based.
- Contact and career application forms submit against real API endpoints with optimistic UX and rollback on error.
- About org chart uses real hierarchy (`managerId`).
