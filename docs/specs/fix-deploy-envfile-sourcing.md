# Fix Deploy Envfile Sourcing

## Context / Problem

The deploy workflow currently loads the production env file by sourcing it in Bash. That breaks when valid Compose env-file values contain spaces, such as `SITE_NAME=DS General PLC`.

## Goals

- Stop executing the deployment env file as shell code.
- Continue validating `PROXY_NETWORK` before running Docker Compose.
- Keep the deploy workflow compatible with standard Compose env-file syntax.

## Non-Goals

- Rewrite the production env template.
- Change application runtime env handling.
- Rework the deployment flow beyond env-file parsing.

## Assumptions

- The deploy step only needs to read `PROXY_NETWORK` before Compose starts.
- `docker compose --env-file` remains the source of truth for service env loading.

## Dependencies

- [`.github/workflows/deploy.yml`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.github/workflows/deploy.yml)
- [`.env.prod.example`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.env.prod.example)
- [`docs/deploy_ds.md`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/docs/deploy_ds.md)

## Phases

### Phase 1: Workflow fix

- [x] Replace shell sourcing with safe extraction of `PROXY_NETWORK` from the env file.
- [x] Preserve the existing validation and Docker Compose commands.
- Tests for this phase: inspect the remote script logic against env-file syntax.

### Phase 2: Documentation alignment

- [x] Document that the deploy env file follows Compose env-file rules and is not shell-sourced.
- Tests for this phase: compare workflow behavior to runbook wording.

### Phase 3: Validation

- [x] Review the final diff for consistency.
- Tests for this phase: targeted diff review.
