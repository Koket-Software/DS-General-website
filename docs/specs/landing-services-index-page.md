# Landing Services Index Page (Editorial Grid)

## Context / Problem

- The public site has a service detail route at `/services/$slug` but no index route at `/services`.
- Navigation and footer links should consistently direct users to a dedicated services listing experience.
- The services listing should match the existing landing design language while feeling more intentional and visually engaging.

## Goals

- Add a public landing route at `/services` that renders all services in a single editorial-style image grid.
- Make each card link to `/services/$slug` with hover/focus prefetch for perceived performance.
- Keep visual consistency with the landing system (boxy layout, DS tokens, typographic scale) while improving composition and motion.
- Ensure navigation consistency by linking Navbar, Footer, and service-detail back navigation to `/services`.
- Include `/services` in sitemap defaults.

## Non-Goals

- No backend API, DB schema, or server module changes.
- No pagination/infinite scroll/search for this scope.
- No redesign of unrelated landing sections.

## Assumptions

- Current public service volume is small (around 6), so rendering all cards in one responsive grid is acceptable.
- Public list API response remains based on `title`, `excerpt`, `slug`, and `featuredImage`.
- Existing route `/services/$slug` remains unchanged and should continue to work.

## Dependencies

- `apps/web/src/lib/services/services-query.ts`
- `apps/web/src/routes/_landing/services.$slug.tsx`
- `apps/web/src/features/landing/components/navbar.tsx`
- `apps/web/src/features/landing/components/footer.tsx`
- `apps/web/src/utils/generate-sitemap.ts`

## Phases

### Phase 1: Route + Page Composition

- [x] Create this spec before code changes.
- [x] Add landing route file for `/_landing/services` with loader prefetch for services list.
- [x] Add route shell behavior so `/services` renders listing and `/services/$slug` continues to render detail.
- [x] Add `ServicesPage` wrapper and dedicated listing section component.

Tests for Phase 1:

- [ ] `/services` resolves and preloads list data.
- [ ] `/services/$slug` still resolves to existing detail page through route shell behavior.

### Phase 2: Editorial Grid UI + Navigation Consistency

- [x] Implement responsive image-first cards with title/excerpt and CTA affordance.
- [x] Implement loading, error, and empty states consistent with landing patterns.
- [x] Prefetch service detail query on card hover/focus.
- [x] Add `Services` link to landing Navbar desktop/mobile lists.
- [x] Add `Services` link to landing Footer company links.
- [x] Change service detail back navigation to point to `/services`.

Tests for Phase 2:

- [ ] Each card routes to `/services/<slug>`.
- [ ] Navbar/footer `Services` links navigate correctly on desktop and mobile.
- [ ] Service detail back link returns to `/services`.
- [ ] Grid layout remains readable across mobile/tablet/desktop breakpoints.

### Phase 3: Routing Artifacts + Validation

- [x] Regenerate/accept TanStack route tree updates.
- [x] Add `/services` entry to sitemap default routes.
- [x] Run static checks.

Tests for Phase 3:

- [x] `bun --filter web check-types`
- [x] `bun lint`

## Task Checklist

- [x] Write spec file.
- [x] Implement route + page.
- [x] Implement editorial grid + nav/footer/back-link updates.
- [x] Update sitemap default routes.
- [x] Regenerate route artifacts.
- [x] Run and pass validation commands.
