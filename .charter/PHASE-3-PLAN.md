# Phase 3 Plan: Filter & Data Pipeline Polish

## Metadata
- **Phase:** 3
- **Release:** MVP
- **Wave:** Wave 2 (parallel -- independent enhancements)
- **Source Stories:** SM-012, SM-014, SM-016, SM-020
- **Derived User Stories:** US-012, US-014, US-016, US-020
- **Date Generated:** 2026-02-08
- **Architecture Layers Touched:** Domain, Application, Adapters
- **UX Inputs Loaded:** Yes — Design OS export (sections: filter-system, hook-catalog)

## Story Summary

Phase 3 polishes the filter UX and hardens the data pipeline established in Phase 1. Two stories (US-014, US-016) add "All" reset options to the category and lifecycle event filter rows — the FilterBar component already renders "All" chips and uses `null` in FilterState to represent the unfiltered state, so these stories focus on verifying and formalizing the behavior with explicit tests. US-012 adds build-time repo link validation by leveraging the GitHub API response already fetched during enrichment. US-020 formalizes the local manifest as the authoritative source of catalog entries with build-time JSON schema validation. All four stories are independent.

| Story | Name | Layer Coverage | Task Count |
|-------|------|---------------|------------|
| US-012 | Validate repo links at build time | Application, Adapters | 3 |
| US-014 | "All" option resets category filter | Adapters | 2 |
| US-016 | "All" option resets lifecycle event filter | Adapters | 2 |
| US-020 | Local manifest file controls which hooks appear | Domain, Application, Adapters | 4 |

## Task Decomposition

### Story US-012: Validate repo links at build time

> As a curator, I want repository links validated during the build process so that broken links are caught before they reach users.

**Context:** The existing `enrichManifest` function in `lib/application/enrich-manifest.ts` already calls `fetchRepoMetadata` for each hook, which makes an HTTP request to the GitHub API. Per AC, validation should reuse this response (no extra request). A failed fetch already creates an `EnrichmentFailure` entry. The story requires: (1) explicitly logging validation results, (2) ensuring the build warns but does not fail on broken links, and (3) surfacing a validation summary.

#### Layer: Application

**Task 1: Add link validation reporting to enrichManifest** (`lib/application/enrich-manifest.ts`)
- **Input:** AC requirements — build outputs a warning for unreachable repos; build does not fail on a single broken link; validation results are logged for curator review; validation reuses the GitHub API response from metadata fetch (no extra request)
- **Output:** Enhanced `EnrichManifestOutput` with a `validationResults` array that reports per-hook URL accessibility status (success or failure with HTTP status code). The existing `failures` array already captures fetch errors — this task adds structured validation metadata (URL, status, reachable boolean) to each result for logging purposes
- **Test:** Unit tests verifying: (1) successful fetches produce `reachable: true` validation entries, (2) failed fetches produce `reachable: false` with error details, (3) the output `summary` string includes validation counts, (4) the function does NOT make additional HTTP requests beyond `fetchMetadata`

**Task 2: Add link validation logging to enrichment script** (`scripts/enrich.ts`)
- **Input:** Enhanced `EnrichManifestOutput` from Task 1 with `validationResults` array
- **Output:** Build script logs validation results as warnings (not errors) to stdout — each unreachable URL is logged with its HTTP status; a summary line reports "Validated X/Y repo links; Z unreachable". Build exits successfully even when links are broken
- **Test:** Integration test verifying: (1) the enrichment script logs warnings for unreachable URLs, (2) the script exits with code 0 even when some URLs are unreachable, (3) log output includes the validation summary line

#### Layer: Adapters

**Task 3: Add E2E test for link validation build output** (`tests/e2e/link-validation.spec.ts`)
- **Input:** Enrichment script with validation logging from Tasks 1-2
- **Output:** E2E test that runs the enrichment pipeline with a test manifest containing a known-bad URL and verifies warning output appears in build logs without build failure
- **Test:** Playwright test asserting: (1) build completes successfully, (2) validation warning appears in output for the bad URL, (3) valid hooks are still enriched correctly
- **Reference:** design-os-export/sections/hook-catalog/

---

### Story US-014: "All" option resets category filter

> As a developer who has filtered by category, I want an "All" option to clear my category filter so that I can return to viewing the full catalog.

**Context:** The existing `FilterBar.tsx` already implements this behavior — `categoryOptions` includes `{ value: null, label: 'All' }` as the first entry, and selecting it sets `filterState.category` to `null`, which `filterHooks()` treats as "no constraint". The "All" chip uses `selectedCategoryStyles` when active (visually distinct). This story formalizes the existing behavior with dedicated tests.

#### Layer: Adapters

**Task 1: Add unit tests for "All" category chip behavior** (`app/components/__tests__/FilterBar.all-category.test.tsx`)
- **Input:** AC requirements — "All" chip appears first in category row; "All" is selected by default when no category filter is active; clicking "All" deselects any active category chip and shows all hooks (subject to any active event filter); "All" chip has a visually distinct state when active; resetting the category filter does not affect the lifecycle event filter
- **Output:** Unit test suite covering all 5 acceptance criteria for the "All" category chip in FilterBar
- **Test:** Tests asserting: (1) "All" is the first chip in the category radiogroup, (2) "All" has `aria-checked="true"` on initial render, (3) clicking a category then clicking "All" restores full list, (4) "All" chip styling differs from inactive chips, (5) resetting category preserves the active event filter
- **Reference:** design-os-export/sections/filter-system/

**Task 2: Add E2E test for "All" category reset flow** (`tests/e2e/filter-all-category.spec.ts`)
- **Input:** Existing deployed page with FilterBar component
- **Output:** E2E test covering the full user flow: select a category → observe filtered results → click "All" → observe unfiltered results (respecting any active event filter)
- **Test:** Playwright test asserting: (1) default state shows "All" selected with full hook count, (2) selecting a category reduces visible hooks, (3) clicking "All" restores full count, (4) event filter remains active when category is reset to "All"
- **Reference:** design-os-export/sections/filter-system/

---

### Story US-016: "All" option resets lifecycle event filter

> As a developer who has filtered by lifecycle event, I want an "All" option to clear my event filter so that I can return to viewing hooks across all lifecycle events.

**Context:** Mirrors US-014 for the event dimension. The existing `FilterBar.tsx` already includes `{ value: null, label: 'All' }` as the first entry in `eventOptions`. Selecting it sets `filterState.event` to `null`. This story formalizes the existing behavior with dedicated tests.

#### Layer: Adapters

**Task 1: Add unit tests for "All" event chip behavior** (`app/components/__tests__/FilterBar.all-event.test.tsx`)
- **Input:** AC requirements — "All" chip appears first in event row; "All" is selected by default when no event filter is active; clicking "All" deselects any active event chip and shows all hooks (subject to any active category filter); resetting the event filter does not affect the category filter
- **Output:** Unit test suite covering all 4 acceptance criteria for the "All" event chip in FilterBar
- **Test:** Tests asserting: (1) "All" is the first chip in the event radiogroup, (2) "All" has `aria-checked="true"` on initial render, (3) clicking an event then clicking "All" restores full list, (4) resetting event preserves the active category filter
- **Reference:** design-os-export/sections/filter-system/

**Task 2: Add E2E test for "All" event reset flow** (`tests/e2e/filter-all-event.spec.ts`)
- **Input:** Existing deployed page with FilterBar component
- **Output:** E2E test covering the full user flow: select an event → observe filtered results → click "All" → observe unfiltered results (respecting any active category filter)
- **Test:** Playwright test asserting: (1) default state shows "All" selected with full hook count, (2) selecting an event reduces visible hooks, (3) clicking "All" restores full count, (4) category filter remains active when event is reset to "All"
- **Reference:** design-os-export/sections/filter-system/

---

### Story US-020: Local manifest file controls which hooks appear

> As a curator, I want to maintain a local manifest file that lists curated hooks and their metadata so that I have full control over which hooks appear in the directory.

**Context:** The existing `data/hooks.json` manifest and `lib/adapters/manifest-reader.ts` already establish this pattern. The `enrichManifest` pipeline reads from the manifest and only enriches listed entries. This story formalizes: (1) JSON schema validation at build time, (2) the guarantee that only manifest entries appear on the site, (3) the manifest supports 15-25+ entries, and (4) add/remove operations are reflected after rebuild.

#### Layer: Domain

**Task 1: Create JSON Schema for manifest validation** (`lib/domain/manifest-schema.ts`)
- **Input:** AC requirements — each entry includes at minimum: GitHub repo URL, hook name, purpose category, lifecycle event; manifest file is valid JSON with build-time schema validation. Existing `ManifestEntry` type in `lib/domain/types.ts` defines the shape. Existing `validateManifestEntry` in `lib/application/validate-manifest.ts` validates individual entries but does not validate the overall JSON structure (array of entries, no duplicates)
- **Output:** A manifest schema definition that validates: (1) the file is a valid JSON array, (2) each entry matches the ManifestEntry shape, (3) no duplicate `githubRepoUrl` entries exist, (4) the array is non-empty. Exports a `validateManifestSchema(data: unknown): ValidationResult` function that checks the full manifest structure
- **Test:** Unit tests for: (1) valid manifest passes, (2) non-array input fails, (3) empty array fails, (4) duplicate URLs fail, (5) entries with missing required fields fail, (6) entries with invalid purposeCategory/lifecycleEvent fail

#### Layer: Application

**Task 2: Integrate schema validation into build pipeline** (`lib/application/enrich-manifest.ts`)
- **Input:** `validateManifestSchema` from Task 1; existing `enrichManifest` function; AC that build-time schema validation should run before enrichment
- **Output:** `enrichManifest` calls `validateManifestSchema` on the raw manifest data before processing entries. If schema validation fails, the function returns early with validation errors in the `failures` array and an appropriate summary. This is a pre-enrichment guard, not a per-entry check (per-entry validation already exists via `validateManifestEntry`)
- **Test:** Unit tests verifying: (1) invalid manifest schema causes early return with descriptive error, (2) valid manifest proceeds to enrichment as before, (3) duplicate URL detection prevents enrichment of duplicates

**Task 3: Add performance test for manifest scale** (`lib/application/__tests__/enrich-manifest.scale.test.ts`)
- **Input:** AC requirement that manifest supports 15-25+ entries without build performance degradation
- **Output:** Test that creates a manifest with 25 entries (using mocked `fetchMetadata`) and verifies enrichment completes within acceptable time bounds and produces correct output
- **Test:** Test asserting: (1) 25-entry manifest enriches successfully, (2) all 25 hooks appear in output, (3) execution time is under 5 seconds (generous bound for mocked API)

#### Layer: Adapters

**Task 4: Add E2E test for manifest-driven catalog** (`tests/e2e/manifest-catalog.spec.ts`)
- **Input:** Existing site with `data/hooks.json` manifest; AC that only manifest entries appear on site and adding/removing entries changes the catalog after rebuild
- **Output:** E2E test verifying: (1) the number of hooks displayed on the page matches the number of entries in `data/hooks.json`, (2) each displayed hook name corresponds to a manifest entry, (3) no hooks appear that are not in the manifest
- **Test:** Playwright test that reads the manifest file, loads the page, and asserts hook count and names match
- **Reference:** design-os-export/sections/hook-catalog/

## Parallelism Analysis

All four stories are independent — they modify different files and have no mutual dependencies:

### Parallel Group 1 (can run simultaneously)
- **US-014:** "All" option resets category filter — touches only `FilterBar` tests (unit + E2E); no production code changes expected
- **US-016:** "All" option resets lifecycle event filter — touches only `FilterBar` tests (unit + E2E); no production code changes expected; independent of US-014 (different filter dimension, different test files)
- **US-012:** Validate repo links at build time — touches `enrich-manifest.ts` and `scripts/enrich.ts`; no overlap with filter stories
- **US-020:** Local manifest file controls which hooks appear — touches `manifest-schema.ts` (new), `enrich-manifest.ts` (schema integration), and E2E tests; US-020 modifies `enrich-manifest.ts` which US-012 also modifies

### Sequential Dependencies
- **US-012 and US-020** both modify `lib/application/enrich-manifest.ts`. While they touch different concerns (link validation reporting vs. schema pre-validation), they should be assigned to the same agent OR executed sequentially to avoid merge conflicts.

### Recommended Execution Order
1. **US-014 + US-016** — dispatch to parallel agents (independent filter test stories, no production code conflicts)
2. **US-020 then US-012** — execute sequentially by one agent (both modify `enrich-manifest.ts`; US-020's schema validation is a pre-enrichment guard that should be in place before US-012 adds validation reporting)

> **For Claude — superpowers:writing-plans:**
> This PHASE-3-PLAN.md is the spec input for `superpowers:writing-plans`.
> Feed the Task Decomposition section (story by story) into `writing-plans`
> to produce a detailed implementation plan with TDD steps
> (RED-GREEN-REFACTOR) baked into each task. The Parallelism Analysis
> section determines agent dispatch order via
> `superpowers:dispatching-parallel-agents`. Do not modify the Metadata
> or Story Summary sections — they are reference context, not work items.
