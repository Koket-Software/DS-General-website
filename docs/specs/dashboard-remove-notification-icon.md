# Dashboard Remove Notification Icon

## Context / Problem

- The dashboard header currently shows a notification bell and badge.
- There is no notification system backing this UI, so the icon is misleading.

## Goals

- Remove the notification icon action from the dashboard header.
- Keep the header layout clean with theme switch and user menu intact.

## Non-Goals

- Implementing a notification backend or UI.
- Changing dashboard routing, auth, or sidebar behavior.

## Assumptions

- The dashboard should only show actionable controls that are functional.
- Theme switching and user profile controls should remain visible.

## Dependencies

- [`apps/web/src/features/dashboard/layout/header.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/features/dashboard/layout/header.tsx)

## Phases

### Phase 0: Spec

- Create and maintain this spec before implementation.

### Phase 1: Header Cleanup

- Remove the Bell icon button and badge from the dashboard header.
- Remove now-unused imports and keep layout spacing consistent.

### Phase 2: Validation

- Run scoped web type checking to ensure the header compiles.

## Task Checklist

- [x] Phase 0 spec created.
- [x] Phase 1 header updated.
- [x] Phase 2 validation run.

## Test Plan by Phase

### Phase 1 tests

- Dashboard header renders without notification icon while keeping theme switch and user menu.

### Phase 2 tests

- `bun run --filter web check-types` passes.
