# Contact Map Spacing Gap

## Context / Problem

After replacing the static map with an embedded Google map, the map appears too close to the contact form section.

## Goals

- Add clear vertical spacing between the contact form block and the map block on the landing Contact Us page.
- Preserve existing responsive layout and map dimensions.

## Non-Goals

- No changes to form logic, map embed source, or page structure.

## Assumptions

- A modest responsive top margin on the map wrapper provides the desired separation.

## Dependencies

- `apps/web/src/features/landing/components/contact-section.tsx`

## Phases

### Phase 1: UI spacing adjustment

- Add responsive top margin to the map container directly below the form area.

### Phase 2: Verification

- Run lint to ensure class/order/style changes remain valid.

## Task List

- [x] Create spec document.
- [x] Add spacing between form and map containers.
- [x] Run validation checks.
- [x] Mark tasks complete.
