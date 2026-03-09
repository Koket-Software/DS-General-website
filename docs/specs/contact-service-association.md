# Contact Service Association and Detail Status Flow

## Context / Problem

The public contact form currently submits without a required service association, and the dashboard contact module does not clearly expose requested service context in list/detail views. The detail page also lacks a clear, intentional handled/pending action flow for admins.

## Goals

- Require one selected service when submitting a public contact message.
- Match the contact form interaction pattern with service selection chips.
- Surface requested service in dashboard list and detail views.
- Add dashboard service filtering for contact submissions.
- Improve detail page status control to explicit one-click actions.
- Keep message input as a multiline textarea.

## Non-Goals

- No database schema migration (service foreign key already exists on contacts).
- No change to contacts authorization model.
- No multi-service association per contact.

## Assumptions

- Service association is single-select and required for new public submissions.
- Existing contact rows with `null` service remain valid and display as `Unspecified`.
- Public services endpoint is the source for form service options.

## Dependencies

- Backend contacts validators (`apps/server/src/modules/contacts/validators.ts`)
- Landing contact form and route loader
- Dashboard contacts schema/query/table/detail components
- Existing contacts repository service join behavior

## Phases

### Phase 1: Spec + Backend Contract Alignment

- [x] Create this spec file.
- [x] Require `serviceId` in backend create contact schema.
- [x] Keep service existence check in repository unchanged.

Phase 1 tests:

- [ ] Backend validation rejects create payload without `serviceId`.
- [ ] Backend validation rejects invalid `serviceId`.
- [ ] Backend accepts valid `serviceId`.

### Phase 2: Public Contact Form Service Selection

- [x] Load public services in contact form.
- [x] Render single-select service chips with active state.
- [x] Make service selection required before submit.
- [x] Submit selected `serviceId` with message.
- [x] Keep message input as multiline textarea with larger height.
- [x] Prefetch services in contact route loader.

Phase 2 tests:

- [ ] Contact form blocks submit until service is selected.
- [ ] Selected chip is visually distinct and updates selection correctly.
- [ ] Successful submit contains selected `serviceId`.
- [ ] Message field is multiline textarea.

### Phase 3: Dashboard Service Visibility + Filtering

- [x] Update dashboard contact schema/types to include optional service summary.
- [x] Remove incorrect required `updatedAt` from dashboard contact schema.
- [x] Add service column in contact list with `Unspecified` fallback.
- [x] Add service filter control mapped to `serviceId` query param.
- [x] Ensure route search parsing supports `serviceId`.

Phase 3 tests:

- [ ] Service column shows correct service title when present.
- [ ] Null service rows show `Unspecified`.
- [ ] Selecting a service filter updates results.
- [ ] Clearing filter restores unfiltered list.

### Phase 4: Detail Page Status Action UX

- [x] Replace weak detail status behavior with explicit one-click action.
- [x] Show current status badge on detail page.
- [x] Add action button: `Mark as Handled` / `Mark as Pending`.
- [x] Disable action during pending mutation and show feedback.
- [x] Keep detail/list cache consistency after status changes.
- [x] Show requested service in detail view.

Phase 4 tests:

- [ ] Detail status badge reflects current contact state.
- [ ] One-click toggle works pending -> handled.
- [ ] One-click toggle works handled -> pending.
- [ ] Duplicate clicks are prevented while mutation is pending.
- [ ] List and detail views stay in sync after update.

## Validation Commands

- [x] `bun check-types`
- [x] `bun lint`
