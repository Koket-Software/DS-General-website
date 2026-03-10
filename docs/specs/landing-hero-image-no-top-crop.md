# Landing Hero Image No Top Crop

## Context / Problem

On some viewport sizes, the homepage hero image is cropped at the top. The hero
visual should keep the entire image visible instead of clipping important
content.

## Goals

- Ensure the full hero image remains visible across responsive breakpoints.
- Keep the hero visual in the background media area under the headline content.
- Keep the hero viewport-bound so it does not add extra height beyond the first
  screen.
- Allow the hero image to visually rise into the top area as a background layer
  while keeping text above it.

## Non-Goals

- Redesigning hero copy/layout structure.
- Replacing the hero asset.

## Assumptions

- Current hero wrapper heights are still acceptable for the landing page rhythm.
- Non-cropping display (`object-contain`) is preferred over edge-to-edge crop.

## Dependencies

- `apps/web/src/features/landing/components/hero-section.tsx`

## Phases

### Phase 1: Hero Media Fit Fix

Prepare tests:

- Web TypeScript check (`bun run --cwd apps/web check-types`).

Tasks:

- [x] Change hero image fit from cropping behavior to full-visibility behavior.
- [x] Keep responsive wrapper sizing and overflow handling stable.
- [x] Run `bun run --cwd apps/web check-types`.

### Phase 2: Viewport-Height Layered Hero

Prepare tests:

- Web TypeScript check (`bun run --cwd apps/web check-types`).

Tasks:

- [x] Convert hero to a layered layout with absolute background image and
      elevated content layer (`z-index` separation).
- [x] Set hero section height to viewport-based sizing that accounts for top
      navigation height.
- [x] Ensure the image can extend upward visually (background effect) without
      increasing document flow height.
- [x] Run `bun run --cwd apps/web check-types`.

### Phase 3: Overlay Intensity Tuning

Prepare tests:

- Web TypeScript check (`bun run --cwd apps/web check-types`).

Tasks:

- [x] Reduce hero white overlay intensity to a very light touch.
- [x] Run `bun run --cwd apps/web check-types`.

### Phase 4: Mobile Spacing Regression Fix

Prepare tests:

- Web TypeScript check (`bun run --cwd apps/web check-types`).

Tasks:

- [x] Reduce mobile vertical separation between hero content and image to match
      earlier compact spacing.
- [x] Preserve layered background behavior for `md+` breakpoints.
- [x] Run `bun run --cwd apps/web check-types`.

### Phase 5: Mobile Content/Image Order Fix

Prepare tests:

- Web TypeScript check (`bun run --cwd apps/web check-types`).

Tasks:

- [x] Restore mobile content order to Figma sequence (headline/copy/CTA above
      hero image).
- [x] Keep desktop layered hero behavior unchanged.
- [x] Run `bun run --cwd apps/web check-types`.

### Phase 6: Large-Screen Overlay Scope + Intensity

Prepare tests:

- Web TypeScript check (`bun run --cwd apps/web check-types`).

Tasks:

- [x] Apply the white fade overlay only on `lg+` breakpoints.
- [x] Increase overlay intensity slightly on `lg+`.
- [x] Run `bun run --cwd apps/web check-types`.
