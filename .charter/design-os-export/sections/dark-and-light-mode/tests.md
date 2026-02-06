# Test Instructions: Dark & Light Mode

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

The Dark & Light Mode system is a cross-cutting concern that ensures all components render correctly in both themes. Test FOUC prevention, theme detection, component theming, and live switching.

---

## User Flow Tests

### Flow 1: Light Mode Visit

**Scenario:** User with light system preference visits HookHub

#### Success Path

**Setup:**
- Mock `matchMedia('(prefers-color-scheme: dark)')` to return `matches: false`
- Render the full application

**Steps:**
1. Page loads

**Expected Results:**
- [ ] `<html>` does NOT have `.dark` class
- [ ] Page background is white (`bg-white`)
- [ ] Heading text is dark (`text-zinc-900`)
- [ ] Card backgrounds are white with light borders (`bg-white border-zinc-200`)
- [ ] Category badges: `bg-sky-50 text-sky-700`
- [ ] Event badges: `bg-indigo-50 text-indigo-700`
- [ ] Footer border is `border-zinc-300`

### Flow 2: Dark Mode Visit

**Scenario:** User with dark system preference visits HookHub

#### Success Path

**Setup:**
- Mock `matchMedia('(prefers-color-scheme: dark)')` to return `matches: true`

**Steps:**
1. Page loads (FOUC script runs)

**Expected Results:**
- [ ] `<html>` has `.dark` class
- [ ] Page background is black (`bg-black` via dark: variant)
- [ ] Cards: `bg-zinc-950 border-zinc-800`
- [ ] Category badges: `bg-sky-500/15 text-sky-400`
- [ ] Event badges: `bg-indigo-500/15 text-indigo-400`

### Flow 3: Live Theme Switch

**Scenario:** User changes system preference while page is open

**Setup:**
- Start in light mode
- Render with useThemeDetection hook active

**Steps:**
1. Dispatch `matchMedia` change event with `matches: true`

**Expected Results:**
- [ ] `.dark` class is added to `<html>`
- [ ] All components re-render with dark theme
- [ ] No page reload occurs
- [ ] `useThemeDetection` returns `{ theme: 'dark' }`

**Reverse:**
1. Dispatch change event with `matches: false`

**Expected Results:**
- [ ] `.dark` class is removed from `<html>`
- [ ] Components render with light theme
- [ ] `useThemeDetection` returns `{ theme: 'light' }`

---

## FOUC Prevention Tests

### Inline Script

- [ ] Script exists in `<head>` before any `<link>` or `<script>` tags
- [ ] Script checks `window.matchMedia('(prefers-color-scheme:dark)').matches`
- [ ] When dark: adds `.dark` class to `document.documentElement`
- [ ] When light: does NOT add `.dark` class
- [ ] Script is wrapped in try/catch for SSR safety
- [ ] Script runs synchronously (no async/await)

---

## Component Theme Tests

Test each component renders correctly in BOTH modes:

### AppShell
- Light: `bg-white text-zinc-700`
- Dark: `bg-black text-zinc-300`

### HeroBanner
- Light: h1 `text-zinc-900`, subtitle `text-zinc-700`, arrow `text-zinc-400`
- Dark: h1 `text-zinc-100`, subtitle `text-zinc-400`, arrow `text-zinc-600`

### PageFooter
- Light: border `border-zinc-300`, text `text-zinc-600`
- Dark: border `border-zinc-800`, text `text-zinc-500`

### HookCard
- Light: card `bg-white border-zinc-200`, name `text-zinc-900`, desc `text-zinc-700`, stars `text-zinc-600`, category badge `bg-sky-50 text-sky-700`, event badge `bg-indigo-50 text-indigo-700`
- Dark: card `bg-zinc-950 border-zinc-800`, name `text-zinc-100`, desc `text-zinc-400`, stars `text-zinc-500`, category badge `bg-sky-500/15 text-sky-400`, event badge `bg-indigo-500/15 text-indigo-400`

### FilterChip (Selected Category)
- Light: `bg-sky-100 text-sky-800 border-sky-300`
- Dark: `bg-sky-500/20 text-sky-300 border-sky-500/30`

### FilterChip (Selected Event)
- Light: `bg-indigo-100 text-indigo-800 border-indigo-300`
- Dark: `bg-indigo-500/20 text-indigo-300 border-indigo-500/30`

### FilterChip (Inactive)
- Light: `text-zinc-600 border-zinc-300`
- Dark: `text-zinc-400 border-zinc-700/80`

---

## Edge Cases

- [ ] Theme switch during active filter state — filters preserved, only colors change
- [ ] Hover states work correctly in both modes
- [ ] Focus ring offset adapts: `ring-offset-white` (light) / `ring-offset-black` (dark)
- [ ] Ambient glow in hero is subtle in both modes
- [ ] Grid fade-in animation respects `prefers-reduced-motion`

---

## Accessibility Checks

- [ ] WCAG AA contrast ratio (4.5:1) for body text in both modes
- [ ] WCAG AA contrast ratio (3:1) for large heading text in both modes
- [ ] Focus rings visible in both modes
- [ ] Badge text readable against badge backgrounds in both modes

---

## useThemeDetection Hook

- [ ] Returns `{ theme: 'light' }` when system prefers light
- [ ] Returns `{ theme: 'dark' }` when system prefers dark
- [ ] Adds `.dark` class to `<html>` when dark
- [ ] Removes `.dark` class from `<html>` when light
- [ ] Cleans up matchMedia listener on unmount
- [ ] Handles SSR (returns 'light' when `window` is undefined)
