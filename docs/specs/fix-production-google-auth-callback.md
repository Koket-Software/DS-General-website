# Fix Production Google Auth Callback

## Context / Problem

Production Google sign-in is being initiated from the public auth route namespace `/api/v1/auth`, but the Better Auth server config still uses the default Better Auth base path. As a result, the generated Google OAuth `redirect_uri` points to `/api/auth/callback/google` instead of the public mounted route `/api/v1/auth/callback/google`.

That mismatch currently works only because the server performs a legacy redirect from `/api/*` to `/api/v1/*`. It adds an extra redirect in the OAuth callback path and makes the production auth flow harder to reason about while debugging the deployed warning.

## Goals

- Make Better Auth generate production OAuth callbacks under `/api/v1/auth`.
- Align the server-side Better Auth config with the client auth base path.
- Keep legacy `/api/auth/*` auth requests working as a compatibility path while production credentials are updated.
- Document the production validation needed after the change.

## Non-Goals

- Remove or redesign the legacy `/api` redirect middleware outside the auth namespace.
- Resolve external Safe Browsing reputation issues directly from the repo.
- Change the public site domain or split auth onto a separate subdomain.

## Assumptions

- The public auth routes should remain exposed at `/api/v1/auth/*`.
- Google OAuth credentials can be updated in Google Cloud to match the public callback path exactly.
- The current browser warning is separate from TLS and may persist until Google/browser reputation caches are cleared.

## Dependencies

- [`packages/auth/src/index.ts`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/packages/auth/src/index.ts)
- [`apps/server/src/core/app.ts`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/server/src/core/app.ts)
- [`apps/web/src/lib/auth-client.ts`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/lib/auth-client.ts)

## Phases

### Phase 1: Auth path alignment

- Configure Better Auth to use `/api/v1/auth` as its base path.
- Keep the existing public route mounting consistent with the generated callback URL.
- Bypass the generic legacy API redirect for `/api/auth/*` so legacy auth callbacks can still be handled directly during rollout.

Tests for this phase:

- Confirm the generated Google auth URL now uses `/api/v1/auth/callback/google`.
- Confirm legacy `/api/auth/*` auth requests are handled by Better Auth instead of the generic `/api` to `/api/v1` redirect.
- Run type checks for the workspace.

## Task List

- [x] Create this spec before editing repo-tracked files.
- [x] Centralize Better Auth base path usage to avoid future client/server drift.
- [x] Keep `/api/auth/*` mapped directly to Better Auth as a compatibility route.
- [x] Run type checks.
- [x] Summarize the operational follow-up required in Google Cloud.
