# Shadcn OKLCH Brand Theming Migration

## Context / Problem

The web app currently mixes semantic shadcn tokens with hardcoded hex values and Tailwind gray/slate classes. This causes inconsistent branding, weak dark-mode behavior, and difficult maintenance. The existing `ThemeProvider` also exists but is not mounted at app root, so theme mode switching is not consistently applied.

## Goals

- Convert core shadcn theme tokens in `apps/web/src/index.css` to `oklch(...)` values.
- Keep existing token names for compatibility (`--background`, `--foreground`, `--primary`, etc.).
- Align tokens to brand anchors:
  - Primary `#4962E1`
  - Text-primary `#1D1D1D`
  - Text-secondary `#616161`
  - Background `#FFFFFF`
  - Muted background `#F5F5F5`
  - Muted accent `#F6F7FD`
- Mount `ThemeProvider` in app root and retain `light|dark|system` behavior.
- Replace hardcoded color usage across app UI with semantic token classes.
- Retain branded dark mode.

## Non-Goals

- Typography redesign beyond minimal compatibility updates.
- Layout/content changes unrelated to theming.
- API/schema changes outside frontend style/theming concerns.

## Assumptions

- Current in-repo route/components shape under `features/landing` and `features/dashboard` is the source of truth.
- Dark mode stays enabled.
- Existing shadcn component contracts should not change.
- Explicit status colors remain where semantically needed (`success`, `warning`, `destructive`, `info`).

## Dependencies

- Tailwind v4 CSS variable theming via `@theme` and `@theme inline`.
- Existing `ThemeProvider` in `apps/web/src/context/theme-context.tsx`.
- Existing shadcn component classes in `apps/web/src/components/ui`.

## Phases

### Phase 1: Theme Foundation

- [x] Convert token values in `apps/web/src/index.css` to OKLCH for light and dark.
- [x] Keep and validate full token surface for shadcn + dashboard usage.
- [x] Update leftover token-adjacent raw color logic where feasible.

Tests for Phase 1:

- [x] Static inspection confirms `:root` and `.dark` token values are OKLCH.
- [x] Build/typecheck passes after token conversion.

### Phase 2: Runtime Theme Wiring

- [x] Mount `ThemeProvider` at app root composition.
- [x] Remove hardcoded `bg-white` base layout surface in favor of `bg-background`.
- [x] Update theme color meta handling to brand-aware light/dark values.

Tests for Phase 2:

- [x] Theme switch toggles HTML class and persists selection.
- [x] Light/dark token differences are visible on shared layout surfaces.

### Phase 3: Hardcoded Color Migration

- [x] Replace legacy brand hex values in app components with semantic classes.
- [x] Replace generic gray/slate utility colors with semantic tokens where appropriate.
- [x] Convert practical SVG/icon fixed fills to token-driven color via currentColor/classes.
- [x] Prioritize high-density components first (landing + dashboard forms/tables).

Tests for Phase 3:

- [x] `rg` audit shows no remaining legacy anchor hex colors in app components (except allowlisted cases).
- [x] `rg` audit of gray/slate utility classes reduced to intentional exceptions.

### Phase 4: Validation

- [x] Run `bun check-types`.
- [x] Run `bun lint`.
- [ ] Perform key light/dark visual verification on landing and dashboard routes.

Tests for Phase 4:

- [x] Typecheck and lint pass.
- [ ] No major visual regressions in critical screens.

## Acceptance Criteria

- Theme tokens are OKLCH-based and semantically mapped to brand anchors.
- Theme switching works globally via mounted provider.
- App styling primarily uses semantic token classes instead of hardcoded colors.
- No type/lint regressions introduced.
