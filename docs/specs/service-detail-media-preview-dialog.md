# Service Detail Media Preview Dialog

## Context / Problem

- Service detail page shows service images inline but does not use the shared `MediaPreviewDialog` interaction.

## Goals

- Use the shared media preview dialog for service images on the service detail page.
- Allow opening the dialog from service image tiles.
- Keep existing service page visual language and data flow.

## Non-Goals

- No API changes.
- No route changes.
- No redesign of card/gallery layout.

## Phases

### Phase 1: Wire Preview Items

- [x] Build preview item list from ordered service images.
- [x] Add dialog open/close state and active index handling.

### Phase 2: Connect UI Triggers

- [x] Make service gallery images open preview dialog on click.
- [x] Keep accessibility semantics for interactive images.

### Phase 3: Validation

- [x] `bun --filter web check-types`
- [x] `bun lint`

## Task Checklist

- [x] Create spec file.
- [x] Wire preview state and items.
- [x] Connect image click triggers.
- [x] Run checks.
