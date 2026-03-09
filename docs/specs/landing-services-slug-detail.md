# Landing Services Slug Detail Integration

## Context / Problem

- The landing `/Our services` cards already load public services, but `Learn More` still links to a static sector route.
- There is no public service detail route at `/services/$slug`.
- Service details from `/api/v1/services/client/:slug` are not exposed in landing UX.

## Goals

- Use public services API content (`title`, `excerpt`) in the shared landing services section.
- Link each `Learn More` action to `/services/$slug`.
- Add a public landing detail page at `/services/$slug` with full service content.
- Keep the existing square-card landing visual language for related content.
- Prefetch service detail data for faster perceived navigation.

## Non-Goals

- No backend API/schema changes.
- No `/services` listing page in this scope.
- No redesign of global landing header/footer/nav information architecture.

## Assumptions

- Shared `ServicesSection` remains used by both Home and About pages.
- `description` can contain either rich text HTML-like content or plain text.
- Existing public endpoints remain the source of truth:
  - `/api/v1/services/client`
  - `/api/v1/services/client/:slug`

## Dependencies

- `apps/web/src/features/landing/components/services-section.tsx`
- `apps/web/src/lib/services/services-query.ts`
- Landing routes under `apps/web/src/routes/_landing*`
- New landing service detail components under `apps/web/src/features/landing/`

## Phases

### Phase 1: Shared Services Section Link + Prefetch

- [x] Keep services list sourced from `usePublicServices`.
- [x] Keep rendering API `title` and `excerpt` as primary card content.
- [x] Replace hardcoded `Learn More` link target with `/services/$slug`.
- [x] Prefetch `publicServiceBySlugQueryOptions(slug)` on hover/focus.

Phase 1 tests:

- [ ] `Learn More` opens correct `/services/<slug>` per card.
- [ ] Hover/focus triggers detail prefetch without runtime errors.

### Phase 2: Add Public `/services/$slug` Route + Loader

- [x] Add route file for `/_landing/services/$slug`.
- [x] In loader, prefetch service detail query by slug.
- [x] In loader, prefetch a small services list for related cards.
- [x] Wire route component to a dedicated landing service detail page.

Phase 2 tests:

- [ ] Direct navigation to `/services/<slug>` resolves route and loads data.
- [ ] Invalid slug is handled by component error/not-found state.

### Phase 3: Build Landing Service Detail UI

- [x] Add service detail page wrapper and section component.
- [x] Implement top back-link and detail framing consistent with landing detail pages.
- [x] Implement square split hero (primary image + title/excerpt).
- [x] Render full `description` with:
  - [x] `LexicalViewer` when content is HTML-like.
  - [x] plain text block with preserved line breaks otherwise.
- [x] Implement square image/gallery grid from service images.
- [x] Implement related services square cards (exclude current slug) linking to `/services/$slug`.
- [x] Include loading, error, and not-found states.

Phase 3 tests:

- [ ] Detail renders complete content for valid slug.
- [ ] Related cards navigate to different service details.
- [ ] Mobile layout remains usable and readable.

### Phase 4: Route Tree + Validation

- [x] Regenerate/accept TanStack route tree updates.
- [x] Run static validation commands.

Phase 4 tests:

- [x] `bun --filter web check-types`
- [x] `bun lint` (repo uses root lint script; no `web` package lint script)

## Task Checklist

- [x] Create spec file.
- [x] Update shared services section links + prefetch.
- [x] Add public service slug route + loader.
- [x] Implement service detail page/section UI.
- [x] Sync route tree artifacts.
- [x] Run and pass typecheck/lint.
