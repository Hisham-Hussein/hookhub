# UX Design Expertise Skill — Specification

> **Purpose**: Reference document for building the `expertise/ux-design` skill via `create-agent-skills`
> **Produced from**: Brainstorming session (2026-02-01)
> **Consumed by**: `taches-cc-resources:create-agent-skills` (domain expertise workflow)

---

## 1. Problem Statement

Planning pipelines produce documents covering *what* to build (story map, user stories), *why* (business case), *how technically* (architecture), and *in what order* (roadmap). But no document specifies *what the user sees and interacts with* — the visual structure, component states, interaction behaviors, responsive layout, and accessibility requirements.

Without this specification layer, AI coding agents improvise: they fill unspecified visual and interaction details with generic, bland, or inconsistent choices. The UX design plan eliminates this guesswork.

## 2. Skill Identity

| Attribute | Value |
|-----------|-------|
| **Type** | Domain Expertise Skill |
| **Name** | `ux-design` |
| **Location** | `~/.claude/skills/expertise/ux-design/` |
| **Primary workflow** | `create-ux-plan` — generate UX-DESIGN-PLAN.md |
| **Future workflows** | `review-ux-compliance`, `update-ux-plan` |

## 3. Strategic Decisions

### 3.1 Inputs

| Input | Status | Source |
|-------|--------|--------|
| **Story Map** | Required | Provides user journeys, activities, tasks, release slices, cross-cutting concerns, resolved design decisions |
| **User Stories with AC** | Optional | Enriches with specific behaviors, edge cases, acceptance criteria |
| Architecture doc | NOT an input | Technical implementation detail — consumed at build time, not UX planning time |
| SRS | NOT an input | Non-functional requirements relevant to UX are typically captured in story map cross-cutting concerns |
| Design system / brand guide | NOT an input | Consumed at implementation time alongside the UX plan — not at plan-generation time |
| Roadmap | NOT an input | Ordering concern, not UX concern |

**Rationale**: Keep inputs lean. The UX plan should be technology-agnostic and design-system-agnostic. It describes *what the user sees and does*, not *how the code implements it* or *what colors to use*.

### 3.2 Output Characteristics

- **Design-system-agnostic**: Uses abstract terms (role-based names, emphasis levels) — never specific colors, fonts, or pixel values
- **Story-map-driven**: Every UX decision traces back to a story map activity (SM-XXX) or user story (US-XXX)
- **State-complete**: Every component specifies ALL states — no "default only" specs
- **Responsive-explicit**: Every breakpoint behavior stated explicitly — no implicit "figure it out"
- **Accessible-by-default**: WCAG AA compliance woven into every component spec
- **Adaptive**: The skill applies UX knowledge based on the project type, not rigidly following a template

### 3.3 Visual Hierarchy Approach

Uses a **combined role-based + semantic level** mapping. This eliminates ambiguity about both *what* each element is and *where it sits* in the emphasis scale.

Example:
```
Visual Hierarchy (highest to lowest emphasis):
1. page-title         → heading-1,  high emphasis
2. section-title      → heading-2,  high emphasis
3. card-title         → heading-3,  medium emphasis
4. card-body          → body-text,  medium emphasis
5. card-metadata      → caption,    low emphasis
6. filter-label       → label,      medium emphasis
7. filter-chip-text   → body-small, medium emphasis
```

**How it connects to the design system**: The coding agent reads both:
- UX plan: "card-title → heading-3, medium emphasis, positioned top-left of card"
- Design system: "heading-3 = 16px bold Geist Sans, color: text-primary"

Resolution: "card-title = 16px bold Geist Sans, text-primary, top-left of card." Zero guesswork.

### 3.4 Output File Splitting

- **Single file** if total output is ~500 lines or fewer: `UX-DESIGN-PLAN.md`
- **Semantic split** if output exceeds ~500 lines:

```
.charter/
├── UX-DESIGN-PLAN.md          (Sections 1-3: overview, IA, hierarchy)
├── UX-LAYOUTS.md              (Section 4: page layouts)
├── UX-COMPONENTS.md           (Section 5: component specs with states)
├── UX-INTERACTIONS.md         (Sections 6-8: interactions, responsive, data states)
├── UX-ACCESSIBILITY.md        (Section 9: accessibility)
└── UX-FLOWS.md                (Sections 10-11: user flows + traceability)
```

The skill decides at generation time based on output size — not a user choice. Small project = one file. Larger project = automatic split.

### 3.5 Output Location

Written to the project's `.charter/` directory (alongside BUSINESS-CASE.md, STORY-MAP.md, USER-STORIES.md, etc.).

## 4. Skill Directory Structure

```
expertise/ux-design/
├── SKILL.md                              # Router + essential UX principles
├── workflows/
│   ├── create-ux-plan.md                 # Primary: generate UX-DESIGN-PLAN.md
│   ├── review-ux-compliance.md           # Future: audit implementation against plan
│   └── update-ux-plan.md                 # Future: update plan for new/changed stories
├── references/
│   ├── nielsen-heuristics.md             # Nielsen's 10 usability heuristics
│   ├── atomic-design.md                  # Component hierarchy (atoms → pages)
│   ├── responsive-patterns.md            # Breakpoint strategies, mobile-first
│   ├── accessibility-wcag.md             # WCAG 2.1 AA standards
│   ├── data-states.md                    # Loading/empty/error/success patterns
│   ├── interaction-patterns.md           # Common UX interaction patterns
│   └── visual-hierarchy.md               # Typography scale, emphasis, reading order
└── templates/
    └── ux-design-plan-template.md        # Output template (11 sections)
```

## 5. Output Template — UX-DESIGN-PLAN.md

### Section 1: Overview & Design Principles

Product summary (1-2 sentences derived from story map). Then 3-5 guiding UX principles specific to this product — derived from the story map's activities and goals, not generic heuristics.

Example for a hook directory:
- "Scanability over detail" — users scan a grid, not read long descriptions
- "Filter-first discovery" — narrowing by category is the primary interaction
- "Zero learning curve" — first-time visitor understands the site within 5 seconds

### Section 2: Information Architecture

Site structure derived from story map activities. Each activity maps to a page or section. Define:
- Page/view inventory (what pages exist)
- Navigation model (how pages connect)
- Content hierarchy (what's primary vs secondary on each page)

### Section 3: Visual Hierarchy Map

The combined role-based + semantic hierarchy table covering every text and UI element across the entire product. Organized from highest to lowest emphasis. This section is the bridge between the UX plan and any design system.

Include emphasis classification:
- **High emphasis**: Elements that draw the eye first (titles, CTAs)
- **Medium emphasis**: Supporting content (body text, labels, active states)
- **Low emphasis**: Tertiary information (metadata, timestamps, muted text)

### Section 4: Page Layouts

Text-based wireframe for each major view/page. One sub-section per page. Each layout specifies:
- Content zones and their placement
- Element ordering and reading flow
- Spatial relationships ("filter bar sits above grid, left-aligned")
- Design-system-agnostic — describes structure and placement, not colors or fonts

### Section 5: Component Specifications

Every reusable component, organized by Atomic Design hierarchy:

**Atoms**: Basic building blocks (buttons, badges, icons, inputs)
**Molecules**: Groups of atoms (filter chip row, card header, metadata row)
**Organisms**: Complex groups (hook grid, filter section, hero section)

For each component, specify ALL states:
- Default / resting
- Hover
- Active / pressed
- Focused (keyboard navigation)
- Disabled (if applicable)
- Loading (if applicable)
- Error (if applicable)

Use role-based names from Section 3 for all text elements within components.

### Section 6: Interaction Patterns

Behavioral specification for every interactive element:
- What happens on click/tap
- Filter logic (AND/OR, multi-select behavior, reset behavior)
- Navigation behavior (same tab, new tab, scroll-to)
- Transition/feedback descriptions ("grid content updates immediately with no transition" or "fade transition 200ms")
- Keyboard interactions (Tab order, Enter/Space activation, Escape to dismiss)

Trace each interaction to its story map task or user story.

### Section 7: Responsive Behavior

Explicit breakpoint strategy:
- Breakpoint definitions (mobile < X, tablet X-Y, desktop > Y)
- Layout changes at each breakpoint (grid columns, stacking, spacing)
- Element visibility changes (what hides/shows at each breakpoint)
- Touch target requirements (minimum 44x44px on touch devices)
- Scroll behavior differences

### Section 8: Data States

For every component and page that displays dynamic content:
- **Loading**: What the user sees while data loads (skeleton, spinner, placeholder)
- **Empty**: What appears when there's no content (friendly message, suggested action)
- **Error**: What appears on failure (clear message, recovery action)
- **Success**: Confirmation feedback where applicable

Include exact microcopy for each state. This prevents the coding agent from inventing placeholder text.

### Section 9: Accessibility

Per-component accessibility requirements:
- Semantic HTML mapping (which elements use `<article>`, `<nav>`, `<h1>`, etc.)
- ARIA attributes needed (roles, labels, live regions)
- Focus management (what receives focus after actions, focus trap behavior)
- Keyboard navigation (full tab order, shortcut keys)
- Color contrast requirements (stated abstractly: "must meet WCAG AA 4.5:1 for text, 3:1 for non-text UI")
- Screen reader considerations (alt text, aria-labels, hidden decorative elements)

### Section 10: User Flows

Task completion flows derived from story map activities:
- Step-by-step flow for each major user task
- Decision points (what if the user does X instead of Y?)
- Error recovery paths (what happens when something fails mid-flow)
- Entry points (where does the user start this flow?)
- Exit points (where does the flow end?)

Use simple flow notation or bulleted sequences. Mermaid diagrams where helpful.

### Section 11: Traceability Matrix

Table linking every UX decision to its source:

| UX Element | Section | Source ID | Source Description |
|------------|---------|-----------|-------------------|
| Hero section | Layout | SM-001 | Landing hero communicates purpose |
| Filter chips | Component | SM-013, SM-015 | Category + event filters |
| ... | ... | ... | ... |

Coverage check: every story map activity must have at least one UX element. Flag gaps.

## 6. Primary Workflow Phases — create-ux-plan.md

### Inputs
- **Required**: Story Map (`.charter/STORY-MAP.md` or path provided by user)
- **Optional**: User Stories with AC (`.charter/USER-STORIES.md` or path provided by user)

### Process

**Phase 1: Parse Inputs**
1. Read story map — extract activities, tasks, personas, release slices, cross-cutting concerns, resolved design gaps
2. Read user stories (if provided) — extract acceptance criteria, edge cases, specific behaviors
3. Identify the target release scope (usually MVP, but user may specify)

**Phase 2: Derive Structure**
4. Derive information architecture — map activities to pages/views, define navigation model
5. Build visual hierarchy — create role-based + semantic hierarchy table for all elements
6. Design page layouts — text-based wireframes per page/view

**Phase 3: Specify Components & Behavior**
7. Specify components — Atomic Design hierarchy with ALL states for each
8. Define interaction patterns — behavior specs for every interactive element
9. Define responsive behavior — breakpoint strategy and layout rules
10. Define data states — loading/empty/error/success for all dynamic components

**Phase 4: Accessibility & Flows**
11. Define accessibility — semantic HTML, ARIA, keyboard nav, focus management per component
12. Map user flows — task completion flows from story map activities

**Phase 5: Validate & Output**
13. Build traceability matrix — link every decision to SM-XXX / US-XXX
14. Validate against Nielsen's 10 heuristics — quality gate check
15. Check output length — single file or semantic split
16. Write to `.charter/` directory

## 7. Methodology References

The following methodologies should be embedded as reference files within the skill. Each reference should contain decision guidance, patterns, anti-patterns, and practical examples.

### 7.1 Nielsen's 10 Usability Heuristics

Used as a **validation framework** — the generated UX plan is checked against all 10 heuristics before output. The skill should verify:

1. Visibility of system status (are loading/progress states defined?)
2. Match between system and real world (does the language match the user's domain?)
3. User control and freedom (are escape hatches and resets defined?)
4. Consistency and standards (are patterns consistent across components?)
5. Error prevention (are error states and validation defined?)
6. Recognition over recall (are options visible, not memorized?)
7. Flexibility and efficiency (do experts have shortcuts?)
8. Aesthetic and minimalist design (is information hierarchy clear?)
9. Help users recognize, diagnose, recover from errors (are error messages actionable?)
10. Help and documentation (is guidance available where needed?)

### 7.2 Atomic Design

Structures the component specification section:
- **Atoms**: Smallest indivisible UI elements (button, badge, icon, input, label)
- **Molecules**: Functional groups of atoms (search bar = input + button, chip = label + close icon)
- **Organisms**: Complex UI sections (navigation bar, card grid, filter section)
- **Templates**: Page-level wireframes showing organism placement
- **Pages**: Templates filled with real content (for verification)

### 7.3 WCAG 2.1 AA

Accessibility baseline embedded in every component spec:
- Color contrast: 4.5:1 for normal text, 3:1 for large text and UI components
- Keyboard operability: all functionality accessible via keyboard
- Semantic structure: proper heading hierarchy, landmark regions
- Focus visible: clear focus indicators on all interactive elements
- Text alternatives: alt text for images, aria-labels for icon-only buttons

### 7.4 Responsive-First Patterns

- Mobile-first design approach (start with smallest viewport, enhance upward)
- Standard breakpoints (skill should recommend based on project, not hardcode)
- Touch targets: minimum 44x44px on touch devices
- Layout strategies: fluid grids, stacking patterns, visibility toggles
- Typography scaling across viewports

### 7.5 Data States Pattern

Every dynamic component must define:
- **Loading**: Skeleton screens preferred over spinners for content areas
- **Empty**: Friendly message + suggested action (never blank space)
- **Error**: Clear explanation + recovery action (never raw error codes)
- **Success**: Confirmation appropriate to the action's significance
- **Partial**: Mixed states (some data loaded, some failed)

## 8. Essential Principles for SKILL.md

These should be in the SKILL.md router file (always loaded regardless of workflow):

1. **Specify, don't decorate** — The UX plan describes structure, behavior, and hierarchy. It never prescribes colors, fonts, or pixel values. Those belong to the design system.

2. **Every state matters** — A component without all its states defined is an incomplete component. Default-only specs guarantee agent improvisation.

3. **Trace everything** — Every UX decision must link to a story map activity or user story. If a UX element can't be traced, it either shouldn't exist or the story map has a gap.

4. **Abstract the visual, specify the behavioral** — "High emphasis, positioned top-left" is good. "#1E40AF, 24px, left: 16px" is not. But "clicking the chip toggles the filter and updates the grid immediately" IS specific enough.

5. **Accessibility is structural** — Don't bolt on accessibility as a separate concern. Semantic HTML choices, focus management, and keyboard navigation are part of the component spec, not an afterthought.

## 9. Success Criteria

The skill is successfully built when:

- [ ] Invoking with a story map produces a complete UX-DESIGN-PLAN.md
- [ ] Output contains all 11 sections with no placeholders
- [ ] Every component has all applicable states specified
- [ ] Visual hierarchy uses combined role-based + semantic naming
- [ ] No specific colors, fonts, or pixel values appear in output
- [ ] Every UX decision traces to a source ID (SM-XXX or US-XXX)
- [ ] Output validates against Nielsen's 10 heuristics
- [ ] Responsive behavior is explicit for all breakpoints
- [ ] Accessibility requirements are woven into component specs
- [ ] Output respects 500-line splitting rule
- [ ] Data states (loading, empty, error, success) defined for all dynamic components
- [ ] A coding agent reading the output + a design system can implement without guesswork

## 10. Anti-Patterns

The skill should explicitly guard against:

- **Template-filling without analysis** — Mechanically filling sections without adapting to the project's specific needs
- **Over-specification** — Prescribing implementation details (CSS classes, framework-specific patterns)
- **Under-specification** — Leaving states undefined, saying "standard behavior" without defining it
- **Design system leakage** — Including colors, fonts, or pixel values in the output
- **Missing traceability** — UX elements that don't trace to any requirement
- **Desktop-first bias** — Specifying desktop layout in detail, leaving mobile as "it stacks"
- **Accessibility as appendix** — Treating accessibility as a separate section instead of per-component requirement
- **Invented requirements** — Adding UX elements that aren't backed by any story map activity

## 11. Research Roadmap

The following research areas must be investigated before building the skill. Each area maps to a reference file in the skill's `references/` directory. Conduct deep research on each and produce a research output document. Both this spec and the research output will be inputs to `create-agent-skills`.

### 11.1 Nielsen's Heuristics Applied to UX Plan Generation

**Maps to**: `references/nielsen-heuristics.md`

Research questions:
- How do you translate each of the 10 heuristics into a UX plan validation checklist? (i.e., what specific questions should the skill ask about the generated plan to verify compliance with each heuristic?)
- What are common heuristic violations in UX specifications — not in live UIs, but in spec documents themselves? (e.g., a spec that defines no loading states violates "visibility of system status")
- What does a heuristic-compliant UX plan look like vs a non-compliant one? Concrete examples.
- Are there established UX audit frameworks that use Nielsen's heuristics as a checklist for spec review (not usability testing)?

### 11.2 Atomic Design — Practical Component Classification

**Maps to**: `references/atomic-design.md`

Research questions:
- What are the decision criteria for classifying UI elements as atom vs molecule vs organism? Where are the boundaries?
- How do real-world design systems (Shopify Polaris, Atlassian Design System, GitHub Primer, Radix UI) apply atomic design principles? What patterns emerge?
- How should component states be systematically documented? Is there a standard format or taxonomy for UI component states (default, hover, active, disabled, loading, error, focus)?
- What component types appear across most web applications? (A universal component inventory to use as a starting checklist)

### 11.3 WCAG 2.1 AA — Per-Component Accessibility Patterns

**Maps to**: `references/accessibility-wcag.md`

Research questions:
- What are the specific accessibility requirements for common component types: cards, grids, filter chips/toggles, badges, navigation bars, hero sections, modals, forms?
- What ARIA patterns are most commonly needed for interactive web components? (WAI-ARIA Authoring Practices guide patterns)
- What are the standard focus management patterns: focus trap, focus return after action, roving tabindex for widget groups?
- How should keyboard navigation be specified for: filter chip groups, card grids, navigation menus?
- How do you specify color contrast requirements abstractly (without specifying actual colors) in a UX plan?

### 11.4 Responsive Design Patterns

**Maps to**: `references/responsive-patterns.md`

Research questions:
- What are the commonly used breakpoint strategies? (Tailwind defaults, Bootstrap defaults, Material Design breakpoints) Which to recommend and when?
- What are the standard layout transformation patterns at breakpoints? (grid column reduction, element stacking, show/hide, reorder)
- What does current research say about minimum touch target sizes? (Apple HIG, Material Design, WCAG 2.5.5)
- Mobile-first vs desktop-first: what are the practical trade-offs for spec writing (not coding)?
- How should typography scale across viewports? Are there established responsive type scales?

### 11.5 Data States and Microcopy

**Maps to**: `references/data-states.md`

Research questions:
- When should a loading state use skeleton screens vs spinners vs progress bars vs placeholder content? Decision criteria.
- What are best practices for empty state design? (patterns from real products: Slack, GitHub, Linear, Notion)
- What makes a good error message in a UI? (tone, structure, recovery action format) Research from NN/g, writing guidelines.
- How should success/confirmation states be designed relative to the action's significance?
- What are microcopy best practices for labels, tooltips, help text, and placeholder text? Is there a standard taxonomy?

### 11.6 Interaction Design Patterns

**Maps to**: `references/interaction-patterns.md`

Research questions:
- What are the standard interaction patterns for filter/faceted search? (chips, dropdowns, sidebars, combined approaches) When to use each?
- What are the standard interaction patterns for card-based content grids? (click behavior, hover states, selection, expansion)
- What transition/animation guidelines exist for web UX? (duration ranges, easing, what to animate vs not)
- How should immediate feedback vs deferred feedback be specified in a UX plan?
- What navigation patterns exist for single-page vs multi-page applications?

### 11.7 Information Architecture from User Journeys

**Maps to**: Part of the `create-ux-plan` workflow knowledge

Research questions:
- What methods exist for deriving information architecture from user story maps specifically? (not generic IA methods, but story-map-to-IA transformation)
- What navigation models are appropriate for different application types? (flat, hierarchical, hub-and-spoke, sequential)
- How should content hierarchy be determined from user journey analysis?
- What is a "page inventory" methodology and how does it relate to story map activities?

### 11.8 Abstract Visual Hierarchy Specification

**Maps to**: `references/visual-hierarchy.md`

Research questions:
- How do design systems define typography hierarchies abstractly (semantic scales like heading-1 through heading-6, body, caption, overline)?
- What emphasis level systems exist in design system documentation? (e.g., Material Design's "high/medium/low emphasis" pattern)
- How should reading order and scanning patterns (F-pattern, Z-pattern) be specified in a UX plan?
- What spatial hierarchy principles should a UX plan capture? (proximity, alignment, whitespace as hierarchy signal)
- How do existing UX spec tools/frameworks handle design-system-agnostic visual specification?

### Research Execution

Use `taches-cc-resources:research:deep-dive` to investigate these areas. **Do 2 areas per round** (4 rounds total) to ensure depth over breadth. Save all research output to `artifacts/research/skills/`.

| Round | Areas | Pairing Rationale |
|-------|-------|-------------------|
| 1 | 11.1 Nielsen's Heuristics + 11.2 Atomic Design | Foundational frameworks: validation methodology + component structure |
| 2 | 11.3 WCAG Accessibility + 11.4 Responsive Patterns | Per-component constraints: accessibility requirements + viewport behavior |
| 3 | 11.5 Data States & Microcopy + 11.6 Interaction Patterns | Behavioral: what happens in each state + how users trigger state changes |
| 4 | 11.7 Information Architecture + 11.8 Visual Hierarchy | Structural: page-level organization + element-level emphasis |

Both this spec and all research documents become inputs when invoking `create-agent-skills`.

---

## 12. How to Build This Skill

In a future session:

1. Invoke `taches-cc-resources:create-agent-skills`
2. Select "domain expertise skill" workflow
3. Provide this document (`roadmap/UX-SKILL-SPEC.md`) as reference context
4. The skill-building workflow will handle: research, directory creation, SKILL.md writing, workflow files, reference files, templates, validation, and testing

This spec document captures all strategic decisions — the skill-building workflow adds the implementation craft (XML structure, progressive loading, CSO compliance, validation scripts).

### Inputs to Provide

When invoking `create-agent-skills`, provide both:
1. **This spec**: `roadmap/UX-SKILL-SPEC.md` — strategic decisions, output template, workflow phases
2. **Research output**: The deep research documents in `artifacts/research/skills/` produced by `taches-cc-resources:research:deep-dive` — methodology details, patterns, examples, decision guidance for each reference area
