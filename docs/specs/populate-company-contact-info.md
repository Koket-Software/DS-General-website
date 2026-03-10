# Populate Company Contact Info Across Dummy Placeholders

## Context / Problem

The website still contains placeholder contact details in multiple surfaces (landing contact sections, legal pages, template config, and legacy import pages). The provided company contact details should replace these dummy values so visitors see consistent, real contact information.

## Goals

- Replace placeholder contact values with the canonical company details:
  - Phone: `+251975888833`
  - Email: `info@dsgeneralplc.com`
  - Address: `Gazebo Roundabout, NK Building 5th floor, Addis Ababa`
- Keep all user-facing contact touchpoints consistent.
- Remove known placeholder strings (e.g., `contact@dsgeneralplc.com`, `+251 90 000 0000`, `[Insert Office Location, Addis Ababa, Ethiopia]`, `Addis Abeba, Ethiopia`) from active web source.

## Non-Goals

- Refactoring contact submission APIs or form validation.
- Changing social links or non-contact business content.
- Modifying legal text beyond contact detail lines.

## Assumptions

- The three values supplied by the user are the single source of truth for company contact details.
- Legacy `apps/web/imports/*` screens should also be updated to avoid stale placeholder content if reused.

## Dependencies

- `apps/web/src/config/template.ts`
- `apps/web/src/features/landing/components/contact-section.tsx`
- `apps/web/src/features/landing/components/sourcing-logistics-section.tsx`
- `apps/web/src/features/landing/legal/privacy-policy-page.tsx`
- `apps/web/imports/ContactUs.tsx`
- `apps/web/imports/School.tsx`
- `apps/web/imports/PrivacyPolicy.tsx`

## Phases

### Phase 1: Identify Placeholder Surface Area

- [x] Confirm all files containing dummy contact values.
- [x] Validate active-route files versus legacy import files.

Tests for Phase 1:

- [x] `rg` checks for known placeholder strings.

### Phase 2: Replace Contact Placeholders

- [x] Update template/company config values.
- [x] Update landing contact and sector fallback contact values.
- [x] Update legal privacy policy contact block.
- [x] Update matching legacy import page placeholders.

Tests for Phase 2:

- [x] `rg` checks show canonical contact values in updated files.
- [x] `rg` checks show old placeholder values removed from updated files.

### Phase 3: Validation

- [x] Run type validation for the web workspace (or document blocker).
- [x] Re-check spec checklist and mark completion.

Tests for Phase 3:

- [x] `bun check-types` (or equivalent web type-check command) completes successfully.

## Task Checklist

- [x] Create spec.
- [x] Implement contact data replacements.
- [x] Run validation checks.
- [x] Update checklist to complete.
