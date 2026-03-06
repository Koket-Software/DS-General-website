# Dynamic Open Graph Brand System

## Context / Problem

The website already has a server-side OG image generator using `@vercel/og`, plus an SSR crawler shell that injects meta tags. The current setup has three problems:

1. Public-page coverage is incomplete and partially out of sync with the real TanStack route tree.
2. Static pages mostly use generic query-string page images rather than page-aware branded compositions.
3. The homepage falls back to the generic default OG image instead of a flagship share card.

## Goals

- Make every current public landing page resolve to a branded dynamic OG image.
- Give the homepage a premium, unmistakably on-brand OG composition.
- Keep dynamic detail pages for articles, careers, sectors, services, and projects aligned with the same visual system.
- Preserve the existing crawler SSR pipeline so social bots receive the correct meta tags without introducing a new rendering architecture.
- Keep the implementation easy to extend when new public pages are added.

## Non-Goals

- Rebuild the frontend route components to manage SEO client-side.
- Change the public page IA or rename routes.
- Introduce a full SSR frontend framework migration.
- Redesign the website UI outside OG/crawler metadata behavior.

## Assumptions

- Social crawlers are routed to `/_ssr/*`, and those responses are the source of truth for OG tags.
- `apps/server/src/modules/og-image` is the correct integration point for branded image generation.
- The current public routes are:
  - `/`
  - `/about`
  - `/articles`
  - `/articles/:slug`
  - `/career`
  - `/career/:slug`
  - `/contact`
  - `/gallery`
  - `/privacy-policy`
  - `/terms-of-service`
  - `/sectors/sourcing-logistics`
- Existing dynamic repositories for blogs, vacancies, and business sectors are sufficient for the detail routes involved in this task.

## Dependencies

- `apps/server/src/modules/og-image/*`
- `apps/server/src/modules/ssr/*`
- `apps/web/src/lib/og-utils.ts`
- Brand/site configuration in `apps/web/src/config/template.ts`, `apps/web/src/lib/brand-seo-config.ts`, and `apps/server/src/shared/branding/brand-seo-config.ts`

## Design Direction

Use an industrial-editorial share-card system:

- Deep cobalt and graphite as the base atmosphere.
- Warm accent highlights and luminous overlays to avoid flat corporate gradients.
- Strong grid structures, route-specific labels, and concise operational messaging.
- A more cinematic hero treatment for the homepage than for the other pages.

## Phases

### Phase 1: OG system design and template refactor

- [ ] Extend OG image data/types so templates can express route-specific themes and highlight chips.
- [ ] Replace the current mostly-generic templates with a stronger branded visual system.
- [ ] Create a dedicated homepage variant that feels like the flagship share image.
- [ ] Keep fallback behavior intact when upstream data is missing.

Tests for this phase:

- [ ] Run server type checks after refactoring template/data contracts.

### Phase 2: Public route coverage in SSR metadata

- [ ] Replace the outdated static-page registry with actual public route definitions.
- [ ] Add dedicated meta generation for the homepage.
- [ ] Ensure every public route resolves to a branded dynamic OG image URL.
- [ ] Keep article and career detail pages dynamic through repository-backed resolvers.

Tests for this phase:

- [ ] Run server type checks after SSR route metadata updates.

### Phase 3: Shared utility alignment and final verification

- [ ] Align frontend OG utilities with any new page OG parameters.
- [ ] Verify there are no type regressions in touched packages.
- [ ] Review for sensible fallbacks and future maintainability.

Tests for this phase:

- [ ] Run targeted workspace type checks for `apps/server` and `apps/web`.

## Task List

- [ ] Write spec
- [ ] Refactor OG image types and templates
- [ ] Add homepage-specific OG handling
- [ ] Map every public route to dynamic OG metadata
- [ ] Align web OG utilities
- [ ] Run validation
- [ ] Mark completed tasks in this spec
