# Auth Last Used Sign-In Method

## Context / Problem

The login and registration screens offer both email/password and Google sign-in, but they do not show which option the user last used successfully. That makes repeat sign-in slightly slower and forces users to recall which route they used previously.

## Goals

- Persist the last used auth method on the client in a simple, low-risk way.
- Show a clear "Last Used" indicator on the relevant auth option.
- Reuse the same logic across login and registration screens.

## Non-Goals

- Store auth method history in the database.
- Change Better Auth session or account schema.
- Infer the auth method from server-side account metadata.

## Assumptions

- A browser-local indicator is sufficient for this UX.
- `email` and `google` are the only sign-in methods currently exposed in the UI.
- For Google OAuth, recording the user’s selected method before redirect is acceptable for this release.

## Dependencies

- [`apps/web/src/routes/login.lazy.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/routes/login.lazy.tsx)
- [`apps/web/src/routes/register.lazy.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/routes/register.lazy.tsx)
- [`apps/web/src/components/ui/badge.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/components/ui/badge.tsx)

## Phases

### Phase 1: Client persistence and UI indicator

- Add a shared client helper to read and write the last used auth method from `localStorage`.
- Update login and register flows to persist the chosen method.
- Render a "Last Used" badge beside the previously used sign-in option.

Tests for this phase:

- Run workspace type checks.
- Confirm both auth screens compile against the shared helper types.

## Task List

- [x] Create this spec before editing repo-tracked files.
- [x] Add a shared client helper for last used auth method persistence.
- [x] Show the "Last Used" indicator on login and registration screens.
- [x] Run type checks.
