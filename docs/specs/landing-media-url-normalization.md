# Landing Media URL Normalization

## Context / Problem

- Uploaded media renders in dashboard views but fails on landing pages for multiple modules.
- Public landing APIs often return relative media paths (for example `/uploads/...`).
- Many landing components use raw API media fields directly as image `src`, causing broken images when frontend and API origins differ.

## Goals

- Normalize landing media paths to absolute URLs consistently.
- Fix image rendering across landing modules (gallery, blogs, services, and similar media fields).
- Apply fix centrally to reduce repeated path handling in components.

## Non-Goals

- No backend API contract changes.
- No redesign of landing UI.
- No dashboard media workflow changes.

## Assumptions

- `API_BASE_URL` is the correct origin for relative media assets.
- Public landing data is fetched through `/api/v1/*/client` endpoints.

## Phases

### Phase 1: Shared Media URL Utility

- [x] Add a shared utility to resolve relative asset paths to absolute URLs.
- [x] Add deep normalization helper for common media keys (`*Image*`, `*Url`, `imageUrls`, etc.).

Tests:

- [ ] Relative media path resolves against `API_BASE_URL`.
- [ ] Absolute/data/blob URLs are preserved.

### Phase 2: Centralized Landing Response Normalization

- [x] Apply normalization in shared axios response handling for client endpoints.
- [x] Ensure transformed responses are returned unchanged for non-media fields.

Tests:

- [ ] Landing responses for blogs/gallery/services produce absolute media URLs.
- [ ] Non-client endpoints remain unaffected.

### Phase 3: Validation

- [x] Run static checks.

Tests:

- [x] `bun --filter web check-types`
- [x] `bun lint`

## Task Checklist

- [x] Create spec file.
- [x] Add media URL utilities.
- [x] Wire centralized response normalization.
- [x] Run checks.
