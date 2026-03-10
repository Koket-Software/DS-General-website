# Landing Boxy Design Consistency

## Context / Problem

- Landing pages currently mix square and rounded corners across buttons, cards, nav controls, tabs, and form controls.
- The inconsistency is visible on key public routes (`/`, `/gallery`, `/articles`, `/contact`) and weakens the intended boxy design direction.
- Existing shared UI primitives are used by both landing and dashboard surfaces, so global radius changes would risk regressions in dashboard/admin UI.

## Goals

- Make landing page UI consistently boxy with square edges.
- Cover the components called out by request: buttons, cards, navigation buttons, gallery tabs, articles UI, contact UI, and related landing elements.
- Scope the change to landing routes only.

## Non-Goals

- Redesigning spacing, typography, color palette, or interaction patterns.
- Changing dashboard/admin component styling.
- Refactoring landing component architecture beyond what is required for styling consistency.

## Assumptions

- “Boxy design” means removing visible corner rounding (including pill-like corners) on landing pages.
- A landing-scoped CSS approach is acceptable and preferred for maintainability over one-off per-component overrides.

## Dependencies

- `apps/web/src/features/landing/layout/LandingLayout.tsx`
- `apps/web/src/index.css`

## Phases

### Phase 1: Spec + Scope Definition

- [x] Create this spec before implementation edits.
- [x] Confirm landing-only scope and no dashboard style impact.

Phase 1 tests:

- [x] N/A (spec/design phase)

### Phase 2: Landing Boxy Styling Implementation

- [x] Add a landing-scoped class at layout root to gate styling.
- [x] Add a landing-scoped CSS override that removes border radius from rounded utility classes and relevant UI slots.
- [x] Ensure coverage includes navigation controls, gallery tab buttons, article controls/cards, and contact form/service chips.

Phase 2 tests:

- [x] `bun run --filter web check-types`

### Phase 3: Verification + Spec Closeout

- [x] Re-scan landing sources for rounded usage and confirm they are now controlled by the landing-scoped override.
- [x] Update checklist statuses and report validation results.

Phase 3 tests:

- [x] `bun run --filter web check-types`

## Task Checklist

- [x] Create spec.
- [x] Implement landing-only boxy style override.
- [x] Run validation and summarize outcomes.
- [x] Mark spec checklist complete.
