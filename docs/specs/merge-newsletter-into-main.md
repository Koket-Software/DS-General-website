# Merge Newsletter Branch Into Main

## Context / Problem

- Newsletter work exists on `codex/plan-and-build-newsletter-apis` and is not present on `main`.
- The branch diverged from `main`, so replaying commit `8e9ab24` causes predictable conflicts.
- Database migration numbering collides at `0006` between achievements (`main`) and newsletters (branch).

## Goals

- Replay newsletter feature work onto current `main` with linear history.
- Preserve `main` footer refinements while keeping newsletter submit behavior.
- Keep achievements migration as `0006` and renumber newsletter migration to `0007`.
- Land verified changes on `main` and push to `origin/main`.

## Non-Goals

- Rewriting newsletter feature behavior.
- Changing public API shapes beyond the replayed feature.
- Performing post-merge product/UI redesign.

## Assumptions

- Commit to replay is `8e9ab24`.
- Push access to `origin/main` is available.
- Manual smoke checks are tracked but not automated in this pass.

## Dependencies

- Existing server module system in `apps/server/src/modules`.
- Existing web query/data-layer conventions in `apps/web/src/lib` and feature `lib/` folders.
- Drizzle migration pipeline under `packages/db`.

## Phases

### Phase 1: Safety + Branch Setup

- [x] Create backup refs for current `main` and newsletter branch tip.
- [x] Create integration branch from `main`.

Phase 1 tests:

- [x] `git show-ref --verify refs/heads/backup/main-before-newsletter-merge`
- [x] `git show-ref --verify refs/heads/backup/newsletter-before-replay`

### Phase 2: Replay + Conflict Resolution

- [x] Cherry-pick `8e9ab24` onto integration branch.
- [x] Resolve footer conflict using main layout/accessibility + newsletter submission logic.
- [x] Resolve migration metadata conflicts while preserving achievements as `0006`.
- [x] Renumber newsletter migration from `0006_brave_ultimatum` to `0007_brave_ultimatum`.

Phase 2 tests:

- [x] `git status --short` (no unresolved conflicts)
- [x] `git diff --name-only main...HEAD` includes newsletter surfaces

### Phase 3: Metadata Regeneration + Validation

- [x] Regenerate Drizzle migration metadata.
- [x] Run type checks, lint, and server tests.

Phase 3 tests:

- [x] `bun db:generate`
- [x] `bun check-types`
- [x] `bun lint`
- [x] `bun test:server`

### Phase 4: Land on Main

- [ ] Fast-forward `main` to integration branch.
- [ ] Push `main` to `origin`.
- [ ] Optional cleanup: remove stale integration branch/worktree refs.

Phase 4 tests:

- [ ] `git merge --ff-only codex/integrate-newsletter-into-main`
- [ ] `git push origin main`

## Acceptance Criteria

- Newsletter APIs and dashboard surfaces are present on `main`.
- Footer subscribe action is wired to newsletter API and keeps main styling refinements.
- Migrations are sequenced as achievements `0006` then newsletters `0007` with consistent Drizzle metadata.
- Validation commands complete successfully.
