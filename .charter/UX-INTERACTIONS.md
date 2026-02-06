# UX Interactions, Responsive Behavior & Data States — HookHub

> Part of UX Design Plan. See [UX-DESIGN-PLAN.md](UX-DESIGN-PLAN.md) for overview, IA, hierarchy, and layouts.

---

## Section 6: Interaction Patterns

### Filter Chip Toggle

- **Trigger:** Click/tap on a filter chip
- **Response:** Within the chip's radiogroup (category or event): previously selected chip deselects, clicked chip becomes selected. Grid immediately updates to show matching hooks. Result count updates.
- **Feedback model:** Optimistic. Filter is client-side with in-memory data; result is instant (<100ms). No server round-trip.
- **Animation:** Chip state transition: short (100–150ms), ease-out. Grid card enter/leave: medium (200–300ms), ease-out with opacity fade. Cards leaving fade out; cards entering fade in with slight upward translate.
- **Keyboard:** Tab enters the radiogroup (focuses selected chip or first chip). Arrow Left/Right between chips. Home/End to first/last chip. Space/Enter selects focused chip. Tab exits group.
- **Mobile variant:** Touch target: 44x44 min per chip. Chips may horizontally scroll if they exceed viewport width. Active chip has clear visual treatment for thumb targeting.
- **Reduced motion:** Chip toggles instantly (no transition). Grid updates instantly (no fade/translate). State changes still occur; only animation is removed.
- **Source:** SM-013–016 / US-013–016

### Filter Reset ("All" Chip)

- **Trigger:** Click/tap on the "All" chip in a filter dimension
- **Response:** Deselects any active chip in that dimension. "All" becomes selected. Grid updates to show all hooks in that dimension (other dimension filter unchanged). Result count updates.
- **Feedback model:** Optimistic.
- **Animation:** Same as filter chip toggle.
- **Keyboard:** Same as filter chip (part of the radiogroup). "All" is first chip — reachable via Home key.
- **Mobile variant:** Same. "All" chip is first in the row, easy to reach.
- **Reduced motion:** Same as chip toggle.
- **Source:** SM-014, SM-016 / US-014, US-016

### Hook Card Click-Through

- **Trigger:** Click/tap anywhere on a hook card
- **Response:** Opens the hook's GitHub repository in a new browser tab. No in-app navigation.
- **Feedback model:** None (external navigation). Browser handles new tab opening.
- **Animation:** Card press: short (50–100ms), ease-out scale-down on press, ease-out return on release.
- **Keyboard:** Tab focuses card (single tab stop via stretched `<a>`). Enter activates link (opens GitHub in new tab).
- **Mobile variant:** Full card is touch target (far exceeds 44x44 minimum). Touch feedback: subtle background tint on press.
- **Reduced motion:** No card press animation. Link still opens.
- **Source:** SM-011 / US-011

### URL State Persistence

- **Trigger:** Any filter change
- **Response:** URL query parameters update to reflect current filter state (e.g., `?category=Safety&event=PreToolUse`). Browser history entry created per change.
- **Feedback model:** N/A (no visible feedback for URL changes).
- **Keyboard:** Browser back/forward buttons reverse/redo filter changes.
- **Source:** Nielsen H7 (Flexibility), filter specification best practice

### Filter Specification (Expanded)

- **Placement:** Horizontal chip rows above the grid. Category row first, event row below. Both always visible.
- **Application method:** Interactive (live results). Client-side filtering, instant response.
- **Multi-select:** Single-select within each dimension (radio behavior). Only one category and one event can be active at a time.
- **Boolean logic:** AND between dimensions (category AND event). Within each dimension: one active value.
- **Applied filter visibility:** Active chip is filled/highlighted. The chip itself indicates the active filter — no separate "applied filters" summary needed.
- **Clear/reset:** "All" chip per dimension serves as the clear mechanism. Selecting "All" in category does not affect event, and vice versa. No separate global "Clear All" button needed (only 2 independent dimensions with built-in reset per dimension).
- **No-results handling:** See Data States, Section 8. Grid shows empty state. Filter bar remains interactive.
- **Mobile adaptation:** Chips remain as horizontal row; horizontally scrollable if they exceed viewport width. No bottom sheet or modal needed — chips are compact enough to remain always visible.
- **Result count display:** "Showing N hooks" text below filter rows, updated on every filter change.
- **URL persistence:** Filter state in URL query parameters. Shareable/bookmarkable. Browser back button navigates filter history.

---

## Section 7: Responsive Behavior

### Breakpoint Strategy

| Tier | Description | Touch Model |
|------|-------------|-------------|
| Mobile | Single-column, portrait, touch-primary | 44x44 min targets |
| Tablet | Multi-column possible, touch-primary | 44x44 min targets |
| Desktop | Full multi-column, pointer-primary | 24x24 min targets |

No Wide tier needed — HookHub is a simple catalog. Desktop with max-width constraint is sufficient.

### Per-Component Responsive Specs

#### Hero Section

| Aspect | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Layout | Single-column, center-aligned, full-width | Same | Same, reduced vertical height |
| Typography | Display at mobile scale (1.125–1.200) | Display at tablet scale | Display at desktop scale (1.250–1.333) |
| Content visibility | All visible | All visible | All visible |
| Vertical height | ~40% viewport | ~30% viewport | Compact (~20%) to show grid above fold |

**Transformation pattern:** Tiny tweaks (same layout; only typography scale and spacing change)

#### Filter Bar

| Aspect | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Layout | Category row + event row stacked. Chips horizontally scrollable if overflow. | Chips wrap naturally, no scroll needed | All chips on single lines per dimension |
| Navigation | Touch — tap chips, swipe to scroll overflow | Touch — tap chips | Pointer — click chips |
| Content visibility | Section labels + chips + result count visible | Same | Same |
| Touch targets | 44x44 min per chip | 44x44 min | 24x24 min (chips ~32px+ height, comfortable) |

**Transformation pattern:** Tiny tweaks (horizontal scroll at mobile; natural wrap at tablet; single lines at desktop)

#### Hook Card

| Aspect | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Layout | Full-width card. Title → badges → description → metadata in vertical stack. | Same internal layout | Same internal layout |
| Content visibility | All metadata visible | All visible | All visible |
| Touch targets | Entire card (well above 44x44) | Same | Pointer click target |
| Typography | Heading-3 at mobile scale | Heading-3 at tablet scale | Heading-3 at desktop scale |

**Transformation pattern:** None (card internal layout is consistent; only grid column count changes)

#### Card Grid

| Aspect | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Layout | 1 column, full-width cards | 2 columns, M gap | 3–4 columns, M gap |
| Content visibility | All cards visible (scroll to see all) | All visible (less scrolling) | First row visible above fold on 1080p |
| Typography scale | 1.125–1.200 ratio | 1.200 ratio | 1.200–1.250 ratio |

**Transformation pattern:** Column drop (4 → 2 → 1 columns as viewport narrows)

#### Page Footer

| Aspect | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Layout | Center-aligned, single line or stacked | Center-aligned | Center-aligned |

**Transformation pattern:** Tiny tweaks

---

## Section 8: Data States

### Card Grid — Data States

| State | Pattern | Content |
|-------|---------|---------|
| Loading | Skeleton screen — grid of skeleton cards matching expected layout (column count, card dimensions). Render after ~300ms delay to prevent skeleton flash. | Skeleton shapes per card: title bar, 2 badge blocks, 2 text lines, small metadata row. Number of skeleton cards: 8 as safe default or expected catalog size. |
| Empty (no-results from filters) | Centered empty state replacing grid area | **Headline:** "No hooks match these filters" **Body:** "Try selecting a different category or event, or reset your filters to see all hooks." **CTA:** "Clear all filters" (button that resets both dimensions to "All") |
| Error (catalog failed to load) | Page-level error replacing grid area | **Message:** "Unable to load the hook catalog. This is usually temporary — please try refreshing the page." **CTA:** "Refresh page" (reloads the page) |
| Success | None — catalog load is the default state. No explicit success feedback needed for a page load. | N/A |
| Partial (some cards missing metadata) | Degrade — display card with available data. Missing fields handled gracefully. | Stars unavailable: hide stars display entirely (don't show "0" for genuinely missing data vs. 0-star repos). Description unavailable: show hook name and badges only; card remains functional. |

### Hook Card — Data States

| State | Pattern | Content |
|-------|---------|---------|
| Loading | Skeleton card within grid skeleton | Gray placeholder shapes matching card structure dimensions (title bar, badge blocks, text lines, metadata row). |
| Error | N/A — individual cards don't fail independently in a static site. Build enrichment failure for a hook results in manifest-only data. | Manifest data only: name + category + event displayed. Stars and description omitted or replaced with "—" (em dash) to indicate absent data. |

### Filter Bar — Data States

| State | Pattern | Content |
|-------|---------|---------|
| Loading | None — filters render from static data (category and event lists are known at build time). | N/A |
| Empty | N/A — filter options are a static list, always present. | N/A |
| No-results | Filter bar remains fully interactive. Empty state appears in grid area (see Card Grid). | Result count updates: "Showing 0 hooks" |
