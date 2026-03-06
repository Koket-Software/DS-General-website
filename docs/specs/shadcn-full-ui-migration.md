# Shadcn-First UI Migration

## Context / Problem

The web app currently has mixed UI implementation styles. Many app-facing components still use raw interactive HTML tags (`button`, `input`, `textarea`, `label`) directly, while the project already includes `shadcn/ui` primitives. This causes consistency drift and weaker maintainability.

## Goals

- Migrate app-facing components in `apps/web/src` to use `shadcn/ui` interactive primitives.
- Enforce a guard that blocks raw interactive primitives outside `components/ui/**`.
- Introduce `useAppForm` as the general TanStack Form hook alias.
- Keep `useDashboardForm` for backward compatibility.
- Convert auth and landing forms to TanStack Form patterns.

## Non-Goals

- Rewriting foundational `components/ui/**` primitives.
- Reworking backend/data contracts.
- Pixel-perfect preservation of legacy landing style.

## Assumptions

- Work is based on the current working tree (including ongoing landing/dashboard restructure).
- Shared `Button` keeps current global scroll-to-top behavior.
- Strictness rule: no raw `button/input/textarea/label` in app-facing code.
- `form` remains semantic HTML but form state should be TanStack Form where targeted.

## Dependencies

- Existing `shadcn/ui` setup in `apps/web/components.json`.
- Existing TanStack Form usage and helpers in `apps/web/src/lib/forms.ts`.

## Phases

### Phase 1: Spec + Enforcement

- [x] Create this spec.
- [x] Add `useAppForm` export and preserve `useDashboardForm` alias.
- [x] Add primitive guard script at `apps/web/scripts/check-no-raw-interactive-tags.ts`.
- [x] Add `lint:ui-primitives` script to `apps/web/package.json`.
- [x] Capture baseline checks (`bun check-types`, `bun lint`).

### Phase 2: Landing Migration

- [x] Replace raw interactive elements in landing components with `shadcn` primitives.
- [x] Convert landing forms to TanStack Form pattern.
- [x] Refactor FAQ toggles to `Accordion`.
- [x] Keep routing behavior unchanged.

### Phase 3: Dashboard/Auth/Edge Migration

- [x] Replace remaining raw interactive elements in dashboard and edge files.
- [x] Convert login/register to TanStack Form patterns.
- [x] Replace rate-limit retry button with `Button`.
- [x] Replace rich-text helper/editor raw buttons with `Button`.

### Phase 4: Consistency Cleanup

- [x] Normalize migrated UI to token-driven classes.
- [x] Keep imports direct and avoid new unnecessary barrel patterns.
- [x] Avoid introducing effect-based derived state.

### Phase 5: Validation

- [x] `bun run --filter web lint:ui-primitives`
- [x] `bun check-types`
- [x] `bun lint`
- [x] `bun run --filter web check-types`

## Test Plan

- [ ] Landing route smoke checks (`/`, `/about`, `/gallery`, `/articles`, `/articles/:id`, `/career`, `/career/:id`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/sectors/sourcing-logistics`).
- [ ] Auth route checks (`/login`, `/register`).
- [ ] Dashboard create/edit form checks for primary resources.
- [ ] Rich-text toolbar checks after button migration.
- [ ] Guard check passes with zero raw interactive tag violations outside `components/ui/**`.
