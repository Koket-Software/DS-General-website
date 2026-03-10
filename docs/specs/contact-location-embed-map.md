# Contact Location Embed Map

## Context / Problem

The landing Contact Us page currently shows a static location image in the location section. We need to use the provided Google Maps embed iframe instead so users can view and interact with the exact map location.

## Goals

- Replace the static map image with the provided Google Maps embed iframe on the landing Contact Us page.
- Keep existing responsive spacing and visual structure for desktop and mobile.
- Preserve accessibility with an appropriate iframe title.

## Non-Goals

- No redesign of the Contact Us page layout.
- No changes to contact form behavior, backend APIs, or data fetching.
- No changes to other pages or dashboard contact screens.

## Assumptions

- The provided iframe URL is approved for public embedding.
- Existing container heights (`h-87.5`, `md:h-120.25`) should remain unchanged.

## Dependencies

- `apps/web/src/features/landing/components/contact-section.tsx`
- Existing Tailwind utility classes used in the contact section.

## Phases

### Phase 1: Replace media block with embed iframe

- Swap the static `<img>` map element with an `<iframe>` using the provided embed source.
- Remove now-unused static image import.
- Ensure iframe fills the existing container and includes `loading="lazy"`, `referrerPolicy`, and `allowFullScreen`.

### Phase 2: Validate and verify

- Run targeted checks for the updated file via lint/type tooling.
- Confirm no regressions in Contact Us page rendering.

## Task List

- [x] Create spec document.
- [x] Replace static location image with embedded Google Map iframe.
- [x] Remove dead imports caused by the change.
- [x] Run validation checks (`bun check-types`, `bun lint` or scoped equivalent).
- [x] Mark tasks complete after successful verification.
