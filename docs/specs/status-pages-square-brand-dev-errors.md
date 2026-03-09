# Status Pages Square Brand + Dev Error Details

## Context / Problem

- The current global `404` and route error pages are functional but visually over-rounded and less aligned with the landing page's sharper, editorial brand language.
- Runtime error details are always surfaced, including in production, which can expose internal messages to end users.

## Goals

- Refine global `404` and route error pages to look more professional and on-brand.
- Shift the status-page aesthetic toward squared edges and structured layouts that match the landing experience.
- Show actual error details in local/dev.
- Show safe, non-sensitive fallback error text in production.

## Non-Goals

- Redesigning `/forbidden` or `/rate-limit`.
- Changing route topology or adding new status routes.
- Adding backend logging/telemetry.

## Assumptions

- `import.meta.env.DEV` and `import.meta.env.PROD` are the correct environment toggles for this Vite app.
- Root-level TanStack Router error/not-found integration remains in place.

## Dependencies

- `apps/web/src/features/system/route-status-pages.tsx`
- Existing DS General design tokens in `apps/web/src/index.css`
- Root route configuration in `apps/web/src/routes/__root.tsx`

## Phases

### Phase 0 — Spec

- Create this spec and track progress.

### Phase 1 — Visual Refinement

- Update the shared status shell to a square-edge, brand-consistent composition.
- Keep typography, spacing, and calls-to-action aligned with landing page conventions.

### Phase 2 — Env-Aware Error Messaging

- Keep route context visible.
- Expose full runtime error details only in local/dev.
- Return generic production-safe messaging for end users.

### Phase 3 — Validation

- Run:
  - `bun run --filter web check-types`
  - `bun run --filter web build:no-sitemap`

## Task Checklist

- [x] Phase 0 spec created.
- [x] Refactor shared 404/error page UI to square-edge branded style.
- [x] Implement env-aware error detail formatting.
- [x] Run validation commands and confirm they pass.

## Test Plan By Phase

### Phase 1 Tests

- Status pages render correctly for both not-found and runtime error states.
- Action controls remain keyboard accessible.

### Phase 2 Tests

- Dev mode surfaces actual thrown error details.
- Production mode displays sanitized user-facing message.

### Phase 3 Tests

- `bun run --filter web check-types` passes.
- `bun run --filter web build:no-sitemap` passes.

## Validation Results

- `bun run --filter web check-types` passed.
- `bun run --filter web build:no-sitemap` passed.
