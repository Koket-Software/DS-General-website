# Deploy Path Fallback Precedence

## Context / Problem

The deploy workflow was tightened to use the fixed VPS path `/opt/ds-general`, but the desired behavior is slightly different: use `DEPLOY_PATH` when it is intentionally provided, and fall back to `/opt/ds-general` only when it is missing.

## Goals

- Let the deploy workflow honor `DEPLOY_PATH` when it is set.
- Keep `/opt/ds-general` as the safe default path.
- Document the precedence clearly in the deployment runbook.

## Non-Goals

- Rework the deployment process.
- Add server bootstrapping.
- Change Docker Compose behavior.

## Assumptions

- `DEPLOY_PATH` may be configured in GitHub Actions for environments that do not use `/opt/ds-general`.
- The remote server is still expected to have a checked-out repo and `.env` file at the resolved path.

## Dependencies

- [`.github/workflows/deploy.yml`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.github/workflows/deploy.yml)
- [`docs/deploy_ds.md`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/docs/deploy_ds.md)

## Phases

### Phase 1: Workflow update

- [x] Make the workflow pass through `DEPLOY_PATH` from secrets when present.
- [x] Preserve `/opt/ds-general` as the remote-script fallback.
- Tests for this phase: review workflow env and remote script resolution logic.

### Phase 2: Documentation update

- [x] Update the runbook to describe `DEPLOY_PATH` as optional with `/opt/ds-general` as fallback.
- Tests for this phase: compare workflow behavior against the runbook wording.

### Phase 3: Validation

- [x] Review the resulting diff for consistency.
- Tests for this phase: targeted diff review.
