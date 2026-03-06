# Landing Asset Budget Fix

## Context / Problem

The `apps/web` performance budget check fails during CI because the largest emitted asset exceeds the configured 4500 KiB cap. The failing file is the landing hero image emitted from `apps/web/assets/84e84a5b62a91fede6dbe871c6fc754cbb26a4fc.png`.

## Goals

- Reduce the largest emitted frontend asset below the configured budget.
- Reduce the oversized main JS chunk enough to remove the Vite chunk warning.
- Preserve the landing page layout and image behavior.
- Verify the fix with the existing `perf:budget` command.

## Non-Goals

- Reworking the landing page design.
- Changing the asset budget thresholds or silencing warnings by raising limits.
- Broad frontend performance refactors unrelated to the failing assets.

## Assumptions

- Converting oversized photographic PNG assets to a more appropriate format will materially reduce bundle asset size without user-visible regressions.
- The landing components can consume `.webp` assets without code changes beyond import paths.

## Dependencies

- Vite static asset handling in `apps/web`.
- Existing perf budget scripts under `apps/web/scripts/`.
- Local image conversion tooling available in the environment.

## Phases

### Phase 1: Identify oversized emitted assets

- [x] Inspect the failing asset references and current build budget checks.
- [x] Confirm which landing page images drive the reported largest assets.
- Tests for this phase: inspect asset references and current size data.

### Phase 2: Optimize oversized landing imagery

- [x] Replace the largest photographic PNG assets with smaller equivalents appropriate for web delivery.
- [x] Update the consuming components to reference the optimized assets.
- Tests for this phase: run the web perf budget build and confirm the largest asset is under budget.

### Phase 3: Validate no regressions in build output

- [x] Split oversized vendor code into stable manual chunks where needed.
- [x] Run the relevant build check(s) and confirm success.
- [x] Review resulting asset sizes for reasonable headroom.
- Tests for this phase: `bun run --filter web perf:budget`.
