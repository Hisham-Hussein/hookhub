# Integration Research: Execution Frameworks

> **Date:** 2026-02-02
> **Status:** Complete — **Superpowers selected** (2026-02-02)
> **Method:** Evaluator-synthesizer pattern (6 independent evaluators + 1 synthesizer)
> **Revision:** Spec Kit C5 re-scored from 3→4 based on video evidence. Spec Kit C6 subsequently identified as inflated (maintenance stale since Dec 2025). Final decision overrides scoring recommendation. See revision notes below.

## Executive Summary

**Superpowers** is the selected execution framework despite Spec Kit's marginally higher evaluation score (4.10 vs 4.00). The scoring recommendation favored Spec Kit based on superior parallelism (C4: 4 vs 3) and change flexibility (C5: 4 vs 3, revised via video evidence). However, three practical factors override the 0.10-point gap:

1. **Spec Kit's C6 (Maturity) is inflated.** Post-evaluation investigation revealed: last commit Dec 4 2025, creator (Den Delimarsky) left GitHub for Anthropic, 81 unreviewed PRs, 625 open issues, zero maintainer comments in recent history. Correcting C6 from 5 to 3 would drop Spec Kit to 3.90 (behind Superpowers at 4.00). Even a conservative correction to 4 produces a tie.

2. **5 of 7 Spec Kit commands duplicate existing claude-forge skills.** Our pipeline already has `/create-business-case`, `/create-requirements`, `/create-roadmap`, `/plan-phase-tasks`, and Superpowers' execution skills — covering Spec Kit's `specify`, `plan`, `tasks`, `implement`, and `constitution` commands. Only `clarify` (blind-spot detection) and `analyze` (cross-artifact consistency) are unique.

3. **Superpowers is actively maintained.** v4.1.1, last commit Jan 30 2026, active maintainer (Jesse Vincent/obra), marketplace distribution with automatic updates. It integrates cleanly at the PHASE-N-PLAN.md → `writing-plans` seam with no adapter needed.

The evaluation scores and analysis below remain valid as a comparative assessment. Spec Kit's unique capabilities (`clarify`, `analyze`) are noted as potential future claude-forge skills — they are framework-agnostic concepts that can be built independently.

## Scoring Matrix

| Candidate | C1 (20%) | C2 (20%) | C3 (20%) | C4 (10%) | C5 (20%) | C6 (10%) | **Weighted Total** | Status |
|-----------|----------|----------|----------|----------|----------|----------|-------------------|--------|
| **Spec Kit** | 3/5 | 4/5 | 5/5 | 4/5 | **4/5** ↑ | 5/5 | **4.10** | **Recommended** |
| Superpowers | 3/5 | 5/5 | 5/5 | 3/5 | 3/5 | 5/5 | **4.00** | Pass |
| BMAD Method | 2/5 | 4/5 | 3/5 | 3/5 | 4/5 | 5/5 | **3.40** | Pass |
| everything-claude-code | 2/5 | 4/5 | 4/5 | 3/5 | 3/5 | 5/5 | **3.40** | Pass |
| OpenSpec | 2/5 | 3/5 | 3/5 | 3/5 | 4/5 | 4/5 | **3.10** | Pass |
| Design OS | 2/5 | 1/5 | 3/5 | 2/5 | 3/5 | 4/5 | **2.40** | **Eliminated** (C2=1) |

> **↑ Revised score.** Spec Kit C5 upgraded from 3/5 to 4/5 based on video evidence. See [Revision Notes](#revision-notes) for details.

## Calibration Notes

Cross-calibration examined whether similar capabilities received consistent scores across evaluators. The following discrepancies were analyzed:

### C1 (Pipeline Compatibility): Spec Kit 3 vs. everything-claude-code 2

Both frameworks generate their own plan formats and neither natively consumes our ROADMAP.md/USER-STORIES.md structure. The evaluator awarded Spec Kit a 3 based on its modular artifact chain (constitution -> spec -> plan -> tasks) and the fact that each artifact can be regenerated per-phase. The everything-claude-code evaluator scored a 2 because the planner agent expects "free-form feature requests" with no structured input mechanism. **Score upheld.** Spec Kit's per-phase invocation model and template-based customization provides a more viable adapter path than everything-claude-code's free-form input, justifying the 1-point gap.

### C2 (Testability & TDD): Superpowers 5 vs. Spec Kit 4 vs. everything-claude-code 4 vs. BMAD 4

Superpowers received a 5 for its non-negotiable RED-GREEN-REFACTOR with code deletion enforcement and the `verification-before-completion` evidence gate. Spec Kit received a 4 for enforcing test-before-code ordering but lacking explicit multi-layer test strategy per work unit. everything-claude-code received a 4 for its TDD guide agent covering unit/integration/E2E layers but not defining test expectations per user story. BMAD received a 4 for its TEA module with ATDD workflow, but with a known integration gap (#843) where TEA and Dev agents do not automatically coordinate. **All scores upheld.** The distinction between Superpowers' 5 and the others' 4 is well-supported: Superpowers mandates code deletion for TDD violations, which is a harder enforcement mechanism than any other framework offers. The BMAD score of 4 is generous given the TEA/Dev coordination gap, but the ATDD workflow design itself is sound -- the issue is implementation maturity, not methodology.

### C3 (Agent Discipline): Spec Kit 5 vs. Superpowers 5 vs. everything-claude-code 4 vs. BMAD 3 vs. OpenSpec 3 vs. Design OS 3

Spec Kit and Superpowers both received 5s. Spec Kit's strength is the `/speckit.analyze` cross-artifact consistency checker and constitution-based guardrails. Superpowers' strength is five interlocking skills with exact file paths, exact code samples, and exact commands. Both are justified at 5 -- they achieve excellent discipline through different mechanisms. BMAD received a 3 despite having 21+ specialized agents with YAML workflows and checklists. The evaluator cited real-world GitHub issues showing agent drift and "fresh-chat-per-workflow" as the primary guardrail. **BMAD score upheld.** Aspirational design does not equal reliable execution; the evidence of agent drift in practice correctly penalizes the score. everything-claude-code at 4 is appropriate -- tool-access restrictions per agent (e.g., code-reviewer gets Read/Grep/Glob only) provide genuine structural constraints, but task-level discipline is weaker than Spec Kit or Superpowers.

### C4 (Parallel Execution): Spec Kit 4 vs. others at 2-3

Spec Kit received a 4 for explicit [P] markers on tasks, dependency graphs, and three delivery approaches (MVP-first, incremental, parallel team). No other framework received higher than 3. **Score upheld.** Spec Kit is the only framework that makes parallelism a first-class property of its task format rather than an opt-in or opportunistic feature.

### C5 (Change Flexibility): OpenSpec 4 vs. BMAD 4 vs. Spec Kit 4 (revised) vs. others at 3

OpenSpec's "fluid not rigid" philosophy with delta-specs (ADDED/MODIFIED/REMOVED) and the BMAD `*correct-course` workflow both received 4s. Superpowers and everything-claude-code received 3s. **Spec Kit revised from 3 to 4** based on post-evaluation video evidence demonstrating that specs are living documents supporting incremental modification — not "wholesale regeneration" as originally characterized. The video showed mid-plan modifications (removing test tasks), mid-project scope changes (dropping pagination), selective downstream propagation, and post-implementation learning encoding back into specs — all without pipeline restart. See [Revision Notes](#revision-notes) for full evidence.

### C6 (Maturity & Community): Range of 4-5

Spec Kit (66.9k stars, GitHub-maintained), Superpowers (42.2k stars), BMAD (30k+ stars), and everything-claude-code (17.8k+ stars) all received 5s. OpenSpec (16-21k stars) and Design OS (1.4k stars) received 4s. **Adjustment considered but not applied.** The 5-point scale does not allow finer distinction within the top tier. All four frameworks scoring 5 have strong institutional backing or community adoption. OpenSpec's 4 is appropriate given its younger maturity (v1.1.1) and known parallel merge data-loss issue. Design OS's 4 is generous for a 1.4k-star solo-creator project, but the evaluator correctly noted the active development, paid community, and 20-year track record of the creator.

### Summary of Adjustments

**One score was adjusted post-evaluation.** Spec Kit C5 (Change Flexibility) was revised from 3/5 to 4/5 based on video evidence from the creator's demonstration. All other evaluator scores are consistent with the evidence provided and represent defensible assessments when compared across frameworks. See [Revision Notes](#revision-notes) for the full re-evaluation.

## Framework Assessments

### #1: Spec Kit
**Score: 4.10/5.00** (revised from 3.90; C5 upgraded 3→4)

Spec Kit is the most structurally rigorous framework evaluated, with the best agent discipline mechanisms (constitution, checklist gating, cross-artifact consistency analysis) and the only framework that makes parallel task execution a first-class property of its task format via [P] markers. Its institutional backing by GitHub (66.9k stars) provides exceptional longevity confidence. A post-evaluation video demonstration by the creator revealed that the original C5 weakness ("wholesale regeneration on scope change") was inaccurate — specs and plans are living documents that support incremental, human-directed modification without pipeline restart. This correction, combined with strong-enough TDD defaults and superior parallelism, pushes Spec Kit 0.10 points ahead of Superpowers.

**Key strengths:**
- Cross-artifact consistency validation (`/speckit.analyze`) detecting coverage gaps, ambiguity, and constitution violations — a unique capability confirmed working in practice
- `clarify` command surfaces underspecified requirements before planning begins — demonstrated catching 5 blind spots in a real project
- Explicit [P] markers for parallel tasks with dependency graphs and three delivery approaches
- Constitution mechanism naturally encodes our project's cross-cutting constraints (TypeScript strict, Tailwind v4, pnpm, Playwright E2E) and can encode TDD mandates
- Specs are living documents: mid-plan modifications, mid-project scope changes, and post-implementation learning encoding all work without pipeline restart
- TDD by default: plan templates generate test phases automatically; constitution can encode test mandates enforced by `analyze`
- 66.9k stars with GitHub as the maintaining organization provides exceptional institutional backing

**Key weaknesses:**
- Does not consume external plan documents natively; requires per-phase invocation with manual transcription of SM-XXX/US-XXX stories
- Own ID namespace (FR-001, SC-001, T001) conflicts with our SM-XXX/US-XXX/BR-XX scheme, requiring dual namespace reconciliation
- Phase-level parallelism (entire phases running in parallel) is not first-class; only task-level [P] markers are supported
- TDD enforcement is opt-out rather than structural — respects explicit user overrides (by design), unlike Superpowers' non-negotiable deletion enforcement

**Pipeline integration path:** For each PHASE-N, run `/speckit.specify` with the phase description and SM-XXX/US-XXX stories as input prompt. Run `/speckit.clarify` to surface blind spots in acceptance criteria. Our project constraints and TDD mandates are encoded in the Spec Kit constitution via `/speckit.constitution`. Plan and task generation produce per-phase artifacts. Wave parallelism requires independent spec/plan/tasks chains per parallel phase with manual orchestration at wave boundaries. The `/speckit.analyze` command validates cross-artifact consistency after changes. Post-implementation learnings are encoded back into specs for reproducibility.

### #2: Superpowers
**Score: 4.00/5.00**

Superpowers is the most execution-focused framework in the evaluation. It delivers the strongest TDD enforcement available (non-negotiable RED-GREEN-REFACTOR with mandatory code deletion for violations), comprehensive agent discipline through five interlocking skills, and the largest community footprint among Claude Code methodology frameworks. Its plan format — while not consuming our upstream artifacts natively — provides a clean integration seam: our PHASE-N-PLAN.md can serve as the "spec" input to `writing-plans`, bypassing brainstorming entirely. It falls 0.10 points behind Spec Kit due to weaker parallelism (C4: 3 vs. 4) and weaker change flexibility (C5: 3 vs. 4).

**Key strengths:**
- Non-negotiable TDD with code deletion enforcement and evidence-gated completion claims — the hardest TDD guarantee of any framework
- Five interlocking skills (writing-plans, executing-plans, test-driven-development, verification-before-completion, subagent-driven-development) create layered anti-drift architecture
- Plans specify exact file paths, exact code samples, and exact commands — no room for agent improvisation
- 42.2k stars, active v4.1.1 development, extensive documentation, marketplace distribution, multi-platform support

**Key weaknesses:**
- No native consumption of our ROADMAP.md/USER-STORIES.md structured artifacts; requires manual seeding of plans with SM-XXX/US-XXX references
- Plans are linear, written-once documents with no formal mechanism for mid-plan scope changes or incremental updates
- Parallel execution via `dispatching-parallel-agents` is opt-in and separate from the plan format; plans do not encode task independence or merge points
- Does not distinguish between test layers (unit/integration/E2E) in its TDD cycle — applies the same RED-GREEN-REFACTOR universally

**Pipeline integration path:** Our `/plan-phase-tasks` output serves as the "spec" input to Superpowers' `writing-plans` skill, bypassing the brainstorming phase. SM-XXX/US-XXX IDs are embedded in task descriptions for traceability. Wave-level parallelism (e.g., PHASE-2 and PHASE-3 in W2) is handled by dispatching two independent `executing-plans` sessions with the `dispatching-parallel-agents` convergence protocol at the wave boundary. Our Definition of Done checklist maps to `verification-before-completion` gates, and `finishing-a-development-branch` handles clean merge/PR workflow.

### #3 (tie): BMAD Method
**Score: 3.40/5.00**

BMAD is the most comprehensive framework evaluated, covering the entire development lifecycle from product brief through code review with 21+ specialized agents and 50+ workflows. Its `*correct-course` workflow for mid-implementation scope changes and Git-based artifact versioning give it the best change flexibility among top-tier frameworks. However, pipeline compatibility is weak (C1=2), agent discipline suffers from documented drift issues in practice, and the sequential story execution model conflicts with our wave-based parallelism.

**Key strengths:**
- Comprehensive spec-to-code pipeline with dedicated agents at every stage
- Built-in `*correct-course` workflow for structured mid-project scope changes
- TEA module with ATDD workflow provides genuine test-first development with multi-layer coverage
- 30k+ stars, dedicated docs site, Discord community, active v6 development

**Key weaknesses:**
- Generates its own specs rather than consuming external plan documents; requires significant manual mapping for our artifacts
- Agent drift documented in real-world GitHub issues despite structured YAML workflows and checklists
- Sequential story execution conflicts with wave-based parallelism; overriding this may introduce state-tracking instability
- TEA/Dev agent coordination gap (GitHub #843) undermines test-first workflow reliability

**Pipeline integration path:** Bypass BMAD Phases 1-3 (Analysis, Planning, Solutioning) since our upstream artifacts already cover this scope. Use the SM agent's `*sprint-planning` with our ROADMAP.md as a pre-existing epic file. Reformat US-XXX stories into BMAD's template.md structure. Run `*atdd` via TEA before each `*dev-story` for TDD. Wave parallelism requires separate simultaneous BMAD sessions with manual merge-point management. This uses approximately 30% of BMAD's total framework value.

### #3 (tie): everything-claude-code
**Score: 3.40/5.00**

everything-claude-code is an excellent execution-layer toolkit with production-grade TDD enforcement (three-layer coverage, 80% threshold, six-phase verification loop) and strong agent discipline through 13 specialized agents with restricted tool access. It is fundamentally a bottom-up framework (agents generate plans from requirements) rather than a top-down framework (plans drive agent execution), which creates significant friction with our spec-driven pipeline. Its primary value would be supplementing our execution layer with its TDD and verification capabilities rather than replacing our planning structure.

**Key strengths:**
- TDD guide agent + workflow skill + verification-loop skill create robust three-layer test pipeline (unit, integration, E2E)
- 13 purpose-built agents with restricted tool access (code-reviewer has read-only access)
- Six-phase pre-PR verification loop (build, type check, lint, test suite, security scan, diff review)
- Strong community (17.8k+ stars) with active cross-platform development

**Key weaknesses:**
- No structured plan consumption; our ROADMAP.md/USER-STORIES.md treated as unstructured context, not structured inputs
- Planner generates plans fresh each time with no incremental update support
- Parallelism is opportunistic, not declarative; no plan-level encoding of task independence
- Bottom-up orientation (agents derive plans) conflicts with our top-down pipeline (plans drive agents)

**Pipeline integration path:** ROADMAP.md serves as read-only context, not structured input. A translation layer converts ROADMAP.md phases into planner agent inputs and converts outputs back into PHASE-N-PLAN.md format. US-XXX acceptance criteria are injected as context for the TDD guide. Wave parallelism requires external orchestration logic. The TDD and verification capabilities alone may justify integration as a supplementary execution layer.

### #5: OpenSpec
**Score: 3.10/5.00**

OpenSpec brings the best change flexibility philosophy ("fluid not rigid," delta-spec format) but is weakened by no TDD enforcement (verification is post-hoc only), moderate agent discipline (empty AGENTS.md), and the weakest pipeline compatibility among non-eliminated frameworks. Its delta-spec format (ADDED/MODIFIED/REMOVED) is designed for brownfield codebases, not for consuming a pre-structured roadmap. The known data-loss issue with parallel merge further undermines confidence for our wave-based parallelism model.

**Key strengths:**
- Delta-spec format makes mid-project changes natural and incremental
- Active ecosystem (16-21k stars) with rapid growth, regular releases, multi-language support
- Given/When/Then scenario format aligns with testable acceptance criteria

**Key weaknesses:**
- No TDD enforcement; verification is post-implementation, not test-first
- No external plan ingestion; designed to own the full planning lifecycle
- Known data-loss issue with parallel merge of concurrent changes to same requirement
- Empty AGENTS.md indicates agent discipline rules are undocumented

**Pipeline integration path:** Each PHASE-N would be manually translated into an `/opsx:new` change folder. US-XXX acceptance criteria transcribed into Given/When/Then format. SM-XXX traceability preserved only as commentary. Wave parallelism via separate change folders with manual coordination to avoid merge conflicts. Significant manual bridging required.

### Eliminated: Design OS
**Score: 2.40/5.00 -- ELIMINATED (C2 = 1, dealbreaker)**

Design OS is a pre-implementation design tool, not an execution framework. It scored 1/5 on Testability & TDD because it contains zero testing methodology -- no TDD enforcement, no test expectations, no verification gates. Its four-phase process (Product Planning, Design System, Section Design, Export) focuses entirely on visual design and product specification. The companion tool Agent OS handles implementation, but Design OS itself is fundamentally out of scope for an execution framework evaluation.

**Elimination reason:** C2 (Testability & TDD) = 1. Our pipeline requires test-first development with unit, integration, and E2E layers as defined in each release's Definition of Done. A framework with zero testing methodology cannot serve as our execution layer.

## Cross-Cutting Observations

1. **All frameworks want to own the upstream pipeline.** Every evaluated framework generates its own planning artifacts (specs, plans, tasks) from user prompts or requirements documents. None natively consume an externally structured plan with pre-existing story IDs, wave dependencies, and acceptance criteria traceability. This is the single most consistent finding across all six evaluations and represents the fundamental integration challenge for any choice.

2. **None natively consume our ID scheme.** Our SM-XXX/US-XXX/BR-XX namespace has no first-class representation in any framework. Spec Kit uses FR-001/SC-001/T001, BMAD uses Story-042, and the others use ad-hoc naming. Traceability back to our ROADMAP.md and USER-STORIES.md will require manual convention-setting regardless of framework choice.

3. **TDD enforcement quality varies dramatically.** The range spans from zero (Design OS) through post-hoc verification (OpenSpec) to advisory (BMAD with TEA/Dev gap) to structural enforcement (Spec Kit, everything-claude-code) to non-negotiable hard rules (Superpowers with deletion enforcement). This criterion most clearly separates the top candidates.

4. **Wave-level parallelism is universally unsupported.** All frameworks handle parallelism at the task level (when they handle it at all), not at the phase level. Our wave-based model where entire phases run concurrently will require external orchestration regardless of framework choice.

5. **Community maturity does not correlate with pipeline fit.** The most-starred frameworks (Spec Kit at 66.9k, Superpowers at 42.2k, BMAD at 30k+) span C1 scores from 2 to 3. Community adoption reflects standalone value, not compatibility with a pre-existing spec-driven pipeline.

6. **Change flexibility does not necessarily trade off against agent discipline.** The original evaluation suggested an inverse correlation, but the Spec Kit re-evaluation disproved this: Spec Kit scores 5/5 on agent discipline and 4/5 on change flexibility (revised). Its living-document model with incremental modification achieves flexibility without sacrificing the constitution/analyze/clarify discipline mechanisms. The apparent tension was an artifact of evaluating change flexibility from documentation alone — the video demonstration revealed that Spec Kit's markdown-based artifacts support human-directed incremental changes that the written documentation did not emphasize.

## Recommendation

**Selected: Superpowers** (Score: 4.00/5.00) — overriding the scoring recommendation of Spec Kit (4.10/5.00)

### Why Superpowers Was Selected Over Spec Kit

The evaluation scores favored Spec Kit by 0.10 points. The final decision overrides this based on practical factors not fully captured by the scoring criteria:

1. **Maintenance risk disqualifies Spec Kit for production use.** The C6 score of 5/5 ("exceptional institutional backing") was based on GitHub's organizational ownership and 66.9k stars. Post-evaluation investigation revealed the repo is effectively abandoned: last commit Dec 4 2025, creator departed for Anthropic, 81 unreviewed PRs, 625 open issues, zero maintainer response in recent history. Correcting C6 to 3 drops Spec Kit to 3.90 — behind Superpowers. The evaluation did not apply this correction at time of scoring because the staleness was discovered after the scoring was finalized.

2. **Pipeline overlap makes adoption low-value.** Our existing claude-forge skills cover 5 of Spec Kit's 7 commands: `specify` ≈ `/create-requirements` + `/create-business-case`, `plan` ≈ `/create-roadmap` + `/plan-phase-tasks`, `tasks` ≈ PHASE-N-PLAN.md output, `implement` ≈ `superpowers:executing-plans`, `constitution` ≈ CLAUDE.md constraints. Only `clarify` (blind-spot detection) and `analyze` (cross-artifact consistency) are unique — not enough to justify adopting a stale framework.

3. **Superpowers integrates cleanly with zero adapter work.** PHASE-N-PLAN.md serves as the "spec" input to `superpowers:writing-plans`, bypassing brainstorming. SM-XXX/US-XXX IDs are embedded in task descriptions for traceability. Wave-level parallelism uses `superpowers:dispatching-parallel-agents` at wave boundaries. Definition of Done maps to `superpowers:verification-before-completion` gates.

### Integration Path

```
/plan-phase-tasks → PHASE-N-PLAN.md
       ↓
superpowers:writing-plans        (adds TDD steps: RED-GREEN-REFACTOR per task)
       ↓
superpowers:executing-plans      (executes with discipline: exact files, exact commands)
       ↓
superpowers:test-driven-development   (enforces non-negotiable TDD)
       ↓
superpowers:verification-before-completion  (gates completion claims with evidence)
```

### What Spec Kit Still Does Better

Spec Kit's unique capabilities remain valuable as concepts, regardless of framework choice:

- **`clarify` (blind-spot detection):** Surfaces underspecified requirements before planning. Demonstrated catching 5 genuine blind spots in a real project. Could be built as a claude-forge skill that runs against USER-STORIES.md acceptance criteria.
- **`analyze` (cross-artifact consistency):** Validates consistency across the artifact chain (business case → story map → user stories → architecture → roadmap → phase plan). Could be built as a claude-forge skill that checks ID orphans, coverage gaps, and contradictions.
- **Constitution mechanism:** Formal constraint encoding beyond CLAUDE.md. The constitution is more structured and machine-checkable. CLAUDE.md serves this role adequately for now.

These are noted as potential future claude-forge skills — they are framework-agnostic concepts.

## Revision Notes

### 2026-02-02: Spec Kit C5 Re-scored, Recommendation Changed

**Source:** YouTube video "Using GitHub Spec Kit with your EXISTING PROJECTS" by Den Delimarsky (Spec Kit creator, GitHub staff). Video demonstrates Spec Kit used on a real Hugo blog project to add a reading list feature.

**Change:** Spec Kit C5 (Change Flexibility) revised from 3/5 to 4/5.

**Evidence:** The original evaluation characterized Spec Kit as requiring "wholesale regeneration on scope change: modifying a spec requires regenerating plan and tasks downstream." The video directly contradicts this with multiple instances of incremental modification:

1. **Mid-plan modification:** User removes test-related tasks from the plan with a single instruction without regenerating the spec or upstream artifacts.
2. **Selective downstream propagation:** After `analyze` identifies inconsistencies, user instructs targeted updates to "spec plan and task as appropriate" — not wholesale regeneration.
3. **Mid-project scope change:** User drops pagination mid-project without restarting the pipeline.
4. **Learning-encoding loop:** Post-implementation learnings are encoded back into the spec as new functional requirements. User explicitly states: "That's why they're markdown files. You go in, you change or you ask the LLM to change it... You don't need to reset anything."

**C2 evaluation philosophy note:** The video also shows the user explicitly opting out of tests ("we will not be using or writing any tests") with the framework complying. An initial re-evaluation draft downgraded C2 to 3/5, but upon stakeholder review this was rejected: C2 measures whether the framework follows strong TDD methodology **by default**, not whether it structurally prevents users from exercising their own judgment. Spec Kit generates test phases by default, `analyze` catches spec-plan inconsistencies when tests are mandated, and the constitution can encode test requirements project-wide. C2 remains 4/5.

**Net effect:** Weighted total moves from 3.90 to 4.10, surpassing Superpowers at 4.00. Recommendation changes from Superpowers to Spec Kit.

**Full re-evaluation report:** See `SPECKIT-REEVALUATION.md` in project scratchpad for the complete criterion-by-criterion analysis with video transcript evidence mapping.

### 2026-02-02: Final Decision — Superpowers Selected Over Spec Kit

**Context:** After the C5 re-scoring pushed Spec Kit to 4.10 (vs Superpowers 4.00), additional investigation was conducted into Spec Kit's repo health and community standing.

**Findings:**
- **Maintenance staleness:** Last commit Dec 4, 2025. Last release v0.0.90 (Dec 4, 2025). 81 open PRs with none being reviewed. 625 open issues. Zero maintainer (localden) comments in the last 50 issue comments. Creator Den Delimarsky left GitHub for Anthropic.
- **Community confirmation:** GitHub Discussion #1482 ("Is SpecKit *really* maintained?") — no official response. Community sentiment on Reddit and GitHub strongly favors Superpowers for active development workflows.
- **Pipeline overlap:** Fork/adoption analysis revealed 5 of 7 Spec Kit commands duplicate existing claude-forge skills. Only `clarify` and `analyze` are unique.
- **Superpowers actively maintained:** v4.1.1, last commit Jan 30 2026 (3 days prior to decision), maintainer Jesse Vincent (obra) actively merging PRs.

**Decision:** Superpowers selected. The 0.10-point scoring advantage for Spec Kit is erased by the uncorrected C6 inflation (correcting to 3 yields 3.90, correcting to 4 yields a tie at 4.00), and practical factors (maintenance risk, pipeline overlap, zero-adapter integration) decisively favor Superpowers.

**Spec Kit's unique value preserved:** `clarify` (blind-spot detection) and `analyze` (cross-artifact consistency) are noted as potential future claude-forge skills that can be built independently of the Spec Kit framework.

## Decision Criteria Reference

| # | Criterion | Weight | What It Measures |
|---|-----------|--------|-----------------|
| C1 | Pipeline Compatibility | 20% | Consumes our structured plan documents |
| C2 | Testability & TDD | 20% | Enforces test-first methodology |
| C3 | Agent Discipline | 20% | Constrains agent behavior |
| C4 | Parallel Execution | 10% | Supports concurrent agent work |
| C5 | Change Flexibility | 20% | Handles mid-project scope changes |
| C6 | Maturity & Community | 10% | Active maintenance and adoption |
