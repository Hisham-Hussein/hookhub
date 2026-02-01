# Queue

## Next Up

1. **Generate ARCHITECTURE-DOC.md** — Run `/create-design-doc` with user stories and business case as input.
2. **Create UX specification skill** — Domain expertise skill for general-purpose UX spec generation. Sits between user stories/architecture and execution plan. Produces page inventory, component specs with states, responsive rules, navigation flow. Use `/create-agent-skills` to scaffold.
3. **Generate UX-SPEC.md** — Use the new UX skill (once created) to produce the spec for HookHub.
4. **Generate execution plan** — Run `/create-execution-plan` after architecture and UX spec are done.
5. **Curate initial hook catalog** — Source 15-25 hooks from awesome-claude-code for `data/hooks.json` manifest.

## Backlog

- **MVP implementation** — Build the Next.js app per execution plan
- **Persist create-requirements patch** — The Phase 1c.6 edit is in plugin cache and will be lost on update. Consider upstreaming to claude-forge or maintaining a local overlay.
- **Add analytics (post-MVP)** — Deferred per OI-04 in business case. Needed to measure Section 6 KPIs.
