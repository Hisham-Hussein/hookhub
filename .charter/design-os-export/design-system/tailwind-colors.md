# Tailwind Color Configuration

## Color Choices

- **Primary:** `sky` — Used for buttons, links, category badges, key accents
- **Secondary:** `indigo` — Used for lifecycle event badges, secondary highlights
- **Neutral:** `zinc` — Used for backgrounds, text, borders

## Usage Examples

### Light Mode (CSS default)

Primary button: `bg-sky-600 hover:bg-sky-700 text-white`
Category badge: `bg-sky-50 text-sky-700 border border-sky-200`
Event badge: `bg-indigo-50 text-indigo-700 border border-indigo-200`
Page background: `bg-white`
Card: `bg-white border-zinc-200`
Heading text: `text-zinc-900`
Body text: `text-zinc-700`
Muted text: `text-zinc-600`

### Dark Mode (via `.dark` class on `<html>`)

Primary accent: `dark:text-sky-400`
Category badge: `dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/20`
Event badge: `dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/20`
Page background: `dark:bg-black`
Card: `dark:bg-zinc-950 dark:border-zinc-800`
Heading text: `dark:text-zinc-100`
Body text: `dark:text-zinc-400`
Muted text: `dark:text-zinc-500`

## Theme Switching

HookHub uses Tailwind's `dark:` variant with the `.dark` class on `<html>`:

- Light mode is the CSS default (no class needed)
- Dark mode activates when `.dark` class is present
- System preference detected via `prefers-color-scheme` media query
- A blocking inline `<script>` in `<head>` applies `.dark` before first paint to prevent FOUC

### Tailwind CSS v4 Configuration

Add to your CSS entry point:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This enables the `.dark` class-based strategy for Tailwind v4.
