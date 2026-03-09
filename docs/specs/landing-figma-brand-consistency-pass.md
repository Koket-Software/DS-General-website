# Landing Figma Brand Consistency Pass

## Context / Problem

The landing experience diverges from the Figma source (`z1IxJtFUMZLsnwmABg5LP7`, node `19:104`) in typography, spacing rhythm, container alignment, CTA semantics, and accessibility details. The drift is caused by section-level one-off styles (`max-w-*`, custom spacing values, placeholder content) rather than reusable layout primitives.

## Goals

- Align landing pages to a unified brand system based on the Figma frame and existing DS color tokens.
- Apply Inter-first typography across the app and remove global serif overrides.
- Enforce a single landing container rhythm (1248 content width with 96px desktop gutters) across all landing routes.
- Fix high-priority semantic/accessibility issues: broken CTA targets, missing form labels, missing accessible nav toggle labels, and non-interactive social affordances.
- Keep route paths, API contracts, and TanStack Query data behavior unchanged.

## Non-Goals

- Rebuilding backend APIs or database schemas.
- Reworking dashboard feature layouts beyond typography normalization.
- Introducing a new routing structure or new landing pages.

## Assumptions

- Figma node `19:104` is the source-of-truth for homepage spacing and type rhythm.
- Other landing pages inherit the same spacing/type/token system unless a different Figma node is provided.
- App-wide typography should be Inter-first per approved scope.

## Dependencies

- `apps/web/src/index.css`
- `apps/web/src/features/landing/layout/LandingLayout.tsx`
- `apps/web/src/features/landing/components/*`
- Existing query hooks under `apps/web/src/lib/**`

## Phases

### Phase 1: Shared Foundations

- Add a shared landing container and section rhythm utility class set.
- Normalize app typography to Inter and remove global `Playfair Display` override.
- Keep existing Figma-aligned color tokens (`Primary`, `Text Primary`, `Text Secondary`) intact.

Tests for this phase:

- Run `bun check-types`.

### Phase 2: Landing Shell and Core Sections

- Refactor navbar/footer/home core sections to use unified container/spacing classes.
- Fix broken CTA destinations and invalid utility classes (`object-fit`, malformed class tokens).
- Normalize home article composition to avoid uneven grid behavior.

Tests for this phase:

- Run `bun check-types`.
- Run `bun lint`.

### Phase 3: Cross-Route Landing Consistency

- Apply shared container rhythm to `/about`, `/articles`, `/gallery`, `/career`, `/contact`, and `/sectors/sourcing-logistics` components.
- Replace placeholder brand metrics on About hero.
- Make articles “Follow Us” actions interactive and accessible.
- Ensure contact form fields have explicit labels.

Tests for this phase:

- Run `bun check-types`.
- Run `bun lint`.

### Phase 4: Accessibility and Final QA

- Add explicit aria labels for mobile nav controls and icon-only actions.
- Ensure keyboard-visible focus affordances remain on interactive controls.
- Update stale footer year to dynamic current year.

Tests for this phase:

- Run `bun check-types`.
- Run `bun lint`.
- Manually verify landing pages at desktop and mobile breakpoints.

## Tasks

- [x] Create shared landing layout utilities and adopt them across landing sections.
- [x] Switch typography to Inter-first and remove global serif override.
- [x] Fix CTA semantics, malformed utility classes, and stale/placeholder content.
- [x] Add explicit labels and accessible names for key form/nav/social controls.
- [x] Run validation (`bun check-types`, `bun lint`) and record outcomes.
