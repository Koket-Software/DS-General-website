# Landing Legal Pages Shared Layout

## Context / Problem

- The public `Terms of Service` and `Privacy Policy` pages currently duplicate the same page shell (title/date block, two-column content with sticky table of contents, section scroll behavior).
- This duplication increases maintenance cost and risks visual/behavior drift when legal page UI is updated.
- Footer legal links should reliably route to these pages.

## Goals

- Extract one reusable legal page layout component for shared structure and interactions.
- Keep distinct page content for Terms and Privacy while reusing the same UI shell.
- Ensure footer links navigate to `/terms-of-service` and `/privacy-policy`.

## Non-Goals

- Rewriting legal copy beyond minor correctness fixes needed for section labels.
- Changing overall landing layout, navigation, or global design tokens.
- Introducing backend/API changes.

## Assumptions

- TanStack Router file routes for legal pages already exist and should be preserved.
- Current sticky sidebar + smooth-scroll behavior should remain functionally equivalent.

## Dependencies

- [`apps/web/src/features/landing/legal/terms-of-service-page.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/features/landing/legal/terms-of-service-page.tsx)
- [`apps/web/src/features/landing/legal/privacy-policy-page.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/features/landing/legal/privacy-policy-page.tsx)
- [`apps/web/src/features/landing/components/footer.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/features/landing/components/footer.tsx)
- [`apps/web/src/routes/_landing/terms-of-service.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/routes/_landing/terms-of-service.tsx)
- [`apps/web/src/routes/_landing/privacy-policy.tsx`](/Users/negusnati/Documents/dev/koket/ds-general/DS-General-website/apps/web/src/routes/_landing/privacy-policy.tsx)

## Phases

### Phase 1: Shared Legal Layout Component

- [x] Create a reusable component in landing legal feature area that accepts page metadata and section content.
- [x] Centralize active-section tracking and scroll-to-section behavior in the shared component.

Tests for this phase:

- Type-check updated legal feature files.
- Verify no duplicate layout logic remains in terms/privacy pages.

### Phase 2: Refactor Legal Pages and Route Wiring Validation

- [x] Refactor `TermsOfServicePage` and `PrivacyPolicyPage` to use shared layout component.
- [x] Keep and validate route files for `/terms-of-service` and `/privacy-policy`.
- [x] Confirm footer links point to both legal routes.

Tests for this phase:

- `bun --filter web check-types`
- `bunx eslint apps/web/src/features/landing/legal apps/web/src/features/landing/components/footer.tsx --max-warnings=0 --no-warn-ignored` (workspace has no `web lint` script)

## Task List

- [x] Create spec file before implementation edits.
- [x] Implement shared legal layout component.
- [x] Refactor terms and privacy pages to consume shared layout.
- [x] Validate footer legal links.
- [x] Run and pass relevant checks.
