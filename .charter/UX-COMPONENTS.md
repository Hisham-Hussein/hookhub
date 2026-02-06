# UX Components — HookHub

> Part of UX Design Plan. See [UX-DESIGN-PLAN.md](UX-DESIGN-PLAN.md) for overview, IA, hierarchy, and layouts.

---

## Section 5: Component Specifications

### Atoms

#### Badge — Atom

**Purpose:** Displays a category or lifecycle event label on a hook card. Provides visual distinction between the two metadata dimensions. (SM-007, SM-008 / US-007, US-008)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default (category) | Compact container with background, body-small text. One visual treatment scheme for purpose categories. | Non-interactive. Informational display only. |
| Default (event) | Compact container with background, body-small text. Distinct visual treatment from category badges — different scheme. | Non-interactive. Informational display only. |

**Supported category values:** Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom
**Supported event values:** PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop

**Accessibility:** `<span>` with text content readable by screen readers. No ARIA needed — text content is the accessible name. Text must meet 4.5:1 contrast against badge background; badge shape must meet 3:1 contrast against card background (WCAG 1.4.11). Category and event badges are visually distinguishable by more than color alone (different shape, weight, or border treatment).

---

#### Icon — Atom

**Purpose:** Decorative or functional icon (star, external-link arrow). (SM-010, SM-011 / US-010, US-011)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default | Icon glyph at low emphasis | Static display, typically part of a parent molecule or organism |

**Accessibility:** Decorative icons: `aria-hidden="true"`. Meaningful icons paired with interactive parent: accessible name provided by parent element's `aria-label` or visually-hidden text span.

---

### Molecules

#### Filter Chip — Molecule

**Composition:** Label text atom + visual container
**Purpose:** Toggleable filter control within a chip group. Used for both category and event filtering. (SM-013–016 / US-013–016)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default (inactive) | Outlined container, medium-emphasis text | Available for selection. Cursor: pointer. |
| Hover (inactive) | Subtle emphasis increase over outline, slight background tint | Visual affordance indicating clickability. |
| Focus (inactive) | Focus ring visible (3:1 contrast), outlined container | Arrow Left/Right navigates between chips. Space/Enter selects. |
| Active/Pressed | Brief pressed feedback (subtle scale reduction) | Transitions to Selected state. |
| Selected (active) | Filled container, high-emphasis text, visually prominent. Multiple signals beyond color: fill + text weight + optional checkmark. | Filter is applied. Selecting another chip in the same group deselects this one. |
| Hover (selected) | Subtle emphasis shift over filled background | Cursor: pointer. |
| Focus (selected) | Focus ring visible, filled container | Space/Enter selects different chip (radio behavior). |
| Disabled | Low emphasis, non-interactive cursor | Cannot toggle. (Future: may disable chips with 0 matching results.) |

**Accessibility:** `role="radio"` within parent `role="radiogroup"`. `aria-checked="true"` when selected, `"false"` when not. Part of chip group with descriptive `aria-label`. Roving tabindex: single tab stop per group, Arrow Left/Right between chips, Home/End to first/last chip. Space/Enter selects focused chip.

---

#### Stars Display — Molecule

**Composition:** Star icon atom + count text atom
**Purpose:** Shows GitHub stars count as a compact social proof indicator. (SM-010 / US-010)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default | Star icon (low emphasis) + formatted count (caption, low emphasis). Count formatted as "1.2k" for 1,200+; raw number below 1,000. | Non-interactive. Informational display. |
| Zero stars | Star icon + "0" text. Displayed, not hidden. | Non-interactive. |

**Accessibility:** `<span aria-label="N GitHub stars">` for screen readers (e.g., `aria-label="1,200 GitHub stars"` — full number, not abbreviated). Star icon: `aria-hidden="true"`.

---

#### Card Badge Row — Molecule

**Composition:** Category badge atom + event badge atom
**Purpose:** Horizontal group of metadata badges on a hook card. (SM-007, SM-008 / US-007, US-008)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default | Two badges side by side with XS spacing. Category badge first, event badge second. Consistent positioning across all cards. | Non-interactive. |

**Accessibility:** Badges are individual `<span>` elements with readable text content. No additional ARIA needed. Row is semantic content within the card `<article>`.

---

### Organisms

#### Hero Section — Organism

**Composition:** Hero headline (display text) + subtitle (body text) + visual cue (icon or element directing attention to catalog)
**Purpose:** Communicates HookHub's purpose to first-time visitors within 5 seconds. (SM-001, SM-003 / US-001, US-003)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default | Center-aligned headline (display, high emphasis) + subtitle (body, medium emphasis) + downward visual cue (icon, low emphasis). Compact vertical height to allow grid visibility above fold on desktop 1080p viewport. | Static. Visual cue suggests scrolling or directs attention to catalog below. |

**Accessibility:** Headline: `<h1>`. Subtitle: `<p>`. Visual cue: decorative (`aria-hidden="true"`) unless it is a link to `#catalog` (then `<a>` with descriptive text). Container: `<section aria-labelledby="hero-heading">`.

---

#### Filter Bar — Organism

**Composition:** Filter section labels (text) + Category chip group (`role="radiogroup"` of filter chips with "All" default) + Event chip group (`role="radiogroup"` of filter chips with "All" default) + Result count (`role="status"`)
**Purpose:** Provides two-dimensional filtering of the hook catalog with independent, reversible controls. (SM-013–016 / US-013–016)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default (no filters) | Both "All" chips selected (filled). All other chips inactive (outlined). Result count shows total hook count: "Showing N hooks." | Category and event are independent dimensions. |
| Category filtered | Selected category chip filled; "All" chip in that group inactive. Grid shows only matching hooks. Result count updates. | Event filter unchanged. AND logic if event also active. |
| Event filtered | Selected event chip filled; "All" chip in that group inactive. Grid shows only matching hooks. Result count updates. | Category filter unchanged. AND logic if category also active. |
| Both filtered | One chip active per dimension. Grid shows hooks matching BOTH criteria. Result count updates. | Selecting "All" in either dimension clears that dimension only. |
| No results | Both groups have active selections but zero hooks match the AND combination. Grid shows empty state. | Filter bar remains fully interactive for adjustment. |

**Accessibility:** Two `role="radiogroup"` elements: `aria-label="Filter by purpose category"` and `aria-label="Filter by lifecycle event"`. Result count: `<div role="status" aria-live="polite" aria-atomic="true">`, debounced ~300ms after filter change. Each chip group uses roving tabindex with Arrow key navigation.

---

#### Hook Card — Organism

**Composition:** Card title (heading-3, high emphasis) + badge row molecule (category + event) + description (body, medium emphasis, 2-line truncated) + stars display molecule + repo link (external)
**Purpose:** Displays one hook's essential metadata for visual scanning. Entire card is a click-through to GitHub. (SM-006–011 / US-006–011)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default | Elevated surface with defined boundary. Content stacked: title → badges → description → stars + link. | Entire card is a click target navigating to GitHub repo. |
| Hover | Subtle elevation increase (shadow deepening or background shift) | Visual feedback indicating card is clickable. Cursor: pointer. |
| Focus | Focus ring (3:1 contrast) on card boundary | Tab focuses card. Enter activates link to GitHub. |
| Active/Pressed | Slight depression (reduced shadow, subtle scale-down) | Opens GitHub repo in new tab. |
| Loading (skeleton) | Gray placeholder shapes matching card dimensions: title bar, 2 badge blocks, 2 text lines, small metadata row | Displayed while card data loads. Render after ~300ms delay to prevent skeleton flash. |

**Card content hierarchy (strict order):**
1. Hook name — heading-3, high emphasis (most prominent)
2. Category badge + event badge — label, medium emphasis
3. Description — body, medium emphasis, truncated to 2 lines with ellipsis
4. Stars count — caption, low emphasis (with star icon)
5. External link indicator — label, low emphasis

**Long content handling:** Hook names that exceed card width: truncation with ellipsis or word-wrap (no layout breakage). Descriptions: CSS line-clamp to 2 lines; full text available to screen readers.

**Accessibility:** `<article>` element within `<li>` (card grid is `<ul>`). Title: `<h3>` with `aria-labelledby` on the article. Link: Single `<a>` on the card title with `::after` pseudo-element stretched to cover full card area — one tab stop per card. Link attributes: `target="_blank"`, `rel="noopener noreferrer"`. Stars: `aria-label` provides full count. Description: visually truncated via CSS only; full text accessible to screen readers.

---

#### Card Grid — Organism

**Composition:** Collection of hook card organisms arranged in responsive grid layout
**Purpose:** Displays the full catalog of hooks in a scannable grid. (SM-004 / US-004)

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default (loaded) | Responsive grid. Desktop: 3–4 columns. Tablet: 2 columns. Mobile: 1 column. Consistent M spacing between cards. | No pagination in MVP — all hooks rendered. |
| Loading | Grid of skeleton cards matching expected layout (column count, card dimensions). | Displayed during initial page load. Skeleton count: 8 as safe default or expected catalog size. |
| Empty (no results) | Centered empty state replacing grid area. See Data States (Section 8) for content. | Filter bar remains interactive above. |
| Filtered | Subset of cards matching active filters. Cards transition with short fade (ease-out). | Result count updates via `aria-live` region. |

**Accessibility:** `<ul aria-label="Hook catalog">`. Each card: `<li>` containing `<article>`. Screen reader announces "list, N items" on the container. After filter changes, count announced via result-count `role="status"` region.

---

#### Page Footer — Organism

**Composition:** Attribution text + any relevant links
**Purpose:** Site attribution.

| State | Visual Description | Behavior |
|-------|-------------------|----------|
| Default | body-small, low emphasis. Minimal content. Full-width at bottom of page. | Static. |

**Accessibility:** `<footer>` landmark with `aria-label="Site footer"`.
