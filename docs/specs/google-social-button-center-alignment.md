# Google Social Button Center Alignment

## Context / Problem

The Google social sign-in button content needs centered alignment for better visual balance.

## Goals

- Center the primary Google button content (logo + label) horizontally.
- Preserve existing behavior and states, including the `Last Used` badge.

## Non-Goals

- No auth logic changes.
- No copy changes.
- No full auth page redesign.

## Assumptions

- The button should keep full width and remain visually consistent with existing UI components.
- The `Last Used` badge can be positioned independently without affecting centered primary content.

## Dependencies

- `apps/web/src/routes/login.lazy.tsx`
- `apps/web/src/routes/register.lazy.tsx`

## Phases

### Phase 1: Button layout update

- Update social button layout classes to center main content.
- Keep the optional `Last Used` badge pinned to the right.

Tests for this phase:

- `bun run --filter web check-types`

### Phase 2: Verification

- Ensure compile/type safety after UI class changes.

Tests for this phase:

- `bun run --filter web check-types`

## Task List

- [x] Create this spec before editing code.
- [x] Center social button content on login page.
- [x] Center social button content on register page.
- [x] Run `bun run --filter web check-types`.
- [x] Mark checklist completed after verification.
