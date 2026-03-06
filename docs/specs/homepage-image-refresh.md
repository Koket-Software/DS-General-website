# Homepage Image Refresh

## Context / Problem

The landing page hero section and the CTA section after the FAQ currently use older hashed image assets. New branded assets are available under `apps/web/src/assets/ds/home/` and should replace the current images without changing the section layouts or content.

## Goals

- Update the homepage hero section to use `DS_Hero.webp`.
- Update the homepage CTA section after the FAQ to use `DS_CTA.webp`.
- Preserve the existing layout, copy, and responsive behavior.

## Non-Goals

- Redesigning the hero or CTA layouts.
- Changing section copy, spacing, or CTA behavior.
- Updating any other homepage imagery.

## Assumptions

- `apps/web/src/assets/ds/home/DS_Hero.webp` and `apps/web/src/assets/ds/home/DS_CTA.webp` are the intended final assets.
- Existing alt text can be kept unless a more accurate description is obvious from current usage.

## Dependencies

- `apps/web/src/features/landing/components/hero-section.tsx`
- `apps/web/src/features/landing/components/cta-section.tsx`
- `apps/web/src/assets/ds/home/DS_Hero.webp`
- `apps/web/src/assets/ds/home/DS_CTA.webp`

## Phases

### Phase 1: Asset swap

- Replace the current hero image import with `DS_Hero.webp`.
- Replace the current CTA image import with `DS_CTA.webp`.
- Confirm the sections still render with unchanged structure.

Tests for this phase:

- Run a relevant type check for the web app.

## Tasks

- [x] Identify the homepage hero and CTA components using the current assets.
- [x] Add the new imports and swap the rendered image sources.
- [x] Run validation for the affected frontend code.
