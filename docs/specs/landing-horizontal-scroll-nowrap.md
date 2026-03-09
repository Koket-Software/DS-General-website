# Landing Horizontal Scroll No-Wrap

## Context / Problem

- Service card rows intended for horizontal scrolling can still wrap to a new line in some viewports.

## Goals

- Enforce strict single-row horizontal scrolling for service card tracks.
- Prevent card wrapping while preserving current visual styling.

## Non-Goals

- No API or route changes.
- No redesign of card content.

## Phases

### Phase 1: Services Section Track

- [x] Replace inline card flow with explicit no-wrap flex track.
- [x] Ensure cards are non-shrinking items.

### Phase 2: Service Detail Related Track

- [x] Replace inline related-card flow with explicit no-wrap flex track.
- [x] Ensure skeleton and loaded states both follow same no-wrap track behavior.

### Phase 3: Validation

- [x] `bun --filter web check-types`
- [x] `bun lint`

## Task Checklist

- [x] Create spec file.
- [x] Update services section no-wrap behavior.
- [x] Update related services no-wrap behavior.
- [x] Run checks.
