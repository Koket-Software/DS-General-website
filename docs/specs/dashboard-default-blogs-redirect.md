# Dashboard Default Blogs Redirect

## Context / Problem

- Visiting `/dashboard` currently redirects to `/dashboard/blogs` without the default list query params.
- The blogs dashboard is the first dashboard landing view and should open with the expected pagination and sorting state.

## Goals

- Redirect `/dashboard` to `/dashboard/blogs?page=1&limit=10&sortBy=publishDate&sortOrder=desc`.
- Keep the redirect aligned with the blogs route search param contract.

## Non-Goals

- Changing the blogs page UI or loader behavior.
- Modifying other dashboard routes or sidebar links.

## Assumptions

- The blogs dashboard remains the default first dashboard screen.
- The existing blogs search schema defaults stay `page=1`, `limit=10`, `sortBy=publishDate`, and `sortOrder=desc`.

## Dependencies

- TanStack Router redirect support for typed `search` params.
- Blogs list param schema in `apps/web/src/features/dashboard/blogs/lib/blogs-schema.ts`.

## Phases

### Phase 0: Spec

- Create and maintain this spec before implementation.

### Phase 1: Redirect Update

- Update `apps/web/src/routes/dashboard/index.lazy.tsx` to redirect with explicit blogs query params.

### Phase 2: Validation

- Run a scoped web type check to confirm the route change compiles.

## Task Checklist

- [x] Phase 0 spec created.
- [x] Phase 1 redirect updated.
- [x] Phase 2 validation run.

## Test Plan by Phase

### Phase 1 tests

- Navigating to `/dashboard` resolves to the blogs dashboard route with the expected query params.

### Phase 2 tests

- `bun run --filter web check-types` passes.
