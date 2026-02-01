# Business Case: HookHub

## 1. Executive Summary

Developers using Claude Code lack a centralized, curated directory to discover open-source hooks that extend their workflow. Hooks are scattered across individual GitHub repositories, blog posts, community threads, and curated lists — with no single place to browse, filter, and evaluate them. HookHub solves this by providing a browsable, categorized web directory of open-source Claude Code hooks. The MVP focuses exclusively on displaying and browsing a curated catalog of hooks, each linking to its GitHub source. Success is measured by site visits and click-throughs to hook repositories.

## 2. Problem Statement

### Problem

Developers using Claude Code cannot efficiently discover open-source hooks that would enhance their workflow. The hook ecosystem is fragmented: hooks live in individual GitHub repositories, scattered across community-curated lists (e.g., awesome-claude-code with 20k+ stars), blog posts, and social media threads. There is no centralized, categorized, browsable directory.

### Current State

Today, a developer looking for Claude Code hooks must:
1. Search GitHub with various keyword combinations ("claude code hooks", "claudecode-hooks", etc.)
2. Browse community lists like awesome-claude-code — which mix hooks with skills, plugins, and other resources without structured categorization
3. Read through blog posts and forum threads to find mentioned hooks
4. Evaluate each hook individually by visiting its repository

This is a manual, time-consuming process with no filtering by category, lifecycle event, or quality.

### Impact

- **Time waste**: Developers spend time searching instead of coding
- **Missed value**: Good hooks go undiscovered because they lack visibility
- **Ecosystem friction**: The Claude Code hook ecosystem is growing rapidly (Claude Code holds ~52% AI coding market share with 18.9M MAU) but hook adoption lags because discovery is poor
- **Duplicated effort**: Developers may build hooks that already exist because they couldn't find them

## 3. Proposed Solution

### Solution Overview

HookHub is a web-based directory that displays a curated catalog of open-source Claude Code hooks in a browsable, filterable grid view. Each hook has a name, purpose category, lifecycle event, description, GitHub stars, and a link to its source repository. The curator maintains a local manifest of hook repo URLs, and the GitHub API enriches each entry with live metadata at build time.

### Business Options Considered

- **Option A: Do Nothing** — Developers continue searching across scattered sources. The hook ecosystem grows but remains fragmented. Discovery stays inefficient. Community-curated lists (awesome-claude-code) partially serve this need but lack structured browsing, filtering, and a dedicated UI. As the ecosystem grows (Anthropic projects $500M+ annualized Claude Code revenue), the discovery problem worsens.

- **Option B: Contribute to awesome-claude-code** — Add structure to the existing curated list. Low effort, but constrained by the list format (GitHub README), no filtering, no dedicated UX, and dependent on another maintainer's decisions.

- **Option C: Build HookHub (Proposed)** — A dedicated web directory with categorized grid view, filtering, and click-through to source. Requires building and maintaining a site, but provides a purpose-built discovery experience with full control over UX and curation.

**Recommendation**: Option C. The effort is low (MVP is a static-ish Next.js site with curated data), the value is clear (purpose-built discovery), and the timing is right (Claude Code ecosystem is growing rapidly).

## 6. Success Criteria & KPIs

| Criteria | Metric | Target | Measurement Method |
|----------|--------|--------|-------------------|
| People visit and browse | Unique visitors per month | 500+ within 3 months of launch | Manual tracking (analytics deferred to post-MVP) |
| People discover hooks | Click-throughs to GitHub repos | 30%+ of visitors click at least one hook | Manual tracking (analytics deferred to post-MVP) |
| Catalog coverage | Number of hooks listed | 15-25 curated hooks at launch | Manual count |
| Community awareness | External references | Listed in awesome-claude-code or shared in Claude Code community channels | Manual tracking |

## 7. Constraints

- **Timeline**: MVP — no hard deadline, but should ship quickly given simplicity
- **Budget**: Zero / side project — no external costs beyond hosting (Vercel free tier)
- **Team**: Solo developer — 1 person builds and maintains
- **Technical**: Next.js 16 (already bootstrapped), React 19 Server Components, TypeScript strict mode, Tailwind CSS v4, pnpm
- **Data source**: Local manifest file (`data/hooks.json`) lists curated hook repo URLs; GitHub API enriches entries at build time with live metadata (stars, descriptions, freshness)
- **Operational**: Read-only site. No user accounts, no authentication, no database, no API

## 8. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Small initial catalog makes site look empty | Medium | Medium | Launch with 15-25 well-researched hooks; design grid to look good at small counts |
| Hook repos go stale or are deleted | Medium | Low | Periodic link checking; build-time validation |
| Low traffic due to niche audience | Medium | Low | Share in Claude Code community; submit to awesome-claude-code list |
| GitHub API rate limits during build | Low | Medium | Cache build data; use conditional requests; build infrequently |

---

## 9. Business Requirements (BRD)

> These requirements define WHAT the business needs, not HOW it will be implemented.
> They serve as input to the requirements engineering phase.

### 9.1 Business Objectives

1. Provide a centralized, browsable directory of open-source Claude Code hooks
2. Enable developers to discover relevant hooks quickly through categorization and filtering
3. Drive click-throughs to hook source repositories on GitHub

### 9.2 Scope

#### In Scope
- Browsable grid display of curated Claude Code hooks
- Each hook displays: name, purpose category, lifecycle event, description, GitHub stars, and link to GitHub repository
- Dual-dimension filtering: by purpose category and by lifecycle event
- Responsive design (mobile, tablet, desktop)
- Local manifest file with curator-selected hooks, enriched via GitHub API at build time
- Curator-managed catalog (no community submissions for MVP)

#### Out of Scope
- User accounts, authentication, or personalization
- Community hook submissions (curator-only for MVP)
- Public API
- Hook installation or execution from the site
- User ratings, reviews, or comments
- Inline README rendering from GitHub
- Real-time data (data refreshes at build time only)

### 9.3 Business Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|------------|----------|-------------------|
| BR-01 | The business needs to display a catalog of Claude Code hooks in a grid layout so that developers can visually scan available hooks | Must | Grid displays all hooks in catalog; each hook shows name, purpose category, lifecycle event, description, GitHub stars, and repo link; grid is responsive across mobile/tablet/desktop |
| BR-02 | The business needs to classify each hook by purpose and lifecycle event so that developers can understand what it does and when it fires | Must | Every hook has one purpose category (Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom) and one lifecycle event (PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop); both are visually distinct on the card |
| BR-03 | The business needs to link each hook to its GitHub source repository so that developers can access the code | Must | Each hook card has a clickable link to the GitHub repo; link opens in a new tab; link is validated at build time |
| BR-04 | The business needs to filter hooks by category and lifecycle event so that developers can narrow results to their area of interest | Must | Primary filter by purpose category (Safety, Automation, etc.) and secondary filter by lifecycle event (PreToolUse, PostToolUse, etc.); selecting a filter shows only matching hooks; "All" option resets each filter |
| BR-05 | The business needs to present a clear landing experience so that first-time visitors understand what HookHub is | Must | Landing page communicates the site's purpose within 5 seconds; hook grid is visible without scrolling on desktop |
| BR-06 | The business needs to fetch hook data from GitHub at build time so that the catalog displays live metadata (stars, descriptions) | Must | A local manifest file lists hook repo URLs; at build time, the GitHub API enriches each entry with live data (stars, description, freshness); build degrades gracefully if GitHub API is unavailable (uses cached/fallback data) |
| BR-07 | The business needs to provide a fast, performant browsing experience so that developers don't bounce | Should | Page loads in under 2 seconds on a standard connection; initial content is server-rendered (no client-side loading spinner for main content) |
| BR-08 | The business needs to support dark and light display modes so that developers can browse comfortably in any environment | Could | Site respects system color scheme preference; content is readable in both modes |
| BR-09 | The business needs to allow text-based search across hook names and descriptions so that developers can find specific functionality | Could | Search input filters hooks in real-time as user types; "no results" state is shown when nothing matches |

### 9.4 Assumptions

- The Claude Code hook ecosystem will continue growing, sustaining demand for a discovery tool
- 15-25 quality hooks can be identified and curated for launch from the awesome-claude-code list (https://github.com/hesreallyhim/awesome-claude-code)
- Developers will discover HookHub through community channels (awesome-claude-code, social media, Claude Code forums)
- GitHub will remain the primary hosting platform for open-source hooks
- Vercel free tier is sufficient for hosting the MVP

### 9.5 Dependencies

- **GitHub**: Hook source repositories must be publicly accessible on GitHub
- **GitHub API**: Build-time data fetching depends on GitHub API availability and rate limits
- **Vercel**: Hosting and deployment platform (free tier)
- **Next.js / React ecosystem**: Framework stability for the application

### 9.6 Reference Documents

| Document | Location | Contains |
|----------|----------|----------|
| Project brief | `assets/BRIEF.md` | Original project idea and MVP scope direction |
| Claude Code Hooks Docs | https://code.claude.com/docs/en/hooks | Official hook reference — lifecycle events, configuration schema, matchers |
| awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code | Community-curated list of hooks, skills, plugins — potential data source for initial catalog |
| claude-code-hooks-mastery | https://github.com/disler/claude-code-hooks-mastery | Hook lifecycle event reference and patterns |
| claude-code-hooks | https://github.com/karanb192/claude-code-hooks | Ready-to-use hook collection with categories |

### 9.7 Open Items

| # | Open Item | Owner | Why Needed | Status |
|---|-----------|-------|------------|--------|
| OI-01 | Which specific hooks will be included in the launch catalog? | Curator (you) | Determines launch content and category coverage | **Resolved** — Source from the awesome-claude-code list (https://github.com/hesreallyhim/awesome-claude-code). Curator selects which hooks from that list appear in HookHub. |
| OI-02 | What is the exact category taxonomy? | Curator (you) | Affects filtering UX and hook classification | **Resolved** — Two filtering dimensions: primary filter by **purpose** (Safety, Automation, Notification, Formatting, Testing, Security, Logging, Custom) and secondary filter by **lifecycle event** (PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop). |
| OI-03 | What GitHub data structure will the build-time fetch use? | Curator (you) | Determines build pipeline design | **Resolved** — Maintain a local manifest file (e.g., `data/hooks.json`) listing hook repo URLs and metadata. At build time, enrich each entry by fetching live data from the GitHub API (stars, descriptions, freshness). The manifest controls which hooks appear; the API provides dynamic data. |
| OI-04 | Will analytics be added for tracking visits and click-throughs? | Curator (you) | Required to measure KPI targets in Section 6 | **Resolved** — No analytics for MVP. Success metrics in Section 6 will be measured manually or deferred to a post-MVP enhancement. |
