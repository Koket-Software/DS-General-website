# Branded 404 And Error Pages

## Context / Problem

- The web app has basic status pages for some explicit routes like `/forbidden` and `/rate-limit`, but it does not provide a branded global 404 experience for unmatched routes.
- Runtime route errors currently fall back to TanStack Router defaults instead of a polished recovery page aligned with the DS General site.
- The public site already has a clear brand language built around editorial typography and indigo-forward tokens; missing and crash states should feel intentional instead of generic.

## Goals

- Add a distinctive, on-brand 404 experience for unmatched routes.
- Add a functional global error page for route/render/runtime failures handled by TanStack Router.
- Reuse a shared visual shell so both states feel cohesive and maintainable.
- Wire both states at the root routing layer so nested route failures resolve to full-screen recovery views.
- Provide practical recovery actions such as going home, going back, contacting the team, and retrying.

## Non-Goals

- Redesigning existing `403` or `429` pages.
- Changing public route paths or the current landing/dashboard topology.
- Adding backend error logging or observability integrations.

## Assumptions

- The app should preserve the existing DS General token palette from `apps/web/src/index.css`.
- Root-route-level error and not-found handling is the cleanest way to avoid partial-layout fallback screens.
- A direct `/404` URL is not required as long as unmatched routes render the branded 404 component.

## Dependencies

- TanStack Router root route error and not-found configuration.
- Existing shared UI utilities such as `Button` and Tailwind token classes.
- Existing public routes such as `/` and `/contact` for recovery actions.

## Phases

### Phase 0: Spec

- Create and maintain this spec before implementation.

### Phase 1: Shared Error-State UI

- Build a reusable full-screen status shell in the web feature layer.
- Encode a bold editorial-industrial aesthetic using the existing indigo brand tokens, layered gradients, signal-grid decoration, and accessible action areas.
- Support both 404 and runtime error content without duplicating layout code.

### Phase 2: Router Integration

- Attach branded `notFoundComponent` and `errorComponent` handling to the root route.
- Ensure unmatched URLs render the 404 page.
- Ensure thrown route/render errors render the global error page with retry behavior.

### Phase 3: Validation

- Run:
  - `bun run --filter web check-types`
  - `bun run --filter web build:no-sitemap`
- Confirm the app compiles with the new root-route handlers and shared status components.

## Task Checklist

- [x] Phase 0 spec created.
- [x] Build shared branded status-shell UI for 404 and error states.
- [x] Wire root route `notFoundComponent` and `errorComponent`.
- [x] Run validation commands and record outcomes.

## Test Plan by Phase

### Phase 1 tests

- Shared status components compile cleanly in the web workspace.
- CTA controls remain keyboard accessible and use existing route-safe links/actions.

### Phase 2 tests

- Unmatched routes render the branded 404 page instead of TanStack Router defaults.
- Root-route error handling renders the branded error page with retry and navigation actions.

### Phase 3 tests

- `bun run --filter web check-types` passes.
- `bun run --filter web build:no-sitemap` passes.
