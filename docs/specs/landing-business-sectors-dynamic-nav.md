# Landing Business Sectors Dynamic Nav

## Context / Problem

- Landing business-sector navigation is currently hardcoded to a single item (`sourcing-logistics`).
- Sector detail routing is hardcoded to one static route file instead of slug-driven dynamic routing.
- The sector detail UI needs tighter alignment to provided Figma desktop/mobile composition.
- Footer still includes a static business-sectors column that should be removed.
- Prefetch behavior can be improved so sector navigation feels immediate.

## Goals

- Use the business-sectors public API as source of truth for landing sector navigation.
- Support dynamic landing sector detail routes at `/sectors/$slug`.
- Keep the current sector detail information architecture, but tune responsive UI to match provided Figma references.
- Remove footer business-sector links section.
- Improve perceived performance with route-level and interaction-level prefetch plus image loading optimizations.

## Non-Goals

- Backend schema or endpoint changes.
- Adding a new business-sector section to the homepage.
- Reworking unrelated landing pages.

## Assumptions

- `GET /api/v1/business-sectors/client` returns published sectors appropriate for public navigation.
- Sorting by `publishDate desc` is the desired nav order.
- If sector-list fetch fails, the navbar should degrade gracefully without broken interaction.

## Dependencies

- `apps/web/src/lib/business-sectors/*`
- `apps/web/src/routes/_landing*`
- `apps/web/src/features/landing/components/navbar.tsx`
- `apps/web/src/features/landing/components/sourcing-logistics-section.tsx` (to be generalized)
- `apps/web/src/features/landing/components/footer.tsx`

## Phases

### Phase 1: Routing and Shared Prefetch

- [x] Add dynamic landing route for sectors (`/_landing/sectors.$slug.tsx` => `/sectors/$slug`).
- [x] Remove static-only route (`/_landing/sectors.sourcing-logistics.tsx`).
- [x] Add landing-shell loader prefetch for business-sector list so navbar data is warm.

Phase 1 tests:

- [x] `bun run --filter web check-types`

### Phase 2: Dynamic Navbar

- [x] Replace hardcoded sector dropdown with API-backed list query.
- [x] Preserve desktop/mobile dropdown behavior and active-state handling.
- [x] Add hover/focus prefetch for sector detail pages.
- [x] Keep graceful fallback when sector list is unavailable.

Phase 2 tests:

- [x] `bun run --filter web check-types`
- [x] `bun lint`

### Phase 3: Sector Detail UI + Performance

- [x] Refactor sector page component to be slug-driven instead of hardcoded slug.
- [x] Keep same content blocks and improve responsive behavior per provided Figma.
- [x] Use optimized shared image component with proper priority and `sizes` attributes.
- [x] Maintain robust loading and error states.

Phase 3 tests:

- [x] `bun run --filter web check-types`
- [x] `bun lint`
- [x] `bun run --filter web build:no-sitemap`

### Phase 4: Footer + Guidelines Pass

- [x] Remove footer business-sectors section and rebalance layout.
- [x] Fetch latest Web Interface Guidelines and audit touched landing files.

Phase 4 tests:

- [ ] Manual desktop/mobile verification
- [x] Record guideline findings/fixes

## Task Checklist

- [x] Create dynamic sector route and loader prefetch updates.
- [x] Make navbar sectors dynamic from API and add detail prefetch on intent.
- [x] Generalize sector detail page to dynamic slug with responsive alignment updates.
- [x] Remove footer business-sector links section.
- [x] Run validation commands and report results.
- [x] Run web-guidelines pass on touched UI files.
