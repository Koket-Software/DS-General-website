# Fix GitHub Actions Main Deploy

## Context / Problem

Pushes to `main` are expected to deploy the production stack, but the current GitHub Actions deploy workflow relies on job-level environment variables inside the remote SSH script without explicitly forwarding them to `appleboy/ssh-action`.

That creates a mismatch between the workflow contract and runtime behavior on the VPS. The branch trigger is already present, but the deploy step can still fail or silently use fallbacks instead of the intended values.

## Goals

- Keep automatic deploys on pushes to `main`.
- Make the SSH deploy step receive the intended environment values reliably.
- Preserve the existing VPS deployment contract around `/opt/ds-general/.env`.
- Validate the workflow with the repo’s existing checks.

## Non-Goals h

- Rework the production deployment architecture.
- Introduce automated database migrations.
- Change the VPS runtime layout or Docker Compose topology.

## Assumptions

- GitHub Actions is enabled for the repository.
- The required deployment secrets already exist in the repository settings.
- The VPS checkout and Docker runtime are otherwise set up correctly.

## Dependencies

- [`.github/workflows/deploy.yml`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.github/workflows/deploy.yml)
- [`docs/deploy_ds.md`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/docs/deploy_ds.md)

## Phases

### Phase 1: Workflow fix

- Forward deploy-time environment variables to the SSH action explicitly.
- Keep the `push` trigger scoped to `main`.
- Avoid changing the deploy script’s behavior beyond the broken variable handoff.

Tests for this phase:

- Run formatting/lint validation on the workflow file.
- Confirm the SSH action now receives the variables used in the remote script.

### Phase 2: Documentation alignment

- Update the deployment runbook if it describes behavior affected by the workflow fix.

Tests for this phase:

- Review the runbook wording against the workflow.

## Task List

- [x] Create this spec before editing repo-tracked files.
- [x] Patch the deploy workflow to forward required env vars into the SSH action.
- [x] Align deployment docs if needed.
- [x] Run targeted validation for the workflow changes.
