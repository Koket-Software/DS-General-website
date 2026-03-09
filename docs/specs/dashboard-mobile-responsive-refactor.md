# Dashboard Mobile-First Responsive Refactor

## Context / Problem

- Dashboard screens are inconsistent on mobile: navigation, list views, forms, and detail pages rely on desktop-first layouts (`h-screen`, fixed split panes, dense tables).
- The dashboard visual language diverges from the landing pages, which use a sharper square/boxy style system.
- Shared primitives (`DataTable`, `DashboardDetailShell`) do not fully support mobile-first responsive behavior and enforce inconsistent interaction patterns across modules.

## Goals

- Make the dashboard reliably usable on phone, tablet, and desktop with mobile-first behavior.
- Align dashboard styling with the square/boxy landing-page visual language.
- Standardize list screens and form/detail screens around shared responsive primitives.
- Preserve existing route/data/mutation behavior while changing layout and UI architecture.

## Non-Goals

- Backend/API or schema changes.
- Route topology changes.
- Authentication or authorization logic changes.

## Assumptions

- No API contracts change; existing query/mutation hooks continue to power data flows.
- Dark/light support remains intact.
- Circular affordances remain for semantic avatar/media cases; general surfaces become square/boxy.

## Dependencies

- `apps/web/src/routes/dashboard.tsx`
- `apps/web/src/components/ui/sidebar.tsx`
- `apps/web/src/features/dashboard/layout/*`
- `apps/web/src/features/dashboard/components/table/*`
- `apps/web/src/features/dashboard/components/detail/*`
- Dashboard module forms/detail/list screens under `apps/web/src/features/dashboard/**`

## Phases

### Phase 0 — Spec + Tracker

- Create this spec and task checklist.

Tests for this phase:

- N/A

### Phase 1 — Foundation (Shell, Sidebar, Boxy Tokens)

- Add dashboard-scoped visual tokens/utilities for square/boxy surfaces.
- Update `/dashboard` layout shell for consistent responsive structure.
- Add mobile header hamburger trigger that opens sidebar drawer.
- Keep desktop collapsible sidebar behavior.
- Normalize sidebar persistence cookie key mismatch.
- Introduce a shared dashboard page shell primitive for list pages.

Tests for this phase:

- `bun --filter web check-types`

### Phase 2 — Responsive Data Primitives

- Extend `DataTable`/`ResourceTable` with mobile card rendering.
- Add column meta contract for mobile labels/order/visibility.
- Make toolbar and pagination responsive and touch-friendly.
- Apply shared primitive behavior to dashboard list screens.

Tests for this phase:

- `bun --filter web check-types`
- `bun --filter web lint`

### Phase 3 — Forms + Detail Migration

- Upgrade `DashboardDetailShell` for responsive sticky actions and mobile Form/Preview tabs.
- Migrate legacy split-form modules onto the upgraded shell:
  - blogs, vacancies, services, products, client projects, business sectors, user management, gallery item.
- Normalize remaining detail-heavy pages (especially user-management detail and gallery detail) for mobile readability and actions.

Tests for this phase:

- `bun --filter web check-types`
- `bun --filter web lint`

### Phase 4 — Accessibility + Quality Pass

- Ensure touch target sizing, focus visibility, keyboard support, hierarchy, and non-hover-only interactions.
- Validate viewport matrix and critical scenarios.

Tests for this phase:

- `bun --filter web check-types`
- `bun --filter web lint`

## Test Matrix

- Phone: `390x844`
- Tablet: `768x1024`
- Desktop: `1280x800`

## Critical Scenario Checklist

- Sidebar open/close, mobile route navigation close, persisted desktop collapse state.
- List pages: search/filter/pagination/actions on mobile cards and desktop tables.
- Forms: create/edit/view with preview sync in migrated modules.
- Detail pages: user-management detail and gallery detail are mobile readable and actionable.
- Dialogs/sheets/delete flows remain accessible and scroll-safe.

## Tasks

- [x] Create spec and phase tracker.
- [x] Implement foundation shell/sidebar/boxy styling updates.
- [x] Implement responsive table primitive with mobile cards and column meta contract.
- [x] Implement responsive detail shell with mobile tabs.
- [x] Migrate legacy split forms to shared shell (blogs, vacancies, services, products, client projects, business sectors, user management, gallery item).
- [x] Normalize user-management detail and gallery detail responsiveness.
- [x] Run type-check and lint.
- [ ] Verify critical scenarios across viewport matrix.
