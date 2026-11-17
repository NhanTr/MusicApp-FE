# Frontend Redesign Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the existing frontend using all template references while retaining working integrations.
**Architecture:** Shared semantic theme, responsive app shell, reusable collection primitives, and a context-owned playback queue. Existing React pages remain the integration boundaries.
**Tech Stack:** React 19, Vite 8, Tailwind 4, Lucide, node:test, Playwright for browser verification.
**Spec:** ../specs/2026-11-17-frontend-redesign-design.md

## Global Constraints

- Preserve MusicFlow branding, Vietnamese copy, existing local edits, routes, and API contracts.
- No backend changes, fake catalog fallback, or unsupported lossless claims.
- Proceed inline without additional approval, as authorized by the user.
- No commit/push/deployment requested.

## Review Focus

- Empty/failed catalog must remain usable and never pretend sample songs are real.
- Long titles and missing artwork must not cause horizontal overflow at 390px.
- Queue selection and pause/resume must preserve correct playback source and position.
- Mobile navigation and queue must have keyboard-accessible close behavior.
- Forms, admin actions, playlist add, and likes must retain API wiring.

## Tasks

- [x] 1. Add meaningful queue/repeat/shuffle unit tests; observe failures, then implement pure utilities. Record initial build/lint baseline.
- [x] 2. Replace theme tokens, migrate page utility colors, rebuild shared header/sidebar/music layout, and style public/auth/admin pages. Verify build and mobile overflow.
- [x] 3. Add reusable artwork, collection hero, track list, empty state and search toolbar. Rebuild dashboard, album detail, favorites, search, songs, and trending while retaining pagination/actions.
- [x] 4. Centralize queue selection in MusicContext; implement reference player, real queue overlay, repeat/shuffle, keyboard controls, like and playlist dialog. Verify utility suite and browser playback events.
- [x] 5. Add browser fixture verification across responsive layouts and routes; repair issues, run build/lint/tests, update frontend docs and record results.

## Progress / decisions

Baseline: production build passes. ESLint reports 17 errors and 8 warnings before changes. Existing user edits in AppHeader and History must be preserved semantically. Styling changes are reversible and verified visually; behavioral queue changes receive unit coverage. Browser API fixtures are test-only and never shipped as fallback application data.

Implementation decisions: no worktree/commits/push under the explicit instruction to proceed in the existing project. Pure queue functions were tested RED→GREEN; shuffle restoration has a browser regression test. Local data fixtures enable verification without touching user/backend records. Shared page colors were migrated rather than replacing API forms. Code is undergoing final independent review and browser verification.

## Final verification

- Production build: passed.
- ESLint: passed, zero errors/warnings (baseline 17 errors/8 warnings).
- Queue unit tests: 4 passed.
- Browser suite: 11 passed; route smoke recaptured and passed afterward.
- Independent code review: three P2 findings fixed (single-track repeat-all, mobile repeat access, dashboard collection identity); focused regression coverage included in the green suite.
- All 24 reference-state previews generated; seven additional mobile route previews captured.
- Documentation links and git diff whitespace checked.
- API/media browser fixtures are test-only; no production/backend service verification, commit, push, or deployment performed.
