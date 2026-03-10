# Fix Sector CTA Arrow Visibility

## Context / Problem

The sector detail hero CTA (`Let's Talk`) should show a visible top-right arrow
inside the light icon tile. Right now the icon is not visible because the arrow
color conflicts with the icon tile background.

## Goals

- Make the CTA arrow visible and visually match the intended reference.
- Keep existing arrow usage in other landing components unchanged.

## Non-Goals

- Redesigning the full CTA layout or spacing system.
- Changing unrelated icon components.

## Assumptions

- The current CTA structure and spacing are already acceptable.
- `ArrowUpRight` is reused and should remain backward compatible.

## Dependencies

- `apps/web/src/features/landing/components/icons.tsx`
- `apps/web/src/features/landing/components/sourcing-logistics-section.tsx`

## Phases

### Phase 1: Icon Color Contract Update

Prepare tests:

- TypeScript type check for the web app (`bun --cwd apps/web run check-types`).

Tasks:

- [x] Allow `ArrowUpRight` to accept an optional color prop with a safe default.
- [x] Update sector CTA usage to pass a primary-color arrow for the light tile.
- [x] Run `bun --cwd apps/web run check-types`.
