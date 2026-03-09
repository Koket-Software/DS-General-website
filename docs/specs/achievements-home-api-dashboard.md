# Achievements Feature (Home + DB + API + Dashboard)

## Context / Problem

The site needs a first-class "Achievements" capability so the client can showcase certificate-style accomplishments with title, description, and image. Today, no achievements domain exists in the database, API, public landing data layer, or dashboard CMS.

## Goals

- Add a new `achievements` domain across DB, API, landing, and dashboard.
- Support required fields: `title`, `description`, `image`.
- Support visibility and ordering controls: `isActive`, `position`.
- Render a premium, responsive Achievements section on the homepage after Services.
- Show top 6 active achievements on the homepage.
- Provide dashboard CRUD with image upload and drag-and-drop reorder persisted through API.

## Non-Goals

- Redesigning the entire homepage or dashboard visual system.
- Introducing role changes beyond existing admin-only management conventions.
- Building monthly/yearly analytics for achievements.

## Assumptions

- Spelling is standardized as `Achievements` in code and UI.
- Description is required for each achievement.
- Reorder is implemented with drag-and-drop in dashboard.
- Homepage fetches only active achievements and displays top 6.
- Existing upload storage strategy (`/uploads/...`) remains unchanged.

## Dependencies

- `packages/db` schema + migration pipeline
- `apps/server` modular architecture (`modules/*`)
- `apps/web` landing query layer and dashboard feature patterns
- Shared upload helper in `apps/server/src/shared/storage/uploadFile.ts`

## Phases

### Phase 1: Data Model and Migration

- Add `achievements` table schema with required fields and indexes.
- Export schema for Drizzle/server usage.
- Generate migration and meta updates.

Tests for this phase:

- Run `bun db:generate` and verify migration SQL shape.

### Phase 2: Server Module

- Create `apps/server/src/modules/achievements` with controller/routes/service/repository/validators/schema/index.
- Implement admin CRUD + reorder endpoint and public list endpoint.
- Implement multipart image upload handling for create/update.
- Register module and API endpoints.

Tests for this phase:

- Run `bun check-types`.
- Verify endpoint behavior locally (create/update/reorder/public list).

### Phase 3: Landing Integration

- Add public achievements API/schema/query files in web lib layer.
- Prefetch achievements in landing loader.
- Add homepage Achievements section after Services with premium card-grid UI.

Tests for this phase:

- Run `bun check-types`.
- Verify homepage renders 6 active items with responsive layout.

### Phase 4: Dashboard Feature

- Add dashboard achievements feature module (list, form, detail, columns, lib).
- Add create/edit/view routes.
- Add image upload preview and `isActive` toggle.
- Add drag-and-drop reorder panel and save action bound to reorder API.
- Add sidebar navigation entry.

Tests for this phase:

- Run `bun check-types`.
- Verify CRUD + reorder user flows in dashboard.

### Phase 5: Quality and UI Guideline Audit

- Run lint/type checks and resolve issues.
- Run web-design-guidelines audit on changed UI files and apply fixes.

Tests for this phase:

- Run `bun check-types`.
- Run `bun lint`.
- Confirm no unresolved guideline findings.

## Task Checklist

- [x] Create and maintain this spec during implementation.
- [x] Add DB schema + migration for achievements.
- [x] Implement server achievements module and route registration.
- [x] Implement public landing achievements data + homepage section.
- [x] Implement dashboard achievements CRUD + reorder UX.
- [x] Run validations (`bun db:generate`, `bun check-types`, `bun lint`).
- [x] Run web-design-guidelines audit and fix findings.
