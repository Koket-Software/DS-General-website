# Auth Login/Register Boxy Cards

## Context / Problem

- Login and register screens still use rounded card corners (`rounded-2xl`), while the requested visual direction is a boxy style.
- This creates a mismatch between the updated square-edge pages and auth entry screens.

## Goals

- Remove rounded corners from the main login card.
- Remove rounded corners from the main register card.
- Keep behavior and layout unchanged.

## Non-Goals

- Redesigning auth page structure, spacing, or typography.
- Changing auth logic, validation, or API behavior.
- Broad global radius changes across all non-landing pages.

## Assumptions

- “Also do the same” here specifically applies to login/register card containers.

## Dependencies

- `apps/web/src/routes/login.lazy.tsx`
- `apps/web/src/routes/register.lazy.tsx`

## Phases

### Phase 1: Implement Card Corner Updates

- [x] Change login card from rounded to square corners.
- [x] Change register card from rounded to square corners.

Phase 1 tests:

- [x] `bun run --filter web check-types`

### Phase 2: Verification + Closeout

- [x] Confirm only login/register card radius classes changed for this task.
- [x] Update checklist and summarize verification.

Phase 2 tests:

- [x] `bun run --filter web check-types`

## Task Checklist

- [x] Create spec.
- [x] Update login/register card corner classes.
- [x] Run validation.
- [x] Mark checklist complete.
