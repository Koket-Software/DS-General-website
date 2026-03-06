# Google Social Login Dashboard Redirect

## Context / Problem

Google social auth currently returns users to `/` after authentication. The expected post-login destination for admin users is `/dashboard`.

## Goals

- Ensure Google sign-in initiated from auth pages redirects to `/dashboard` after successful authentication.
- Keep existing auth behavior (loading states, error handling, and last-used method tracking) unchanged.

## Non-Goals

- No backend Better Auth route changes.
- No redesign of login/register pages.
- No changes to email/password sign-in flow.

## Assumptions

- Better Auth social sign-in supports an explicit callback URL parameter.
- `/dashboard` remains the canonical authenticated entry point.

## Dependencies

- `apps/web/src/routes/login.lazy.tsx`
- `apps/web/src/routes/register.lazy.tsx`

## Phases

### Phase 1: Social callback update

- Add explicit callback URL for Google social sign-in on login route.
- Mirror the callback on register route to keep social auth destination consistent.

Tests for this phase:

- `bun run --filter web check-types`

### Phase 2: Validation

- Verify type safety and compile-time correctness for updated social sign-in calls.

Tests for this phase:

- `bun run --filter web check-types`

## Task List

- [x] Create this spec before editing code.
- [x] Update Google social sign-in callback on login route.
- [x] Update Google social sign-in callback on register route.
- [x] Run `bun run --filter web check-types`.
- [x] Mark checklist completed after verification.
