# HookHub Design Tokens

**Source:** iSemantics Brand Elements v2.0 (extracted from AI Automation Proposal PPTX)
**Adapted for:** HookHub web application (Next.js + Tailwind CSS v4)
**Date:** 2026-02-02

> **Purpose:** This document defines the visual design tokens for HookHub, derived from the iSemantics brand guidelines. It is consumed by `/plan-phase-tasks` for phases with UI stories, and by implementation agents during build. All color, typography, spacing, and component tokens originate from the iSemantics brand — HookHub inherits the brand identity.

> **Note:** HookHub's Next.js scaffold currently uses Geist Sans/Mono fonts (Next.js defaults). Implementation must replace these with the iSemantics brand fonts (Poppins + Roboto) defined below.

---

## 1. Color System

### 1.1 Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#000000` | Page background (pure black) |
| `bg-card-dark` | `#050505` | Dark accent cards, featured panels |
| `bg-card` | `#3D3D42` | Standard feature cards |
| `border-card` | `#56565B` | Card borders, divider lines |
| `text-headline` | `#F2F2F3` | Headlines, primary text (off-white) |
| `text-body` | `#E5E0DF` | Body text, descriptions (warm gray) |
| `icon-bg` | `#F2F2F3` | Icon container circles (white) |

### 1.2 Accent Colors (iSemantics Blue Palette)

Use sparingly for highlights, links, CTAs, and important interactive elements.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `accent-blue` | `#3A5AFF` | (58, 90, 255) | CTAs, gradient start |
| `primary-blue` | `#2DA7FF` | (45, 167, 255) | Links, primary highlights |
| `light-blue` | `#92E6FD` | (146, 230, 253) | Secondary highlights, hover states, gradient end |

### 1.3 Functional Colors (Data Visualization / Status Only)

| Token | Hex | Usage |
|-------|-----|-------|
| `status-success` | `#22C55E` | Positive indicators (e.g., recently updated hooks) |
| `status-warning` | `#EAB308` | Warnings (e.g., stale hooks) |
| `status-danger` | `#EF4444` | Negative indicators (e.g., archived/broken) |

**Constraint:** Functional colors are for data-bearing elements only (star counts, freshness badges, status indicators). The core + accent palette should dominate all other UI.

---

## 2. Typography

### 2.1 Font Families

| Token | Font | Weight | Usage |
|-------|------|--------|-------|
| `font-headline` | Poppins | Light (300) | Headlines, titles, subheadings, card titles |
| `font-body` | Roboto | Light (300) | Body text, descriptions, labels |

**Key rule:** ALL text uses Light weight (300). No bold in main content. The brand aesthetic is defined by this lightness.

### 2.2 Typography Scale (Web-Adapted)

Sizes adapted from the PPTX source to web-appropriate values:

| Token | Size | Line Height | Font | Usage |
|-------|------|-------------|------|-------|
| `text-hero` | 54px | 1.2 | Poppins Light | Hero headlines (landing sections) |
| `text-title-lg` | 46px | 1.2 | Poppins Light | Page titles |
| `text-title` | 43px | 1.2 | Poppins Light | Section titles |
| `text-title-sm` | 40px | 1.25 | Poppins Light | Secondary titles |
| `text-subhead` | 27px | 1.3 | Poppins Light | Section subheadings |
| `text-card-title` | 23px | 1.3 | Poppins Light | Card titles |
| `text-card-title-sm` | 21px | 1.3 | Poppins Light | Smaller card titles, large body |
| `text-body-lg` | 21px | 1.6 | Roboto Light | Large body text |
| `text-body` | 18px | 1.65 | Roboto Light | Standard body text |
| `text-body-sm` | 17px | 1.65 | Roboto Light | Small body text |
| `text-caption` | 13px | 1.5 | Roboto Light | Labels, captions, metadata |

### 2.3 Font Loading

```
Google Fonts: Poppins:wght@300, Roboto:wght@300
```

Implementation should use `next/font/google` (replacing the current Geist font setup in `app/layout.tsx`).

---

## 3. Borders & Radii

### 3.1 Border Widths

| Token | Value | Usage |
|-------|-------|-------|
| `border-card` | 0.6px | Standard card borders |
| `border-card-thick` | 2.4px | Accent/featured card borders |

### 3.2 Border Radii

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-card` | 12px | Standard cards |
| `rounded-card-lg` | 24px | Glassmorphism/hero cards |
| `rounded-icon` | 16px | Icon containers (non-circular) |
| `rounded-full` | 50% | Circular icon containers |
| `rounded-pill` | 9999px | Pill/capsule shapes (accent bars) |

---

## 4. Component Tokens

### 4.1 Standard Feature Card

The primary card style for hook entries in the grid.

| Property | Value |
|----------|-------|
| Background | `#3D3D42` |
| Border | 0.6px solid `#56565B` |
| Border radius | 12px |
| Title font | Poppins Light, 21-23px, `#E5E0DF` |
| Body font | Roboto Light, 17-18px, `#E5E0DF` |

### 4.2 Dark Accent Card

For featured or highlighted content.

| Property | Value |
|----------|-------|
| Background | `#050505` |
| Border | 2.4px solid `#56565B` |
| Border radius | 12px |
| Left accent bar | 10px wide, `#F2F2F3`, pill-shaped, full height |

### 4.3 Glassmorphism Hero Card

For primary/featured elements (e.g., featured hook, hero section).

| Property | Value |
|----------|-------|
| Background | `linear-gradient(135deg, rgba(45,167,255,0.12), rgba(58,90,255,0.08), rgba(255,255,255,0.04))` |
| Backdrop filter | `blur(20px)` |
| Border | 1px solid `rgba(45,167,255,0.25)` |
| Border radius | 24px |
| Hover | `scale(1.03)`, enhanced shadow |
| Glow orb (top-right) | `rgba(45,167,255,0.2)`, 128px, blur 32px |
| Glow orb (bottom-left) | `rgba(146,230,253,0.15)`, 96px, blur 32px |
| Accent line (bottom) | Gradient `transparent → rgba(45,167,255,0.5) → transparent`, 2px height |
| Title gradient | `linear-gradient(90deg, #F2F2F3, #92E6FD)` as text fill |

### 4.4 Standard Glassmorphism Card

For secondary items in the same context as hero cards.

| Property | Value |
|----------|-------|
| Background | `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))` |
| Backdrop filter | `blur(20px)` |
| Border | 1px solid `rgba(255,255,255,0.1)` |
| Border radius | 24px |
| Hover | `scale(1.02)`, enhanced shadow |

### 4.5 Icon Container

| Property | Value |
|----------|-------|
| Size | 48px x 48px |
| Background (solid) | `#F2F2F3` (white circle) |
| Background (glass) | `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))` |
| Border radius | 50% (circular) or 16px (rounded square) |
| Icon size | 24px |
| Icon color | Dark on white bg, `#F2F2F3` on glass bg |

---

## 5. Gradients

### 5.1 iSemantics Brand Gradient

```css
/* Background gradient (CTAs, highlights) */
background: linear-gradient(135deg, #3A5AFF 0%, #92E6FD 100%);

/* Text gradient (hero elements) */
background: linear-gradient(90deg, #3A5AFF, #92E6FD);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### 5.2 Link Styling

| State | Color |
|-------|-------|
| Default | `#2DA7FF` (primary-blue) |
| Hover | `#92E6FD` (light-blue) |
| Transition | `color 0.2s ease` |

---

## 6. Tailwind CSS v4 Integration Notes

HookHub uses Tailwind CSS v4 with `@import "tailwindcss"` syntax. Design tokens should be integrated via CSS custom properties in `app/globals.css`, not via a `tailwind.config.js` (Tailwind v4 uses CSS-first configuration).

### 6.1 Recommended CSS Custom Properties

```css
@theme {
  --color-bg-primary: #000000;
  --color-bg-card-dark: #050505;
  --color-bg-card: #3D3D42;
  --color-border-card: #56565B;
  --color-text-headline: #F2F2F3;
  --color-text-body: #E5E0DF;
  --color-icon-bg: #F2F2F3;

  --color-accent-blue: #3A5AFF;
  --color-primary-blue: #2DA7FF;
  --color-light-blue: #92E6FD;

  --color-status-success: #22C55E;
  --color-status-warning: #EAB308;
  --color-status-danger: #EF4444;

  --font-headline: 'Poppins', sans-serif;
  --font-body: 'Roboto', sans-serif;
}
```

### 6.2 Dark/Light Mode

The iSemantics brand is **dark-first** (black background, light text). If HookHub adds a light mode, it would invert the core palette. The accent blues remain unchanged across modes.

---

## 7. Design Constraints for Implementation

1. **Light weight only** — all text uses font-weight 300. Do not use bold, semibold, or regular weights.
2. **Accent blues are scarce** — use them for interactive elements (links, CTAs, highlights) only. The grid of hook cards should use the neutral core palette.
3. **Glassmorphism is reserved** — hero/glass card styles are for featured content only, not every card in the grid. Standard feature cards (Section 4.1) are the default.
4. **Functional colors are data-only** — green/yellow/red are for star counts, freshness, and status badges. Do not use for decorative purposes.
5. **Pure black background** — `#000000`, not dark navy or dark gray. This is a key brand differentiator.
