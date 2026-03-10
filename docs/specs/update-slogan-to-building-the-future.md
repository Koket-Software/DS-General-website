# Update Brand Slogan To "We're Building the Future"

## Context / Problem

Brand copy still uses older tagline phrases such as `Reliable Trade Solutions Across Borders` and `Integrated Business & Industrial Solutions` across landing and metadata surfaces. The company slogan is now `We're Building the Future`.

## Goals

- Replace slogan-like copy with the canonical slogan: `We're Building the Future`.
- Keep title/meta/branding strings consistent with the new slogan.
- Update both active UI and legacy import surfaces where old phrase text appears.
- Align root env metadata titles (`SITE_TITLE`, `VITE_SITE_TITLE`) with the same slogan.

## Non-Goals

- Rewriting non-slogan marketing paragraphs.
- Changing business descriptions or legal content unrelated to slogan copy.

## Assumptions

- Any occurrence of `Reliable Trade Solutions Across Borders` and `Integrated Business & Industrial Solutions` is intended as slogan/tagline text and should be replaced.

## Dependencies

- `apps/web/src/config/template.ts`
- `apps/web/src/features/landing/components/footer.tsx`
- `apps/web/index.html`
- `apps/server/src/modules/og-image/templates/home.tsx`
- `apps/web/imports/*.tsx` files containing the old slogan phrase
- Root env files: `.env`, `.env.example`, `.env.prod`, `.env.prod.example`

## Phases

### Phase 1: Locate Affected Slogan Text

- [x] Identify all old slogan/tagline phrase occurrences.

Tests for Phase 1:

- [x] `rg` output confirms all current occurrences.

### Phase 2: Replace Slogan Phrases

- [x] Replace `Reliable Trade Solutions Across Borders` with `We're Building the Future`.
- [x] Replace `Integrated Business & Industrial Solutions` with `We're Building the Future`.

Tests for Phase 2:

- [x] `rg` shows new slogan present in target files.
- [x] `rg` confirms old slogan/tagline phrases are removed.

### Phase 3: Validate

- [x] Run type checks relevant to web/server copy updates.
- [x] Mark checklist as complete.

Tests for Phase 3:

- [x] `bun check-types` succeeds.

## Task Checklist

- [x] Create spec.
- [x] Update slogan copy.
- [x] Run verification and type checks.
- [x] Finalize spec checklist.
