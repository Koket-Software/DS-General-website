# Fix Deploy Path Secret Drift

## Context / Problem

The production deploy workflow still reads `DEPLOY_PATH` from GitHub Actions secrets even though the DS General deployment contract is a fixed VPS checkout at `/opt/ds-general`.

That mismatch allows an incorrect secret value to break the remote deploy before any useful validation runs. The current failure shows the SSH step trying to `cd` into a non-existent path.

## Goals

- Remove deploy-path drift between the workflow and the documented VPS contract.
- Keep production deploys targeting `/opt/ds-general`.
- Improve the remote script failure message when the VPS checkout is missing.

## Non-Goals

- Rework the broader deployment architecture.
- Add automatic server bootstrapping or repo cloning.
- Change Docker Compose runtime behavior.

## Assumptions

- The intended VPS checkout location remains `/opt/ds-general`.
- The server is expected to have the repo cloned and `.env` present in that directory before deploys run.

## Dependencies

- [`.github/workflows/deploy.yml`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.github/workflows/deploy.yml)
- [`docs/deploy_ds.md`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/docs/deploy_ds.md)

## Phases

### Phase 1: Workflow alignment

- [x] Replace secret-driven deploy path configuration with the fixed production path.
- [x] Add an explicit directory existence check before changing directories.
- Tests for this phase: review workflow env usage and remote script path validation.

### Phase 2: Documentation alignment

- [x] Remove the obsolete `DEPLOY_PATH` GitHub secret requirement from the runbook.
- [x] Ensure the runbook still clearly documents the required VPS directory.
- Tests for this phase: compare workflow behavior against the deploy runbook.

### Phase 3: Validation

- [x] Review the changed workflow and docs for consistency.
- Tests for this phase: targeted diff review of workflow and runbook changes.
