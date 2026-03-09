# Landing Services Scrollable Cards

## Context / Problem

- Landing service card lists currently limit visible items, which prevents users from quickly browsing the full service catalog in-section.

## Goals

- Make service card collections scrollable in-section.
- Ensure users can access all services without hard truncation.
- Preserve existing visual language and card styling.

## Non-Goals

- No API changes.
- No route changes.
- No redesign outside service card list behavior.

## Assumptions

- Horizontal scrolling is acceptable on both mobile and desktop for dense service sets.
- Existing loading/error states remain intact.

## Phases

### Phase 1: Landing Services Section

- [x] Remove hard slice limit in `/Our services` cards.
- [x] Convert cards container to horizontal scroll.

Tests:

- [ ] All services render in the section.
- [ ] Section can scroll horizontally to reveal hidden cards.

### Phase 2: Service Detail Related Services

- [x] Remove hard slice limit in related services.
- [x] Convert related list to horizontal scroll.

Tests:

- [ ] All related services (except current slug) render.
- [ ] Horizontal scrolling reveals additional related cards.

### Phase 3: Validation

- [x] Run static checks.

Tests:

- [x] `bun --filter web check-types`
- [x] `bun lint`

## Task Checklist

- [x] Create spec file.
- [x] Update landing services section scroll behavior.
- [x] Update detail related services scroll behavior.
- [x] Run checks.
