# Dashboard Detail Preview Parity

## Context / Problem

Dashboard detail pages are inconsistent across modules. Blogs and several newer modules use a polished detail layout with clear spacing and preview panels, while Achievements, Contact Us, Partners, and Testimonials still rely on compact single-column forms with minimal or missing preview experiences. Contact Us also has an incomplete create route placeholder and lacks edit navigation from the list table.

## Goals

- Deliver consistent detail UX parity for Achievements, Contact Us, Partners, and Testimonials across `create`, `edit`, and `view` routes.
- Reuse shared dashboard detail layout components to avoid duplicated page structure logic.
- Provide live, read-only preview sections for each module.
- Complete Contact Us route and list action wiring for proper create/edit flows.
- Align changed UI with web interface guideline expectations for spacing, semantics, and interaction clarity.

## Non-Goals

- Backend API contract or schema changes.
- Data model redesign for any of the four modules.
- Cross-module refactors outside the four scoped dashboard modules.

## Assumptions

- "Proper preview" means live visual summary of current form state, not server-generated preview data.
- Existing mutation/query behavior and success/error messages should remain unchanged unless needed for route consistency and cache correctness.
- Dashboard uses the same shell behavior pattern as existing blog/product detail pages (sticky header, split desktop panes, mobile stacked content).

## Dependencies

- `apps/web/src/features/dashboard/components/*`
- `apps/web/src/features/dashboard/achievements/*`
- `apps/web/src/features/dashboard/contact-us/*`
- `apps/web/src/features/dashboard/partners/*`
- `apps/web/src/features/dashboard/testimonials/*`
- `apps/web/src/routes/dashboard/contact-us/*`

## Phases

### Phase 1: Shared Detail Shell and Preview Primitives

- Add a reusable dashboard detail page shell with:
  - Sticky header (title, back button, primary submit action)
  - Desktop two-pane layout (form + preview)
  - Mobile stacked preview below form
  - Standardized paddings and scroll behavior
- Add reusable preview card/section primitives for consistent preview styling.

Tests for this phase:

- Run `bun --filter web check-types`.

### Phase 2: Form Refactor + Module Previews

- Refactor `AchievementForm`, `ContactUsForm`, `PartnerForm`, and `TestimonialForm` to use the shared shell.
- Keep mode behaviors:
  - `view` is read-only
  - delete remains available in `view`
  - existing submit/toast/navigation semantics preserved
- Add module preview sections:
  - Achievement: image, title, description, position, status
  - Contact: full name, contact, message, service id, status
  - Partner: logo, title, website, description
  - Testimonial: company/logo, comment, spokesperson, partner, headshot

Tests for this phase:

- Run `bun --filter web check-types`.
- Run `bun --filter web lint`.

### Phase 3: Contact Us Routing + Table Actions + Create Mutation Cleanup

- Replace `/dashboard/contact-us/create` placeholder with `ContactUsForm mode="create"`.
- Add list toolbar create action and row-level edit action for Contact Us.
- Update contact columns signature to include `onEdit`.
- Add admin-side create contact mutation path in contact query/api layer and invalidate relevant list/detail keys after create.

Tests for this phase:

- Run `bun --filter web check-types`.
- Run `bun --filter web lint`.
- Manual dashboard verification for Contact Us create/edit/view flow.

### Phase 4: Web Interface Guideline Audit on Changed Files

- Review changed UI code against latest web interface guideline command.
- Address discovered issues in changed files where practical without broad unrelated refactors.

Tests for this phase:

- Re-run `bun --filter web check-types`.
- Re-run `bun --filter web lint`.

## Tasks

- [x] Create spec and confirm scope, phases, and test gates.
- [x] Implement shared detail shell and preview primitives.
- [x] Refactor Achievement form and add module preview.
- [x] Refactor Contact Us form and add module preview.
- [x] Refactor Partner form and add module preview.
- [x] Refactor Testimonial form and add module preview.
- [x] Wire Contact Us create route to real form.
- [x] Add Contact Us create and edit table actions.
- [x] Add Contact Us admin create mutation + cache invalidation.
- [x] Run type-check and lint.
- [x] Perform web guideline audit on changed files.
