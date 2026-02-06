# Active Work

## Current Focus

Generate phase plans (PHASE-1 through PHASE-6) using the newly built `/plan-phase-tasks` skill, then begin MVP implementation.

## Success Criteria

- [x] Fix Issue 6: Add invocation model paragraph to Leg 2 spec
- [x] Fix Issue 11: Define PHASE-N-PLAN.md template header and section order
- [x] `.charter/DESIGN-TOKENS.md` created from iSemantics brand guidelines
- [x] Spec review rounds 3-8 complete (56 issues total: 20 fixed, 28 invalid, 8 other)
- [x] `generate-section-manifest.py` built and verified (100% story coverage)
- [x] `/plan-phase-tasks` skill designed and built via `/create-agent-skills`
- [x] UX expertise skill built (prior session)
- [ ] Phase plans produced (PHASE-N-PLAN.md per slice)
- [ ] MVP implementation started

## Progress

### Last Session (this one)

- Built `/plan-phase-tasks` skill: SKILL.md (366 lines, simple pattern), `templates/phase-plan-template.md`, slash command
- Validation script passed, self-verification subagent PASS on all 7 checks
- Committed to claude-forge master (`e61c3ad`), pushed, synced cache
- Files created:
  - `~/.claude/plugins/marketplaces/claude-forge/skills/plan-phase-tasks/SKILL.md`
  - `~/.claude/plugins/marketplaces/claude-forge/skills/plan-phase-tasks/templates/phase-plan-template.md`
  - `~/.claude/plugins/marketplaces/claude-forge/commands/plan-phase-tasks.md`

### Not Started

- Generate phase plans (PHASE-1 through PHASE-6)
- MVP implementation

## How to Continue

### Step 1: Generate phase plans

Run `/plan-phase-tasks` for each phase. MVP phases (1-3) have UI stories, so use `--has-ui`:

```
/plan-phase-tasks 1 --has-ui
/plan-phase-tasks 2 --has-ui
/plan-phase-tasks 3 --has-ui
/plan-phase-tasks 4
/plan-phase-tasks 5
/plan-phase-tasks 6
```

Wave 1 (PHASE-1) must be planned first (walking skeleton). Wave 2 phases (2, 3) can be planned in parallel. Check `.charter/ROADMAP.md` for wave groupings.

### Step 2: Begin MVP implementation

Feed PHASE-1-PLAN.md into `superpowers:writing-plans` → `superpowers:executing-plans` for TDD execution.

## Blockers

None.

## Key Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| `/plan-phase-tasks` skill | `~/.claude/plugins/marketplaces/claude-forge/skills/plan-phase-tasks/` | **Built** — SKILL.md + template + 2 scripts (149 tests) |
| Skill Design Spec | `roadmap/SKILL-DESIGN-PLAN-PHASE-TASKS.md` | Complete — 8 review rounds, 56 issues resolved |
| Roadmap | `.charter/ROADMAP.md` | Complete (6 phases, 3 releases) |
| Architecture | `.charter/ARCHITECTURE-DOC.md` | Complete (uses "Adapters" layer name) |
| User Stories | `.charter/USER-STORIES.md` | Complete |
| Design Tokens | `.charter/DESIGN-TOKENS.md` | Complete |
| Design OS Export | `.charter/design-os-export/` | Complete |
