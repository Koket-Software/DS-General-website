# Unified Media Preview Component

## Context / Problem

The landing gallery currently renders media as non-interactive tiles, so users cannot inspect assets in a focused preview experience. There is no shared component that can preview both image and video assets across landing and dashboard surfaces, which encourages one-off implementations.

## Goals

- Create a reusable, shared media preview dialog component for image and video assets.
- Support polished interactions: click-to-open, keyboard navigation, previous/next controls, and thumbnail strip.
- Keep the API generic so any feature (gallery and future media surfaces) can adopt it with minimal wiring.
- Integrate the component into the landing gallery immediately as the first consumer.

## Non-Goals

- Reworking gallery backend contracts or adding new media fields at the API layer.
- Refactoring every existing dashboard/media view in this single task.
- Introducing new dependencies for lightbox/video playback.

## Assumptions

- Current public gallery payload provides image URLs; video support will be enabled via component API for routes that already have video URLs.
- Existing design tokens and dialog primitives should remain the foundation for visual consistency.
- The component should remain controlled/uncontrolled friendly through simple props rather than global state.

## Dependencies

- `apps/web/src/components/ui/dialog.tsx`
- `apps/web/src/components/common/AppImage.tsx`
- `apps/web/src/features/landing/components/gallery-section.tsx`
- `apps/web/src/index.css`

## Phases

### Phase 1: Shared Component

- Add a shared media preview dialog component under `apps/web/src/components/common/`.
- Implement image/video rendering, keyboard navigation, and thumbnail selection.
- Add reusable media types and helper behavior for cross-feature usage.

Tests for this phase:

- Run `bun --filter web check-types`.

### Phase 2: Landing Gallery Adoption

- Wire the gallery grid tiles to open the shared media preview dialog.
- Ensure mobile and desktop layouts are usable and visually polished.
- Validate accessibility basics (focus, labels, keyboard controls) and guideline compliance.

Tests for this phase:

- Run `bun --filter web check-types`.
- Run `bun x eslint apps/web/src/components/common/MediaPreviewDialog.tsx apps/web/src/features/landing/components/gallery-section.tsx`.

## Tasks

- [x] Create spec and confirm architecture/test plan.
- [x] Implement shared media preview dialog component with image/video support.
- [x] Integrate shared preview into landing gallery item click flow.
- [x] Run type-check/lint and address any issues.
- [x] Audit updated UI against latest web design guidelines.
