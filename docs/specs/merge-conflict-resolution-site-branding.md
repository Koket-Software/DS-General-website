# Merge Conflict Resolution Site Branding

## Context / Problem

A merge introduced unresolved conflicts across server SSR/OG templates and web site routes/index metadata. The repository currently has unmerged paths (`UU`/`DU`), blocking normal development commands and commits.

## Goals

- Resolve all Git conflict markers and unmerged entries.
- Preserve the `_site` route structure and keep working route modules consistent.
- Keep branding/SEO SSR and OG template changes that are compatible with current module imports/types.
- Leave the repo in a merge-resolved state (`git ls-files -u` empty).

## Non-Goals

- Refactoring unrelated route or API logic.
- Redesigning metadata/branding content beyond conflict reconciliation.
- Addressing pre-existing lint/type issues unrelated to this merge.

## Assumptions

- `_site` route tree is the canonical route location over legacy `demo` routes.
- New shared branding config files added in this merge should remain.
- Conflicting hunks can be merged by combining logic where there is no semantic collision.

## Dependencies

- Existing route modules in `apps/web/src/routes/_site`.
- SSR and OG template types in `apps/server/src/modules/ssr` and `apps/server/src/modules/og-image`.
- Git merge index state for stage/resolve verification.

## Phases

### Phase 1: Inspect and Decide Per-File Resolution

- [x] Review each conflicting hunk and choose `ours`, `theirs`, or merged content.
- [x] Confirm handling for `DU` paths under `apps/web/src/routes/demo` and `apps/web/src/routes/index.tsx`.
- Tests for this phase:
- [x] `git ls-files -u` reviewed with a per-file resolution decision.

### Phase 2: Apply Conflict Resolutions

- [x] Edit all conflicted files and remove conflict markers.
- [x] Keep route import targets aligned to `_site` paths and existing exports.
- [x] Stage resolved files so Git marks conflicts as resolved.
- Tests for this phase:
- [x] `rg "^(<<<<<<<|=======|>>>>>>>)" .` returns no matches.
- [x] `git ls-files -u` returns no entries.

### Phase 3: Verify Build Safety

- [x] Run targeted type checks (or project type check if practical) to catch merge regressions.
- [x] Summarize any remaining non-conflict issues for follow-up.
- Tests for this phase:
- [x] `bun check-types`

## Task Checklist

- [x] Add spec for merge resolution.
- [x] Resolve all `UU` files.
- [x] Resolve all `DU` files appropriately.
- [x] Stage all resolved files.
- [x] Run verification commands and update checklist.
