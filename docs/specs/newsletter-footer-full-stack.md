# Newsletter Footer Full-Stack

## Context / Problem

- The footer currently shows a newsletter email input and subscribe button with no backend wiring.
- There is no newsletter persistence, no admin management surface, and no API contract for subscribers.
- The codebase already has an established end-to-end pattern for resource modules (for example `contacts`) that this feature should follow.

## Goals

- Add persistent newsletter subscriber storage in Postgres via Drizzle.
- Add a full server module with public subscribe API and admin management APIs.
- Add dashboard management UI for subscribers (list/search/filter/toggle/delete).
- Wire the landing footer subscribe UI to the real public API with clear feedback states.
- Keep behavior idempotent and aligned with locked assumptions.

## Non-Goals

- External provider sync (Mailchimp/Brevo/etc.).
- Public subscriber listing/status/unsubscribe APIs in v1.
- Newsletter campaign creation/sending workflows.
- Expanded subscriber profile fields beyond v1 shape.

## Assumptions

- Single opt-in idempotent subscription flow.
- Duplicate subscribe requests reactivate subscriber and optionally update name.
- Footer keeps email-first UX with optional collapsible name field.
- Admin operations are list/search/filter/toggle/delete only.

## Dependencies

- Existing module registration system in `apps/server/src/modules/index.ts`.
- Existing query and response helpers in `apps/server/src/shared/query` and `apps/server/src/core/http.ts`.
- Existing dashboard table/filter patterns (`ResourceTable`, `useTableFilters`).
- Root-level env/database setup and Drizzle migration pipeline.

## Phases

### Phase 1: DB Schema + Migration + Seed

- [x] Add `newsletters` table schema in `packages/db/src/schema/newsletters.ts`.
- [x] Export schema through `packages/db/src/schema/index.ts`.
- [x] Generate Drizzle migration and metadata snapshot updates.
- [x] Add newsletter seed data and include table in seed truncate/insert flow.

Phase 1 tests:

- [x] `bun db:generate`

### Phase 2: Server Newsletter Module

- [ ] Create `apps/server/src/modules/newsletters/` with:
  - [x] `validators.ts`
  - [x] `repository.ts`
  - [x] `service.ts`
  - [x] `controller.ts`
  - [x] `routes.ts`
  - [x] `schema.ts`
  - [x] `index.ts`
- [x] Implement public subscribe behavior:
  - [x] Normalize email (`trim().toLowerCase()`).
  - [x] Idempotent single opt-in.
  - [x] Upsert-light duplicate handling (reactivate, clear `unsubscribedAt`, update name when provided).
- [x] Implement admin list/search/filter + toggle active/inactive + delete.
- [x] Register module in `apps/server/src/modules/index.ts` with:
  - [x] `/api/v1/newsletters`
  - [x] `/api/v1/newsletters/client`

Phase 2 tests:

- [x] `bun run --filter server test`

### Phase 3: Web Data Layer + Footer Wiring

- [x] Add API endpoint constants for newsletter in `apps/web/src/lib/API_ENDPOINTS.ts`.
- [x] Add landing newsletter data layer in `apps/web/src/lib/newsletters/`:
  - [x] `newsletters-schema.ts`
  - [x] `newsletters-api.ts`
  - [x] `newsletters-query.ts`
  - [x] `index.ts`
- [x] Wire footer subscribe form to mutation with:
  - [x] Email primary input
  - [x] Optional collapsible name input
  - [x] Zod validation
  - [x] Pending/success/error states

Phase 3 tests:

- [x] `bun check-types`

### Phase 4: Dashboard Newsletter Management

- [x] Add dashboard feature in `apps/web/src/features/dashboard/newsletter/`:
  - [x] list view
  - [x] table columns
  - [x] feature-local `lib/` (`newsletter-api.ts`, `newsletter-query.ts`, `newsletter-schema.ts`, `index.ts`)
- [x] Add dashboard route loader/prefetch + search validation for `/dashboard/newsletter/`.
- [x] Add sidebar navigation item for newsletter.

Phase 4 tests:

- [x] `bun check-types`

### Phase 5: Validation + Quality Gates

- [x] Run lint and type checks across workspaces.
- [ ] Verify manual smoke scenarios.
- [x] Mark completed checklist items in this spec.

Phase 5 tests:

- [x] `bun lint`
- [x] `bun check-types`
- [ ] Manual smoke:
  - [ ] footer subscribe new email
  - [ ] footer duplicate subscribe (without name)
  - [ ] footer duplicate subscribe (with name)
  - [ ] dashboard list/search/filter
  - [ ] dashboard toggle active/inactive
  - [ ] dashboard delete subscriber

## Acceptance Criteria

- Public footer subscription persists to DB via `/api/v1/newsletters/client`.
- Duplicate subscriptions do not create duplicate rows and follow upsert-light behavior.
- Dashboard route `/dashboard/newsletter` allows admin list/search/filter/toggle/delete.
- APIs return response shape containing:
  - `id`
  - `email`
  - `fullName`
  - `isActive`
  - `subscribedAt`
  - `unsubscribedAt`
  - `createdAt`
- No public list/status/unsubscribe endpoints are exposed in v1.
