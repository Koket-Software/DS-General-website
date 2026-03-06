# Align Env Branding With DS General Site

## Context / Problem

Root environment files still contain template branding placeholders such as `SITE_NAME=Your Company` and generic metadata descriptions. The web app and landing pages are already branded as DS General PLC, so env-based SEO/SSR metadata should match the live site identity.

## Goals

- Replace template placeholders in branding/SEO env keys with DS General PLC values.
- Keep development and production env variants aligned for branding fields.
- Ensure both server-side (`SITE_*`) and client-side (`VITE_SITE_*`) metadata keys are consistent.

## Non-Goals

- Rotating secrets or changing database/auth credentials.
- Refactoring branding logic in application code.
- Changing runtime URLs beyond existing environment intent.

## Assumptions

- Brand source of truth is existing app content (`apps/web/index.html`, landing/home copy, and `apps/web/src/config/template.ts`).
- `https://dsgeneralplc.com` remains the production public URL.
- `http://localhost:5173` remains the development frontend URL.

## Dependencies

- Root env files: `.env`, `.env.example`, `.env.prod`, `.env.prod.example`.
- Existing brand content in `apps/web/index.html` and `apps/web/src/config/template.ts`.

## Phases

### Phase 1: Spec + Brand Source Confirmation

- [x] Verify canonical branding strings from app source.
- [x] Confirm required env keys for server/client metadata.

Tests for Phase 1:

- [x] `rg` checks locate current brand strings and env key usage.

### Phase 2: Env Branding Updates

- [x] Update `.env` branding section values from placeholders.
- [x] Update `.env.example` branding section values from placeholders.
- [x] Update `.env.prod` branding values where still generic.
- [x] Update `.env.prod.example` branding values where still generic.
- [x] Ensure parity of optional branding keys (`SITE_LOCALE`, `THEME_COLOR`, `OG_DEFAULT_PATH`, `BRAND_*`, logo path, keywords, and Vite overrides) in production templates.

Tests for Phase 2:

- [x] `rg` checks confirm placeholder branding strings removed.
- [x] `rg` checks confirm DS General brand values are present across all four env files.

### Phase 3: Validation + Documentation

- [x] Re-open env files to verify final values and formatting.
- [x] Mark task checklist complete and summarize outcomes.

Tests for Phase 3:

- [x] Final `rg` audit for branding placeholders and expected keys.

## Task Checklist

- [x] Create spec.
- [x] Patch env files.
- [x] Run validation checks.
- [x] Update spec checklist to completed.
