# Skill Spec: charter-to-superpowers

> **Purpose:** Build this skill using `taches-cc-resources:create-agent-skills` in a fresh session. This document captures all knowledge needed — do not re-read superpowers documentation.

## What This Skill Does

A state-machine skill that bridges the `.charter/` planning pipeline (produced by claude-forge skills) to the superpowers execution pipeline. Given a phase number, it detects where the user is in the execution pipeline and provides the exact prompt for the next step.

## Invocation

```
/charter-to-superpowers 1
/charter-to-superpowers 3
```

Single argument: phase number (required, integer, 1-based).

## State Machine

The skill checks pipeline state in order and stops at the first incomplete step, providing the exact prompt to run. States 2 and 3 cycle per execution group — a phase with 3 groups goes through: plan group 1 → execute group 1 → plan group 2 → execute group 2 → plan group 3 → execute group 3 → finish.

**Why plan per group (not all at once):** writing-plans produces complete code in the plan. Group 2 stories depend on Group 1's code existing (e.g., US-004 creates HookGrid.tsx, then US-003 imports it). If writing-plans plans Group 2 before Group 1 is implemented, it writes code against architecture doc interfaces instead of real files. Planning per group after prior groups are implemented gives writing-plans real code to reference.

### State 0: No PHASE-N-PLAN.md

**Check:** `.charter/PHASE-{N}-PLAN.md` does not exist.

**Output:**
```
Phase {N} plan not found. Run plan-phase-tasks first:

/plan-phase-tasks {N}           # without UI stories
/plan-phase-tasks {N} --has-ui  # with UI stories
```

### State 1: Phase plan exists, no worktree

**Check:** `.charter/PHASE-{N}-PLAN.md` exists. No worktree for this phase (check `.worktrees/` and `worktrees/` for a directory matching the phase branch pattern, and `git worktree list`).

**Pre-check: .charter/ files must be committed.** Run `git status .charter/ --short`. If any files show `??` (untracked), the worktree won't have them. Block and output:
```
.charter/ files are untracked. Commit them before creating the worktree,
otherwise the worktree won't have access to your planning artifacts:

git add .charter/
git commit -m "Add .charter/ planning artifacts for Phase {N}"
git push

Then re-run: /charter-to-superpowers {N}
```

**Extract from phase plan:**
- Phase name (from `# Phase {N} Plan: {name}` heading)
- Release name (from Metadata section)

**Output:** Provide the exact prompt for `superpowers:using-git-worktrees`:
```
Next step: Create an isolated worktree.

/superpowers:using-git-worktrees

Feature: Phase {N} {phase-name}
Branch: feat/phase-{N}-{slugified-phase-name}
```

### State 2: Worktree exists, current group needs planning

**Check:** Worktree exists. Determine the current execution group by parsing the Parallelism Analysis section of the phase plan and checking which groups have been completed (see Detection Logic). The current group has no corresponding plan file in the worktree's `docs/plans/`.

**Extract from phase plan:**
- Current execution group number and its stories
- Whether Design OS export exists (from Metadata `UX Inputs Loaded` field)

**Output:** Provide the exact prompt for `superpowers:writing-plans`:
```
Next step: Create TDD implementation plan for Execution Group {G}.

/superpowers:writing-plans

Spec: .charter/PHASE-{N}-PLAN.md
Architecture: .charter/ARCHITECTURE-DOC.md
UI Reference: .charter/design-os-export/

Plan Execution Group {G} stories only: {story-list}.
The phase plan has the full FDD task decomposition with I/O/Test
per task and Design OS section references for UI tasks.
Focus on these stories: {story-ids with names}.
Include the story ID prefix in each commit message
(e.g., "feat(US-001): add HeroBanner component").
```

Only include the `UI Reference` line when `UX Inputs Loaded` contains "Design OS export" (i.e., the `.charter/design-os-export/` directory exists). For all other values — fallback UX path ("Yes — UX-DESIGN-PLAN.md..."), "No", or "N/A" — omit the line. In the fallback case, plan-phase-tasks already embedded the relevant UX specs inline in each task's Input field, so the phase plan is self-contained.

### State 3: Current group planned, needs execution

**Check:** Plan file exists in worktree's `docs/plans/` for the current group. Stories in this group are not yet complete (check git log in worktree for commits referencing story IDs, or ask user to confirm).

**Extract from phase plan:**
- Stories in the current execution group
- Whether the group has 1 story (sequential) or 2+ stories (parallel)

**Output:** Provide the execution prompt. Two sub-cases:

**If current group has 1 story (sequential):**
```
Next step: Execute the plan for {story-id}: {story-name}.

/superpowers:subagent-driven-development

Plan: docs/plans/{plan-filename}
Execute tasks for {story-id}: {story-name}
```

**[If this is NOT the last execution group:]** Add this WARNING inside the code block above:
```
WARNING: subagent-driven-development will invoke finishing-a-development-branch
when done. It will detect "main" as the base branch (not the phase branch).
Choose Option 3 "Keep the branch as-is" — do NOT merge or create a PR.
More execution groups remain after this one.
```

**If current group has 2+ stories (parallel):**
```
Next step: Execute {N} stories in Execution Group {G}. Two options:

OPTION A — Sequential (safe, one session):
Run subagent-driven-development ONCE with the full group plan.
All tasks across all {N} stories execute sequentially in a single session.

IMPORTANT: Do NOT invoke subagent-driven-development multiple times
(once per story) with the same plan. TodoWrite progress tracking is
per-session — re-invoking loses state and causes duplicate work.

/superpowers:subagent-driven-development

Plan: docs/plans/{plan-filename}

[If this is NOT the last execution group:]
WARNING: subagent-driven-development will invoke finishing-a-development-branch
when done. It will detect "main" as the base branch (not the phase branch).
Choose Option 3 "Keep the branch as-is" — do NOT merge or create a PR.
More execution groups remain after this one.

OPTION B — Parallel (faster, multiple sessions):
Prerequisite: commit the group plan so sub-worktrees can access it:

git add docs/plans/{plan-filename}
git commit -m "Add Execution Group {G} implementation plan"

Then create a separate worktree per story:

git worktree add .worktrees/{story-1-slug} -b feat/{story-1-slug}
git worktree add .worktrees/{story-2-slug} -b feat/{story-2-slug}
...

In each worktree session, run executing-plans scoped to ONE story:

/superpowers:executing-plans

Plan: docs/plans/{plan-filename}
Execute ONLY the tasks for {story-id}: {story-name}.
Skip all other stories in this plan.

WARNING: executing-plans will invoke finishing-a-development-branch
when done. It will detect "main" as the base branch (not the phase
branch). Choose Option 3 "Keep the branch as-is" — do NOT merge
or create a PR. The manual merge into the phase branch happens below.

After ALL story branches complete, merge them into the phase branch:

cd {phase-worktree-path}
git merge feat/{story-1-slug}
git merge feat/{story-2-slug}
...

If merge conflicts occur, resolve before merging the next branch.
Then clean up sub-worktrees:

git worktree remove .worktrees/{story-1-slug}
git worktree remove .worktrees/{story-2-slug}
...

Stories in this group:
{list of stories with IDs and names}
```

**Why two options for parallel groups:** `subagent-driven-development` processes an entire plan file sequentially and tracks progress via per-session TodoWrite — it cannot be invoked multiple times per story from the same plan. Option A runs all tasks in one session. Option B isolates stories in separate worktrees with `executing-plans`, which supports human checkpoints and can be scoped to specific tasks via the prompt. Option B adds merge complexity but enables true parallel execution across sessions.

### State 4: Current group done, more groups remain

**Check:** All stories in the current execution group are implemented. More execution groups exist in the phase plan.

**Output:**
```
Execution Group {G} complete ({stories}).
Next group: Execution Group {G+1} ({next-stories}).

Re-invoke to plan the next group:

/charter-to-superpowers {N}
```

This loops back to State 2 for the next execution group.

### State 5: All execution groups complete

**Check:** All stories from all execution groups in the phase plan have been implemented.

**Output:**
```
All {total} stories implemented across {group-count} execution groups.
Finish the branch:

/superpowers:finishing-a-development-branch
```

### State 6: Branch finished

**Check:** Branch has been merged or PR created.

**Output:**
```
Phase {N} complete. Next phase:

/charter-to-superpowers {N+1}
```

## Superpowers Skill Interface Reference

These are the exact interfaces the skill needs to generate correct prompts. Captured from reading each skill's SKILL.md (superpowers v4.2.0).

### using-git-worktrees
- **Input:** Feature name + branch name
- **Behavior:** Checks `.worktrees/` → `worktrees/` → CLAUDE.md → asks user. Verifies .gitignore. Runs `pnpm install`. Runs baseline tests. Reports status.
- **Location:** Skill auto-detects directory; just provide branch name.

### writing-plans
- **Input:** Spec/requirements (any markdown). Reads codebase itself for full context.
- **Output:** `docs/plans/YYYY-MM-DD-<feature-name>.md` with complete code, exact file paths, exact commands, TDD steps (write failing test → run → implement → run → commit).
- **Handoff:** Offers execution choice (subagent-driven or parallel session).
- **Key detail:** Assumes engineer has ZERO codebase context. Gathers everything itself. Just point it at the spec and reference files.
- **Key detail:** Does NOT depend on brainstorming output. No file-based dependency on prior skills.

### subagent-driven-development
- **Input:** Implementation plan file path.
- **Behavior:** Fresh subagent per task. Two-stage review after each: spec compliance → code quality. Review loops until approved. Marks tasks complete in TodoWrite.
- **Integration:** Requires worktree (using-git-worktrees). Subagents use test-driven-development internally.
- **Best for:** Sequential execution of one story's tasks in the current session.

### executing-plans
- **Input:** Implementation plan file path.
- **Behavior:** Load plan → review critically → execute in batches of 3 → report for human review → continue.
- **Integration:** Requires worktree (using-git-worktrees). Uses finishing-a-development-branch at end.
- **Best for:** Separate session execution with human checkpoints.

### dispatching-parallel-agents
- **When:** 2+ independent tasks/stories that don't share state.
- **Pattern:** One agent per problem domain, focused prompts, review and integrate results.
- **Key detail:** NOT part of the writing-plans → execution pipeline. It's a standalone utility for parallel independent work.

### finishing-a-development-branch
- **When:** After all tasks complete and tests pass.
- **Behavior:** 5 steps: (1) Verify tests pass, (2) Determine base branch, (3) Present 4 options to user: merge locally / push & create PR / keep as-is / discard, (4) Execute chosen option, (5) Cleanup worktree (for options 1, 2, 4 — NOT option 3).
- **Key detail:** Will NOT proceed if tests fail. Includes worktree cleanup.
- **Integration:** Called by executing-plans at end. Also invoked directly after subagent-driven-development completes all tasks.

### test-driven-development
- **When:** Used by subagents during execution (not invoked directly by this skill).
- **Iron Law:** "No production code without a failing test first." RED → verify fail → GREEN → verify pass → REFACTOR.
- **Key detail:** This is a discipline skill enforced inside subagent-driven-development and executing-plans. Our bridge skill does not invoke it — the execution skills handle it internally.

### verification-before-completion
- **When:** Before any completion claim — "no completion claims without fresh verification evidence."
- **Key detail:** Discipline skill used internally by other skills. Not a separate pipeline step. Ensures test suite runs fresh before claiming work is done. Already embedded in finishing-a-development-branch (Step 1: verify tests) and subagent-driven-development (two-stage review).

### requesting-code-review / receiving-code-review
- **When:** After each task in subagent-driven-development; after major features.
- **Key detail:** Internal to execution skills. requesting-code-review dispatches a code-reviewer subagent with git SHAs. receiving-code-review handles feedback processing. Our bridge skill does not invoke these — subagent-driven-development handles them automatically.

### writing-skills
- **When:** Creating or editing skill files.
- **Key detail:** Uses TDD-for-skills methodology (pressure scenarios = tests, SKILL.md = production code). Relevant when BUILDING our bridge skill via `taches-cc-resources:create-agent-skills`, not part of the execution pipeline.

### systematic-debugging
- **When:** Debugging technical issues.
- **Key detail:** Not part of the build pipeline. Available if execution encounters bugs that need root cause investigation.

## .charter/ Artifact Mapping

| .charter/ Artifact | Superpowers Consumer | How Referenced |
|-------------------|---------------------|---------------|
| PHASE-N-PLAN.md | writing-plans | Primary spec (the "requirements") |
| ARCHITECTURE-DOC.md | writing-plans | Architecture context (pointed at, writing-plans reads it) |
| design-os-export/ | writing-plans | UI reference (pointed at, writing-plans reads relevant sections via task Reference fields) |
| ROADMAP.md | Not directly consumed | Phase metadata already extracted into PHASE-N-PLAN.md Metadata section |
| USER-STORIES.md | Not directly consumed | AC already embedded in PHASE-N-PLAN.md task Input fields |
| REQUIREMENTS.md | Not directly consumed | Formal requirements traced through to user stories |
| BUSINESS-CASE.md | Not directly consumed | Business requirements traced through to user stories |
| STORY-MAP.md | Not directly consumed | Journey map traced through to roadmap phases |
| DESIGN-TOKENS.md | Not directly consumed | Superseded by design-os-export/design-system/tokens.css when export exists; fallback UX path uses it directly |
| UX-DESIGN-PLAN.md | Not directly consumed | Fallback UX path (when no design-os-export); content filtered via traceability matrix in plan-phase-tasks |
| UX-COMPONENTS.md | Not directly consumed | Fallback UX path (same as above) |
| UX-INTERACTIONS.md | Not directly consumed | Fallback UX path (same as above) |
| UX-FLOWS.md | Not directly consumed | Fallback UX path; Section 11 traceability matrix used by plan-phase-tasks |

## Detection Logic

### Worktree Detection
```bash
# Check both conventional locations for phase branch
ls -d .worktrees/feat/phase-{N}-* 2>/dev/null
ls -d worktrees/feat/phase-{N}-* 2>/dev/null
# Also check git worktree list for matching branch
git worktree list | grep "phase-{N}"
```

### Plan Detection

**DO NOT match by filename pattern.** writing-plans saves files as `docs/plans/YYYY-MM-DD-<feature-name>.md` where `<feature-name>` is a slug it derives internally — we don't control it. Use content-based detection instead: grep each plan file for the current group's story IDs.

```bash
WORKTREE=$(git worktree list | grep "phase-{N}" | awk '{print $1}')

# Content-based: find the plan file that contains ALL story IDs for the current group.
# A group's plan will reference its story IDs in the task breakdowns.
# Example for Group 2 with stories US-001, US-004, US-006, US-013:
for plan in "$WORKTREE"/docs/plans/*.md; do
  if grep -q "US-001" "$plan" && grep -q "US-004" "$plan" && \
     grep -q "US-006" "$plan" && grep -q "US-013" "$plan"; then
    echo "Group 2 plan: $plan"
  fi
done
```

**Why content-based:** Plan files will always contain their stories' IDs (in task headings, commit messages, etc.) regardless of filename. This survives file renames, regeneration (Edge Case 7), and pre-existing unrelated plans in `docs/plans/`.

**Fallback:** If no file matches all story IDs for the current group, ask the user:
```
Could not auto-detect the plan file for Execution Group {G}.
Which file in docs/plans/ is the plan for {story-list}?
```

### Execution Group Tracking
Parse the phase plan's `## Parallelism Analysis` section to extract execution groups. For each group, determine completion:

1. **Primary method:** Check git log in the worktree branch for commits referencing story IDs:
   ```bash
   git -C "$WORKTREE" log --oneline | grep -c "US-{XXX}"
   ```
   A group is complete when ALL its story IDs appear in commit messages.

2. **Fallback method:** If git log detection is ambiguous, ask the user:
   ```
   Has Execution Group {G} been completed? ({story-list})
   ```

3. **Group ordering:** Groups are numbered sequentially in the phase plan. The current group is the first group where not all stories have commits.

### Branch Completion Detection
```bash
# Check if PR exists for the phase branch
gh pr list --head "feat/phase-{N}-*" --state all 2>/dev/null
# Or check if branch has been merged
git branch --merged main | grep "phase-{N}"
```

## Edge Cases

1. **Phase plan exists but upstream artifacts missing:** Warn, don't block. The phase plan is self-contained enough for writing-plans.
2. **Worktree exists but on wrong branch:** Warn user, suggest switching or creating new worktree.
3. **Multiple execution groups partially complete:** Identify the first incomplete group (first group where not all story IDs appear in git log) and prompt for that group.
4. **Phase plan has no Parallelism Analysis section or only 1 group:** Treat entire phase as a single execution group. Skip group cycling — go straight from plan to execute to finish.
5. **User re-invokes after completing a group:** State 4 triggers — advance to next execution group, output loops back to State 2 for planning.
6. **Parallel group where user chooses Option B (separate worktrees):** Skill should note that after parallel execution, user needs to merge story branches into the phase branch before the next group can be planned. Provide merge commands.
7. **writing-plans already ran for this group but plan file was deleted:** Re-detect as State 2 (no plan). writing-plans will regenerate.
8. **User invokes mid-execution (State 3 partially done):** Skill can't easily detect partial task completion within a group. Ask user: "Are you resuming execution or starting fresh?"

## Skill Metadata

```yaml
name: charter-to-superpowers
description: Bridge .charter/ planning artifacts to superpowers execution pipeline. State-machine that detects pipeline progress and provides exact next-step prompts.
```

## Development Notes

1. All 14 superpowers skills have been read and their interfaces are documented above. No further reading needed.
2. The skill generates prompts — it does NOT invoke superpowers skills directly
3. Slugify phase names: "Walking Skeleton -- End-to-End Hook Browsing" → "walking-skeleton"
4. The skill should work for any phase number, not just Phase 1
5. Test with Phase 1 (8 stories, 3 execution groups) as the primary reference case
6. States 2-4 cycle per execution group. Total invocations for Phase 1: State 0 (skip) → State 1 (worktree) → State 2 (plan group 1) → State 3 (execute group 1) → State 4 (group 1 done) → State 2 (plan group 2) → State 3 (execute group 2) → State 4 (group 2 done) → State 2 (plan group 3) → State 3 (execute group 3) → State 5 (all done) → State 6 (finished)
7. The phase plan heading format is: `# Phase {N} Plan: {name}`. Parse N and name from this.
8. The Parallelism Analysis section heading format varies between plan-phase-tasks runs. The template uses `### Parallel Group N (description)` but actual output may use `### Execution Group N (description)`. Parse BOTH patterns: regex `### (?:Execution Group|Parallel Group) (\d+)` to extract group number. Story list is the bullet items below each heading.
9. `subagent-driven-development` prohibits parallel subagents — never suggest dispatching multiple implementation subagents simultaneously in the same session
