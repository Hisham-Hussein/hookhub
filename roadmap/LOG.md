# Decision Log

## 2026-02-06: /plan-phase-tasks skill built — SKILL.md, template, slash command committed to claude-forge

Built the skill via `/create-agent-skills` using the 67KB Leg 2 spec (8 review rounds, 56 issues resolved). Simple pattern (366 lines, no router), pure XML structure. Reuses pre-existing `trace-phase-stories.py` and `generate-section-manifest.py` scripts (149 pytest tests). Validation script passed, self-verification subagent confirmed PASS on all 7 checks. Committed to claude-forge master (`e61c3ad`) and synced cache. UX expertise skill was already built in a prior session — marked complete.

## 2026-02-04: Spec review round 8 — 8 issues found, 1 fixed, 5 invalid/skipped, 2 downstream

Sub-agent review surfaced 8 issues; orchestrator critically evaluated each with user input. One fix applied: wave metadata extraction paragraph added (L384) explaining skill must parse ROADMAP.md directly since trace script doesn't output wave info. Model name "GPT-4.1-mini" dismissed as invalid — script already tested with 100% mapping. Issues #2 and #3 (writing-plans doc flow, dispatching-parallel-agents usage) deferred as downstream superpowers integration concerns, not skill implementation issues. Spec is now ready for `/create-agent-skill` consumption after 8 review rounds.

## 2026-02-04: Spec review round 7 — 8 issues found, 5 fixed, 2 invalid, 1 already minor

Sub-agent review surfaced 8 issues; orchestrator critically evaluated each, disagreeing with 2 agent severity ratings. Key fixes: (1) SM→US conversion flow now explicit in manifest lookup section (agent claimed Critical, downgraded to Important — info was scattered not missing), (2) USER-STORIES.md `**Parent:** SM-XXX` format contract documented alongside ROADMAP.md contract (traced to `/create-requirements` lines 544 and 745), (3) manifest.json R2/Future coverage limitation documented as by-design (update traceability matrix before planning non-MVP UI phases). Agent's "Critical" `writing-plans` format incompatibility was invalid — agent confused input format with output format. Tracking table added at line 853+.

## 2026-02-03: Spec review round 6 — 7 issues found, 3 fixed, 2 invalid, 1 deferred, 1 skipped

Sub-agent code-reviewer found 7 issues; main agent critically evaluated each, user challenged 2 assessments leading to better fixes. Key fixes: (1) UX traceability fallback now skips docs instead of loading unbounded content (preserves progressive loading), (2) Design OS export is authoritative when present — DESIGN-TOKENS.md only as fallback (clarified precedence model), (3) Skill auto-generates manifest.json if missing (reduces user friction). Superpowers integration verification deferred to post-build. Tracking table added to spec at line 835+.

## 2026-02-03: Spec review round 5 — 1 stale Option A reference fixed

Self-review (not sub-agent) found line 385 still said "instruction files and section docs are loaded for planning" — contradicting the Option B decision where nothing is loaded at planning time (all Design OS content is referenced by path, loaded by superpowers at implementation time). Fixed to be consistent with the 7 other Option B edits. Spec is now internally consistent and ready for `/create-agent-skill` consumption.

## 2026-02-03: Spec review round 4 complete — built generate-section-manifest.py to resolve Issue 6

Sub-agent reviewed spec and found 8 issues; main agent evaluated each, agreeing with 1 critical issue (Design OS section matching ambiguity). Resolved by building `generate-section-manifest.py` — a GPT-4.1-mini-powered script that parses UX-FLOWS.md traceability matrix and semantically matches UX elements to Design OS section directories. Script produces `manifest.json` for instant lookup by `/plan-phase-tasks`. Verified against HookHub: 18 rows parsed, 16 stories, 100% mapped. 35 pytest tests covering parsing, generation, validation, and edge cases. Both scripts (`trace-phase-stories.py` and `generate-section-manifest.py`) are now project-agnostic — ready for skill build.

## 2026-02-02: Spec review round 3 — 11 issues found, 3 dismissed as already addressed, 5 fixed

Sub-agent reviewed SKILL-DESIGN-PLAN-PHASE-TASKS.md and surfaced 11 issues (2 Critical, 4 Significant, 5 Minor). Main agent verified each, then user corrected 3 further: Issues 1-2 (UX traceability, `--has-ui` determination) were already solved by prior session's `--has-ui` flag design; Issue 3 (INVEST independence framing) handled by superpowers dispatching downstream. Five fixes applied: explicit document-order-is-execution-order statement, simplified ARCHITECTURE-DOC.md progressive loading to full Key Interfaces section, added Leg 2 skill identifier (`claude-forge:plan-phase-tasks`), widened output estimate to ~150-400 lines, documented trace script's heading format contract. Meta-lesson: review agents lack session history — they flag "gaps" that were deliberate design decisions from prior sessions.

## 2026-02-02: Verified spec review (round 2) — 3 of 12 issues survived, 3 were invalid

Sub-agent reviewed SKILL-DESIGN-PLAN-PHASE-TASKS.md and surfaced 12 issues (4 HIGH, 8 MEDIUM). Main agent verified every claim against filesystem and charter artifacts. Results: 3 issues completely invalid (agent declared scripts non-existent without checking — they exist with 40 passing tests; agent misattributed Leg 1's "generic, reusable" claim to Leg 2), 6 downgraded to LOW (valid observations but non-blocking or already handled by spec design), 3 survived as genuine MEDIUM gaps. The 3 actionable gaps: (1) invocation model unspecified — per-phase vs batch, arguments, (2) inter-story dependency detection heuristics missing, (3) PHASE-N-PLAN.md template header/structure undefined. Full findings at `roadmap/REVIEW-SPEC-FINDINGS-V2.md`. Meta-lesson: LLM reviewers are strong at structural analysis but weak at ground-truth verification — always check factual claims against the filesystem.

## 2026-02-02: All 9 skill spec review issues resolved — spec ready for skill build

Applied all fixes from `roadmap/REVIEW-SKILL-SPEC.md` to SKILL-DESIGN-PLAN-PHASE-TASKS.md: renamed "Infrastructure" → "Adapters" (6 locations, aligns with Clean Architecture canonical term), fixed phase counts (3/2/1 not 4/3), replaced stale `/plan-project-roadmap` → `/create-roadmap` (5 occurrences), added naming convention note (slash command singular, skill plural), added `.charter/` prefix to PHASE-N-PLAN.md output paths (6 locations), aligned Jira tables (user requested despite review saying skip), and split Files section into Existing/To Create. Issues #3 auto-resolved by #1, #8 skipped (Leg 1 only). Spec is now clean for `/create-agent-skill` consumption.

## 2026-02-02: Skill spec review completed — 1 HIGH, 5 MEDIUM fixes identified

Sub-agent review of SKILL-DESIGN-PLAN-PHASE-TASKS.md found the most critical issue: FDD task decomposition template uses "Layer: Infrastructure" throughout, but ARCHITECTURE-DOC.md defines the outermost layer as "Adapters." This mismatch would propagate into every PHASE-N-PLAN.md generated. Additional fixes: wrong phase counts in terminology example, stale `/plan-project-roadmap` name in Leg 2, unspecified output path for PHASE-N-PLAN.md, and "Files to Create" listing already-built scripts. Full findings at `roadmap/REVIEW-SKILL-SPEC.md`.

## 2026-02-02: Pipeline diagram fixed — /create-ux-plan no longer feeds into /create-roadmap

The pipeline diagram in SKILL-DESIGN-PLAN-PHASE-TASKS.md incorrectly showed `/create-ux-plan` on the same vertical flow into `/create-roadmap`. Restructured into three visually separated sections: (1) parallel artifact generation (`/create-requirements` + `/create-ux-plan` branching from STORY-MAP.md), (2) `/create-roadmap` with only STORY-MAP.md + ARCHITECTURE-DOC.md as inputs, (3) `/plan-phase-tasks` with all its conditional inputs. Also corrected the old name `/plan-project-roadmap` to `/create-roadmap`.


