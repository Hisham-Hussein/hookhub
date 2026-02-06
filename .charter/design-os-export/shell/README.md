# Application Shell

## Overview

HookHub is a single-page, no-auth, read-only directory. The shell is a minimal page layout frame — no sidebar, no top navigation bar, no user menu. All content renders in a single full-width content zone inside a max-width container.

## Layout Pattern

Minimal single-page layout with four stacked zones:

1. **Hero Zone** — Site identity (headline + subtitle + visual cue)
2. **Filter Zone** — Category chip row + event chip row + result count
3. **Content Zone** — Responsive card grid displaying the hook catalog
4. **Footer Zone** — Minimal attribution

## Components

- `AppShell.tsx` — Root wrapper: `min-h-screen`, max-w-7xl centered, responsive padding
- `HeroBanner.tsx` — Hero section with configurable headline and subtitle
- `PageFooter.tsx` — Minimal attribution footer

## Responsive Behavior

- **Desktop:** Max-width container centered. Hero compact (~20% viewport). Grid 3-4 columns.
- **Tablet:** Hero ~30% viewport. Grid 2 columns.
- **Mobile:** Hero ~40% viewport. Grid 1 column. Filter chips horizontally scrollable.

## Design Notes

- Dark-mode-first design with light mode support via `dark:` Tailwind variants
- No loading spinners for main content — designed for static data
- No user menu, no auth, no sidebar — deliberately minimal
