# Fix Setup DB Push ESM

## Context / Problem

Running `bun setup` fails during the "Pushing database schema" step. The current failure path does not print the underlying `drizzle-kit` error, and direct execution of `db:push` fails with an ESM/CJS runtime mismatch (`require is not defined in ES module scope`).

## Goals

- Make `bun setup` complete successfully on a clean machine with Docker running.
- Ensure DB push failures always print the root command output before setup exits.
- Keep root-based env behavior unchanged (`.env`, `.env.prod` at repository root).

## Non-Goals

- Refactoring the overall setup flow or command UX.
- Reworking unrelated DB seed/build logic.
- Introducing app-local env files.

## Assumptions

- PostgreSQL is reachable via the existing `DATABASE_URL` defaults.
- `drizzle-kit` accepts a CommonJS config object via `module.exports`.
- Setup should continue to tolerate seed failures as warnings.

## Dependencies

- `scripts/setup.sh`
- `packages/db/drizzle.config.cjs`
- `packages/db` `db:push` command (`drizzle-kit push`)

## Phases

### Phase 1: Fix Drizzle Config Loading

- [x] Remove the config pattern that triggers the ESM `require` runtime error.
- [x] Preserve environment override support through process env variables.
- Tests for this phase:
- [x] `cd packages/db && bun run db:push`

### Phase 2: Harden Setup Error Capture

- [x] Update `setup.sh` so command-substitution steps capture non-zero exits without `set -e` terminating early.
- [x] Ensure DB push failure output is printed before exiting.
- Tests for this phase:
- [x] `bun setup` (or a targeted failing simulation) prints full failure output.

### Phase 3: Validate End-to-End Setup

- [x] Run `bun setup` and verify schema push succeeds.
- [x] Confirm seed/build sections still execute and setup completes.
- Tests for this phase:
- [x] `bun setup`

## Task Checklist

- [x] Add spec file before code changes.
- [x] Patch drizzle config to avoid ESM runtime error.
- [x] Patch setup script for reliable error reporting.
- [x] Run verification commands and update this checklist.
