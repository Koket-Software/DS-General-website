# Landing Min Height Footer Spacing

## Context / Problem

- Some landing routes have short content, so the footer appears immediately in the initial viewport.
- The requirement is for landing page content to occupy at least one full screen before footer content appears.

## Goals

- Ensure all routes under the shared landing layout keep the main page content at least viewport height.
- Apply the behavior in one shared place so every landing route stays consistent.

## Non-Goals

- No redesign of navbar/footer content.
- No per-page layout rewrites in individual landing page files.
- No API, data, or routing behavior changes.

## Assumptions

- The requested behavior is to place the footer below the initial fold on short pages by enforcing a minimum viewport-height content area.
- Applying this at `LandingLayout` is sufficient because all landing routes are mounted under `/_landing`.

## Dependencies

- `/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/features/landing/layout/LandingLayout.tsx`

## Phases

### Phase 1: Shared layout height contract

- [x] Add a minimum viewport-height class to the landing `<main>` container so the footer is pushed below short content pages.

Tests prepared for Phase 1:

- `bun run --filter web check-types`

### Phase 2: Verification

- [x] Run frontend typecheck to confirm the layout class update introduces no TS regressions.

Tests prepared for Phase 2:

- `bun run --filter web check-types`

## Task List

- [x] Create spec file.
- [x] Update landing layout minimum height behavior.
- [x] Run validation checks.
- [x] Mark tasks complete after verification.
