# Login Google Logo SVG

## Context / Problem

The `/login` page currently renders a text-only `Continue with Google` button. The request is to use a Google logo SVG for that action so the social sign-in entry point is visually recognizable.

## Goals

- Add a Google logo SVG to the login page social sign-in button.
- Keep existing button behavior, loading state, and disabled state unchanged.
- Keep styling consistent with the current design system button.

## Non-Goals

- No backend/auth flow changes.
- No copy/text changes beyond what is required for logo placement.
- No redesign of the full login/register layout.

## Assumptions

- `Continue with Google` should remain visible text with the logo as a leading visual cue.
- A local SVG asset import is preferred over remote logo URLs.

## Dependencies

- `apps/web/src/routes/login.lazy.tsx`
- New SVG asset under `apps/web/src/assets/external-company-logos/`
- Existing `Button` and `Badge` UI components

## Phases

### Phase 1: Asset + UI wiring

- Add a Google logo SVG asset to frontend assets.
- Import and render the logo in the login Google sign-in button.
- Preserve button semantics and existing `Last Used` badge behavior.

Tests prepared for Phase 1:

- Run web typecheck after UI change.

### Phase 2: Verification

- Validate that the login page compiles with the new asset import.
- Confirm no TypeScript regressions in `apps/web`.

Tests prepared for Phase 2:

- `bun run --filter web check-types`

## Task List

- [x] Create this spec file.
- [x] Add Google logo SVG asset.
- [x] Update login page Google button to show the SVG.
- [x] Run `bun run --filter web check-types`.
- [x] Mark tasks complete after verification.
