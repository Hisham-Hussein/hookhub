# Decision Log

## 2026-02-01: Architecture input decided — SRS + business case, not user stories

Decided `/create-design-doc` should consume REQUIREMENTS.md + BUSINESS-CASE.md. Architecture describes system structure (component relationships, data flow, tech choices), not release phasing — so user stories add no architectural value beyond what the SRS already captures. The SRS domain groupings (FR-CAT, FR-FILT, FR-DATA) map directly to system components, and the NFRs drive technology decisions (server rendering, build-time caching, graceful degradation).

## 2026-02-01: REQUIREMENTS.md generated in SRS format (52 FR + 9 NFR + 1 TRANS)

Generated `.charter/REQUIREMENTS.md` via `/create-requirements` in SRS-only mode (USER-STORIES.md already existed). 52 functional requirements across 7 domains (CAT, CARD, LAND, FILT, SRCH, UI, DATA), 9 non-functional requirements (ISO 25010: Performance, Reliability, Interaction Capability, Maintainability, Flexibility), 1 transition requirement. One implicit requirement identified: FR-FILT-12 (empty state when AND filters produce zero results) — a gap in the story map's MVP slice.

## 2026-02-01: USER-STORIES.md generated with 21 stories in story-map mode

Generated `.charter/USER-STORIES.md` via `/create-requirements` using story-map mode. 21 US-XXX stories (4 epics, 9 features) with full acceptance criteria, 1:1 mapping to all SM-XXX, traceability to all 9 BR-XX. Resolved design context (G-03 compact cards, G-04 toggle chips, G-05 AND logic) incorporated directly into AC. Must-haves at 76% (16/21) — exceeds 60% guideline but acceptable given minimal MVP scope.

## 2026-02-01: Patched create-requirements skill to parse resolved story map context

Modified `/create-requirements` SKILL.md (in claude-forge plugin cache) to add Phase 1c.6 (Extract Resolved Context) and updated the story-map mode AC template to reference resolved context. This ensures resolved gaps from STORY-MAP.md flow into acceptance criteria automatically without a manual user prompt. Cache-based edit — will be lost on plugin update.
