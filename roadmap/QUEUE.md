# Queue

## Next Up

1. **Generate phase plans** — Run `/plan-phase-tasks` for PHASE-1 through PHASE-6 (use `--has-ui` for MVP phases with UI stories)
2. **MVP implementation** — Feed PHASE-1-PLAN.md into `superpowers:writing-plans` → `superpowers:executing-plans`
3. **Curate initial hook catalog** — Source 15-25 hooks from awesome-claude-code for `data/hooks.json` (TRANS-01)

## Backlog

- **Persist create-requirements patch** — Plugin cache edit will be lost on update
- **Add analytics (post-MVP)** — Deferred per OI-04
- **Delete old trace-phase-stories.sh** — Superseded by Python rewrite
- **Deferred gaps** — Wave-level orchestration, writing-plans format compatibility, post-phase learning loop, branch strategy

## Recently Completed

- ✅ **`/plan-phase-tasks` skill built** — SKILL.md (366 lines), template, slash command. Validation + self-verification passed. Committed to claude-forge (`e61c3ad`)
- ✅ **UX expertise skill built** — Prior session
- ✅ **Spec review round 8** — 8 issues: 1 fixed (wave metadata extraction), 5 invalid/skipped, 2 downstream (superpowers integration)
