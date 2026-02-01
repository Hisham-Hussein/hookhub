# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HookHub is a browsable, filterable web directory of open-source Claude Code hooks. Each hook links to its GitHub source repository. The MVP displays a curated catalog in a grid with filtering by purpose category and lifecycle event. No user accounts, no database — read-only site backed by a local JSON manifest enriched via GitHub API at build time.

## Commands

```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Production build (fetches GitHub API data)
pnpm start        # Run production server
pnpm lint         # Run ESLint (flat config, v9)
npx playwright test                    # Run all E2E tests
npx playwright test tests/e2e/foo.spec.ts  # Run a single test file
```

## Architecture

- **App Router**: All routes live in `app/`. Files are React Server Components by default; add `"use client"` directive for client components that need interactivity (filters, search).
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` plugin. Global styles and CSS custom properties for theming (light/dark) are in `app/globals.css`. Uses `@import "tailwindcss"` syntax (not the v3 `@tailwind` directives). No separate CSS files — use Tailwind utility classes exclusively.
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google` in `app/layout.tsx`, injected as CSS variables.
- **Path alias**: `@/*` maps to the project root (configured in `tsconfig.json`).
- **Package manager**: pnpm (use `pnpm` for all install/run commands).
- **Data flow**: `data/hooks.json` (curator-maintained manifest of hook repo URLs) → build-time GitHub API enrichment (stars, description, freshness) → static props served to the grid.

## Testing

Playwright E2E tests live in `tests/e2e/`. Config is in `playwright.config.ts` using a custom chromium wrapper at `scripts/chrome-wrapper.sh`. Test plans go in `specs/`.

## Planning Artifacts

Planning documents live in `.charter/` and follow a sequential pipeline:

1. `BUSINESS-CASE.md` — Business requirements (BR-01 through BR-09)
2. `STORY-MAP.md` — User journey map with release slices (MVP/R2/Future)
3. `USER-STORIES.md` — Full story cards with acceptance criteria (not yet generated)
4. `ARCHITECTURE-DOC.md` — Software architecture (not yet generated)

The `roadmap/` folder tracks active work (`ACTIVE.md`), queue (`QUEUE.md`), and decisions (`LOG.md`).
