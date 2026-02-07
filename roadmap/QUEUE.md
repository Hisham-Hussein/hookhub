# Queue

## Next Up

1. **Run `/charter-to-superpower 1`** — Start Phase 1 execution (worktree → plan groups → execute → finish)
2. **Generate remaining phase plans** — `/plan-phase-task` for PHASE-2 through PHASE-6 (`--has-ui` for 2, 3)
3. **Curate initial hook catalog** — Source 15-25 hooks from awesome-claude-code for `data/hooks.json` (TRANS-01)

## Backlog

- **Persist create-requirements patch** — Plugin cache edit will be lost on update
- **Add analytics (post-MVP)** — Deferred per OI-04
- **Delete old trace-phase-stories.sh** — Superseded by Python rewrite
- **Deferred gaps** — Wave-level orchestration, writing-plans format compatibility, post-phase learning loop, branch strategy

## Recently Completed

- ✅ **`charter-to-superpowers` skill built** — 302 lines, simple pattern, self-verification PASS, committed to claude-forge (`26d82b9`)
- ✅ **Command naming convention enforced** — Skill=plural, command=singular (`charter-to-superpower`, `plan-phase-task`)
- ✅ **`charter-to-superpowers` spec written and hardened** — 396 lines, 7-state machine, 2 full review rounds, 99%+ confidence
- ✅ **PHASE-1-PLAN.md generated** — 8 stories, 20 tasks, 3 execution groups (walking skeleton)
- ✅ **`/plan-phase-task` skill built** — SKILL.md (366 lines), template, slash command. Committed to claude-forge (`e61c3ad`)
