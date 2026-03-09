# OAuth Social Callback Frontend Origin

## Context / Problem

Google OAuth succeeds, but post-auth redirect lands on the API server origin (`http://localhost:3000/dashboard`) and returns `404 NOT_FOUND` because `/dashboard` is a frontend route, not an API route.

## Goals

- Ensure Google social login redirects to the frontend dashboard route.
- Keep behavior consistent for both login and registration flows.
- Avoid changing backend auth route wiring.

## Non-Goals

- Refactoring Better Auth client initialization.
- Changing backend module routing or fallback behavior.
- Adding new auth providers.

## Assumptions

- Frontend runs on browser-accessible origin (for local dev usually `http://localhost:5173` or `http://localhost:3001`).
- API server remains at `http://localhost:3000` in local development.
- `window.location.origin` is the intended frontend callback origin at runtime.

## Dependencies

- Better Auth social sign-in invocation in web routes.
- Existing auth configuration and Google OAuth redirect URI setup already fixed.

## Phases

### Phase 1: Frontend OAuth Callback Fix

- [x] Update login social sign-in callback URL to absolute frontend origin.
- [x] Update register social sign-in callback URL to absolute frontend origin.
- [x] Keep destination path as `/dashboard`.

Tests for this phase:

- [x] `bun run --filter web check-types`

## Task List

- [x] Implement callback URL updates in login/register routes.
- [x] Run type checks for web app.
- [x] Mark all completed tasks.
