# DS Logo Placement Rollout

## Context / Problem

The web app currently uses mixed branding assets for logo placements: legacy inline SVG icon components on landing surfaces and placeholder company logo files in the dashboard sidebar. The request is to standardize logo usage with `apps/web/src/assets/ds/ds_logo.svg` and `apps/web/src/assets/ds/ds_logo_large.svg` across key touchpoints including home/landing, dashboard, login, registration, and contact-related surfaces where brand presence is appropriate.

## Goals

- Use DS logo assets consistently in primary brand locations.
- Replace dashboard placeholder logo assets with DS assets.
- Add DS branding to auth screens (login and registration).
- Keep existing layout behavior (responsive sizing, collapsed sidebar behavior) intact.

## Non-Goals

- Redesigning page layouts beyond logo placement.
- Changing non-brand imagery (partner logos, testimonials, content images).
- Altering backend/API behavior.

## Assumptions

- `ds_logo.svg` is the compact/icon variant.
- `ds_logo_large.svg` is the full wordmark variant intended for larger or text+logo placements.
- Existing brand blue (`#4962E1`) in assets aligns with current theme usage.

## Dependencies

- Frontend logo touchpoints in:
  - `apps/web/src/features/landing/components/icons.tsx`
  - `apps/web/src/features/landing/components/navbar.tsx`
  - `apps/web/src/features/landing/components/footer.tsx`
  - `apps/web/src/features/dashboard/layout/app-sidebar.tsx`
  - `apps/web/src/routes/login.lazy.tsx`
  - `apps/web/src/routes/register.lazy.tsx`
  - `apps/web/src/features/landing/components/contact-section.tsx`

## Phase 1: Replace / Add DS Logos in UI

### Implementation tasks

- [x] Update shared landing `Logo` component to render DS logo assets (`sm` => `ds_logo.svg`, `lg` => `ds_logo_large.svg`).
- [x] Simplify landing navbar/footer logo blocks to use DS logo assets directly where appropriate.
- [x] Replace dashboard sidebar logo imports from `assets/company-logo/*` to `assets/ds/*`, preserving expanded/collapsed behavior.
- [x] Add DS logo brand blocks to login and registration cards.
- [x] Add DS logo placement to contact section header area.

### Tests for Phase 1

- [x] Run `bun run --filter web check-types`.

## Phase 2: Verify and Document Completion

### Implementation tasks

- [x] Review changed files for consistency and accessibility (`alt` text, sizing classes).
- [x] Mark checklist completion in this spec.

### Tests for Phase 2

- [x] Confirm Phase 1 test remained passing after final adjustments.
