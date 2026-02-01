# Queue

## Next Up

1. **Generate ARCHITECTURE-DOC.md** — Run `/create-design-doc .charter/REQUIREMENTS.md .charter/BUSINESS-CASE.md`. SRS provides domain-organized FRs mapping to components + NFRs driving tech decisions. No user stories needed — architecture describes system structure, not release phasing.
2. **Deep research for UX skill (4 rounds)** — Run `/research:deep-dive` on 2 areas per round from `roadmap/UX-SKILL-SPEC.md` Section 11. Save output to `artifacts/research/skills/`.
   - Round 1: Nielsen's Heuristics + Atomic Design
   - Round 2: WCAG Accessibility + Responsive Patterns
   - Round 3: Data States & Microcopy + Interaction Patterns
   - Round 4: Information Architecture + Visual Hierarchy
3. **Build UX design expertise skill** — Run `/create-agent-skills` (domain expertise workflow) with `roadmap/UX-SKILL-SPEC.md` + research from `artifacts/research/skills/` as inputs. Produces `expertise/ux-design/` with SKILL.md, workflows, references, and templates.
4. **Generate UX-DESIGN-PLAN.md** — Use the new UX skill to produce the UX plan for HookHub from `.charter/STORY-MAP.md` + `.charter/USER-STORIES.md`.
5. **Generate execution plan** — Run `/create-execution-plan` after architecture and UX plan are done.
6. **Curate initial hook catalog** — Source 15-25 hooks from awesome-claude-code for `data/hooks.json` manifest (TRANS-01 in REQUIREMENTS.md).

## Backlog

- **MVP implementation** — Build the Next.js app per execution plan
- **Persist create-requirements patch** — The Phase 1c.6 edit is in plugin cache and will be lost on update. Consider upstreaming to claude-forge or maintaining a local overlay.
- **Add analytics (post-MVP)** — Deferred per OI-04 in business case. Needed to measure Section 6 KPIs.
