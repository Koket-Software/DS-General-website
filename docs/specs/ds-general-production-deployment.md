# DS General Production Deployment

## Context / Problem

The repo had a generic VPS deployment checklist, a repo-root production env ambiguity, and a GitHub Actions workflow that did not match the actual VPS env file convention.

We need a DS General-specific deployment setup for `dsgeneralplc.com` that is safe to ship and easy to follow for the remaining Cloudflare, VPS, GitHub, and Nginx Proxy Manager steps.

## Goals

- Align the repo with the intended production contract for `dsgeneralplc.com`.
- Stop tracking production runtime secrets.
- Make the VPS deploy workflow use `/opt/ds-general/.env`.
- Rename production Docker identifiers from the template `suba-*` naming to DS General-specific names.
- Replace the generic deployment checklist with a DS General step-by-step runbook.
- Document rollback and manual migration steps.

## Non-Goals

- Provision Cloudflare, the VPS, GitHub secrets, Nginx Proxy Manager, or Google Cloud directly from this repo.
- Add automated DB migrations to the deploy workflow for the first rollout.
- Change the app to use a separate public API subdomain.

## Assumptions

- The production VPS already runs Docker and Nginx Proxy Manager.
- `dsgeneralplc.com` is the canonical host and `www.dsgeneralplc.com` redirects to it.
- Production Postgres will run in the same Docker Compose stack.
- Google OAuth remains enabled at launch.

## Dependencies

- [`.github/workflows/deploy.yml`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.github/workflows/deploy.yml)
- [`.env.prod.example`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.env.prod.example)
- [`docs/deploy_ds.md`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/docs/deploy_ds.md)
- [`README.md`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/README.md)
- [`docker-compose.prod.yml`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/docker-compose.prod.yml)

## Phases

### Phase 1: Repo safety and env contract

- Remove the repo-root production env file from the workspace.
- Keep `.env.prod.example` as the tracked production template.
- Update the production template to the single-domain DS General deployment shape.
- Rename the production Compose project, services, and volumes to DS General-specific identifiers.

Tests for this phase:

- Confirm the repo does not rely on a committed real production env file.
- Confirm `.env.prod.example` still covers all variables used by `docker-compose.prod.yml` and the server env schema.

### Phase 2: Deployment workflow alignment

- Update the GitHub Actions deploy workflow to:
  - trigger automatically from `main`
  - require `.env`
  - load `PROXY_NETWORK` from the VPS env file
  - build and start with `docker compose --env-file .env -f docker-compose.prod.yml`
  - print status and recent logs
- Keep DB migration manual and document the exact command.

Tests for this phase:

- Run workflow YAML validation through the repo checks.
- Confirm the shell script references `.env` consistently.

### Phase 3: Operations documentation

- Replace the generic deployment doc with a DS General runbook.
- Add concrete sections for GitHub, VPS, Cloudflare, Nginx Proxy Manager, Google OAuth, first deploy validation, and rollback.
- Link the deployment runbook from the README.

Tests for this phase:

- Review the runbook for internal consistency with the workflow, Compose file, and env template.

## Task List

- [x] Create this spec before editing repo-tracked files.
- [x] Remove the repo-root production env file and keep `.env.prod.example` as the production template.
- [x] Update `.env.prod.example` for the DS General single-domain production contract.
- [x] Update the deploy workflow to use `/opt/ds-general/.env`.
- [x] Remove GitHub-secret dependency on `PROXY_NETWORK`.
- [x] Document manual DB migration for first rollout.
- [x] Rename production Docker services, upstream targets, and volumes from `suba-*` to `ds-general-*`.
- [x] Rewrite `docs/deploy_ds.md` into a DS General deployment runbook.
- [x] Update `README.md` to point at the DS General deployment runbook and clarify secret handling.
- [x] Run `bun lint`, `bun check-types`, and `bun run build`.
- [x] Document safe production seeding with `db:seed:append` and guarded destructive seeding with `db:seed`.
- [ ] User rotates the previously committed Google OAuth secret in Google Cloud.
- [ ] User adds GitHub Actions secrets and any deploy key required by the VPS.
- [ ] User creates `/opt/ds-general/.env` on the VPS and completes the external rollout steps.
