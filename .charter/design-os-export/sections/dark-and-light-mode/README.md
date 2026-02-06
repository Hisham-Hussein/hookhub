# Dark & Light Mode

## Overview

A cross-cutting theme system that adds light mode support to HookHub. The system detects the user's operating system color scheme preference via the `prefers-color-scheme` media query and applies the matching theme automatically. Light mode is the CSS default; dark mode activates via Tailwind `dark:` utility variants when the `.dark` class is present on `<html>`. No manual toggle in the MVP — theme follows system preference only.

## User Flows

- Light mode user visits: sees white backgrounds, dark text, light badges — no flicker
- Dark mode user visits: sees black background, zinc-950 cards, sky/indigo badges — no change from existing dark design
- User changes system preference: theme switches live without page reload
- First page load: correct theme applied before first paint via FOUC prevention script

## Design Decisions

- **Light-first CSS:** Light mode classes are CSS defaults, dark mode uses `dark:` variants
- **FOUC prevention:** Inline `<script>` in `<head>` sets `.dark` class synchronously before first paint
- **No manual toggle (MVP):** Simplifies implementation; system preference is the single source of truth
- **Semantic token map:** Full ThemeTokens interface maps UI roles to Tailwind classes per mode
- **9 components affected:** AppShell, HeroBanner, PageFooter, HookCard, HookCatalog, FilterChip, FilterChipRow, FilterBar, FilterSystem

## Data Used

**Entities:** Theme, ThemeTokens, ComponentClassMap, FoucPreventionConfig

## Visual Reference

See `screenshot.png` for both light and dark mode visual references.

## Components Provided

- `ThemePreview` — Demo-only toggle component for reviewing themes (NOT for production)
- `useThemeDetection` — React hook that detects and syncs system color scheme

## Callback Props

| Callback | Description |
|----------|-------------|
| `onThemeChange` | Called when system theme changes — receives `'light' \| 'dark'` |
| `onToggleTheme` | Demo toggle click handler (ThemePreview only, not for production) |
