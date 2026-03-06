# DS General Production Deployment Runbook

This runbook is for deploying DS General PLC to `https://dsgeneralplc.com` on the existing VPS that already runs Docker and Nginx Proxy Manager.

Production shape:

- Cloudflare points `dsgeneralplc.com` to the VPS
- Nginx Proxy Manager terminates TLS and forwards to `ds-general-web:80`
- `ds-general-web` serves the Vite build and proxies `/api/v1/*` and `/uploads/*` to `ds-general-api`
- `ds-general-api` talks to `ds-general-db` over the internal Docker network
- `ds-general-db` is internal-only and does not bind a host port on the VPS
- GitHub Actions deploys by SSH into `/opt/ds-general`

## 1. Repo state to use

- [x] Use [`.github/workflows/deploy.yml`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.github/workflows/deploy.yml) as the production deploy workflow.
- [x] Use [`docker-compose.prod.yml`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/docker-compose.prod.yml) for the VPS runtime.
- [x] Use [`.env.prod.example`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/.env.prod.example) as the template content for the VPS env file.
- [x] Do not commit a real `.env` or `.env.prod` file to Git.
- [x] Auto-deploy from `main`; use `workflow_dispatch` for the first rollout and manual retries.

## 2. GitHub setup

- [ ] Open the repo in GitHub.
- [ ] Go to `Settings -> Secrets and variables -> Actions`.
- [ ] Add these secrets:
  - [ ] `DEPLOY_HOST`
  - [ ] `DEPLOY_USER`
  - [ ] `DEPLOY_SSH_KEY`
  - [ ] `DEPLOY_PORT`
- [ ] If the repo is private, add a read-only deploy key so the VPS can `git fetch origin main`.
- [ ] Do not add runtime app secrets to GitHub Actions.

The deploy workflow uses the fixed VPS checkout path `/opt/ds-general`. Do not add a separate `DEPLOY_PATH` secret.

What GitHub does on each deploy:

- checks out the repo
- SSHes into the VPS
- verifies `/opt/ds-general/.env` exists
- loads `PROXY_NETWORK` from that env file
- fetches `origin/main`
- resets the VPS checkout to the pushed commit
- runs `docker compose --env-file .env -f docker-compose.prod.yml build`
- runs `docker compose --env-file .env -f docker-compose.prod.yml up -d --remove-orphans`
- prints container status and recent logs

## 3. VPS setup

- [ ] SSH into the VPS.
- [ ] Create the deploy directory:

```bash
mkdir -p /opt/ds-general
```

- [ ] Clone the repo into `/opt/ds-general`.
- [ ] Confirm the deploy user can run Docker.
- [ ] Confirm the VPS can read the repo:

```bash
cd /opt/ds-general
git fetch origin main
```

- [ ] Create the production env file:

```bash
cd /opt/ds-general
cp .env.prod.example .env
chmod 600 .env
```

- [ ] Fill in all real values in `/opt/ds-general/.env`.

Required values for this deployment:

```env
POSTGRES_DB=ds_general
POSTGRES_USER=ds_general
POSTGRES_PASSWORD=<strong-password>
DATABASE_URL=postgresql://ds_general:<strong-password>@ds-general-db:5432/ds_general

NODE_ENV=production
SERVER_PORT=3000

BETTER_AUTH_SECRET=<at-least-32-random-characters>
BETTER_AUTH_URL=https://dsgeneralplc.com
CORS_ORIGIN=https://dsgeneralplc.com,https://www.dsgeneralplc.com

GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>

VITE_SERVER_URL=https://dsgeneralplc.com
VITE_FRONTEND_URL=https://dsgeneralplc.com
VITE_SITE_URL=https://dsgeneralplc.com

SITE_NAME=DS General PLC
SITE_URL=https://dsgeneralplc.com
SITE_TITLE=DS General PLC
SITE_DESCRIPTION=<production-site-description>
TWITTER_HANDLE=@dsgeneralplc

PROXY_NETWORK=<existing-nginx-proxy-manager-network>
```

## 4. Find the shared Docker proxy network

- [ ] Find the running Nginx Proxy Manager container:

```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
```

- [ ] Inspect its attached networks:

```bash
docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}' <npm-container-name>
```

- [ ] Copy that network name into `PROXY_NETWORK` in `/opt/ds-general/.env`.
- [ ] Verify it exists:

```bash
docker network inspect <proxy-network>
```

## 5. Cloudflare setup

- [ ] In Cloudflare DNS, create a proxied `A` record for `@` pointing to the VPS IP.
- [ ] Create a proxied `CNAME` for `www` pointing to `dsgeneralplc.com`.
- [ ] In `SSL/TLS`, set encryption mode to `Full (strict)`.
- [ ] Add a redirect rule from `www.dsgeneralplc.com/*` to `https://dsgeneralplc.com/$1`.
- [ ] Wait for DNS to resolve before troubleshooting the proxy host.

## 6. Nginx Proxy Manager setup

- [ ] Log into Nginx Proxy Manager.
- [ ] Create one Proxy Host for:
  - [ ] `dsgeneralplc.com`
  - [ ] `www.dsgeneralplc.com`
- [ ] Use these proxy settings:
  - [ ] Scheme: `http`
  - [ ] Forward Hostname / IP: `ds-general-web`
  - [ ] Forward Port: `80`
  - [ ] Websockets: enabled
- [ ] Request a Let’s Encrypt certificate.
- [ ] Enable Force SSL after the certificate is issued.

## 7. Google OAuth setup

- [ ] In Google Cloud Console, rotate the secret that was previously committed.
- [ ] Set Authorized JavaScript origins:
  - [ ] `https://dsgeneralplc.com`
  - [ ] `https://www.dsgeneralplc.com`
- [ ] Set Authorized redirect URI:
  - [ ] `https://dsgeneralplc.com/api/v1/auth/callback/google`

## 8. First deploy

- [ ] Run repo validation locally before shipping:

```bash
bun lint
bun check-types
bun build
```

- [ ] In GitHub Actions, trigger `workflow_dispatch` once for the first production rollout.
- [ ] Watch for:
  - [ ] missing `/opt/ds-general/.env`
  - [ ] missing `PROXY_NETWORK`
  - [ ] Git auth failures on the VPS
  - [ ] Docker build failures
  - [ ] container health failures

- [ ] After the workflow finishes, verify on the VPS:

```bash
cd /opt/ds-general
docker compose --env-file .env -f docker-compose.prod.yml ps
docker compose --env-file .env -f docker-compose.prod.yml logs --tail=100
```

## 9. Manual migration and post-deploy tasks

For the first rollout, keep DB migrations manual:

```bash
cd /opt/ds-general
docker compose --env-file .env -f docker-compose.prod.yml exec -T ds-general-api sh -lc 'cd /app && bun run db:migrate'
```

Then verify:

- [ ] `https://dsgeneralplc.com/`
- [ ] `https://dsgeneralplc.com/healthz`
- [ ] `https://dsgeneralplc.com/api/v1/health`
- [ ] `https://dsgeneralplc.com/api/v1/ready`
- [ ] email/password login
- [ ] Google sign-in callback
- [ ] dashboard CRUD
- [ ] uploads via `/uploads/*`

If needed after the first successful deploy:

- [ ] seed baseline data with append mode:

```bash
cd /opt/ds-general
docker compose --env-file .env -f docker-compose.prod.yml exec -T -e ALLOW_SEED=true ds-general-api sh -lc 'cd /app && bun run db:seed:append'
```

- [ ] only use the destructive fresh seed for a brand-new database:

```bash
cd /opt/ds-general
docker compose --env-file .env -f docker-compose.prod.yml exec -T -e ALLOW_SEED=true ds-general-api sh -lc 'cd /app && bun run db:seed'
```

- [ ] create the first admin user
- [ ] confirm uploads persist across restart

## 10. Rollback

If a deploy is bad, roll back directly on the VPS:

```bash
cd /opt/ds-general
git log --oneline -n 10
git reset --hard <good-sha>
docker compose --env-file .env -f docker-compose.prod.yml build
docker compose --env-file .env -f docker-compose.prod.yml up -d --remove-orphans
```

Rollback notes:

- [ ] Do not delete Docker volumes during rollback.
- [ ] Check whether the rollback commit is compatible with the current database schema.
- [ ] Re-run the health and auth checks after rollback.
