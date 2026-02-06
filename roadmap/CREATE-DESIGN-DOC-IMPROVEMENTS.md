# create-design-docs Skill — Improvement Plan

Remaining gaps identified during skill audit (2026-02-01). Gap 1 (no data model/API spec extraction guidance) was resolved by adding `references/data-api-extraction.md`.

**Skill location:** `~/.claude/plugins/cache/claude-forge/claude-forge/1.0.0/skills/create-design-docs/`

---

## Gap 2: Python-Centric Code Examples

**Severity:** Low
**Impact:** TypeScript/JavaScript projects require mental translation of all interface examples

### Problem

All interface examples across the skill use Python syntax:
- Repository interfaces use `Protocol` and `dataclass` (Python typing)
- Use case I/O uses `@dataclass` with type hints
- Domain model examples use `@dataclass(frozen=True)` for value objects

This appears in 4 files:
- `references/domain-modeling.md` — Entity, VO, aggregate, and service examples
- `references/clean-architecture.md` — Interface crossing, repository protocols, violation examples
- `workflows/create-architecture-doc.md` — Phase 4 repository/use case interface stubs
- `workflows/create-hybrid-doc.md` — Phase 6 repository/use case interface stubs

### Proposed Fix

Add polyglot interface examples alongside the existing Python ones. Minimum viable: add TypeScript equivalents since it is the most common web stack.

**Files to modify:**

1. **`references/domain-modeling.md`** — Add TypeScript entity/VO examples:
   ```typescript
   // Entity
   interface Influencer {
     id: string;
     name: string;
     platforms: PlatformPresence[];
     calculateEngagementRate(): number;
   }

   // Value Object (immutable via readonly)
   type FollowerCount = Readonly<{
     value: number;
     tier: "nano" | "micro" | "macro" | "mega";
   }>;
   ```

2. **`references/clean-architecture.md`** — Add TypeScript repository interface:
   ```typescript
   interface InfluencerRepository {
     findById(id: string): Promise<Influencer | null>;
     search(criteria: SearchCriteria): Promise<Influencer[]>;
     save(influencer: Influencer): Promise<void>;
   }
   ```

3. **`workflows/create-architecture-doc.md`** (Phase 4) and **`workflows/create-hybrid-doc.md`** (Phase 6) — Add note: "Use the language matching the project's primary stack. See references for Python and TypeScript examples."

### Effort

Small — adding ~20 lines of TypeScript examples per reference file, plus a 1-line note in 2 workflow files.

---

## Gap 3: No Deployment / Infrastructure Section

**Severity:** Low (irrelevant for static sites; matters for complex deployments)
**Impact:** Systems with multi-environment deployments, container orchestration, or CDN strategies have no template section to capture deployment architecture

### Problem

The `references/methodology.md` describes arc42's 12 sections, including **Section 7: Deployment View** ("How does the system map to infrastructure? Always include for distributed systems"). However, none of the three output templates include a deployment section:

- `templates/architecture-doc-template.md` — 12 sections, none for deployment
- `templates/hybrid-template.md` — 15 sections, none for deployment
- `templates/design-doc-template.md` — 8 sections (expected — deployment is out of scope for lightweight design docs)

### Proposed Fix

Add an optional deployment section to the architecture and hybrid templates. Mark it as conditional to avoid bloating documents for simple deployments.

**Files to modify:**

1. **`templates/architecture-doc-template.md`** — Add Section 10.5 (between Risks and Glossary):
   ```markdown
   ## 10. Deployment Architecture (Optional)

   > Include this section for distributed systems, multi-environment deployments,
   > or when infrastructure topology affects architecture decisions.
   > Skip for single-server, static, or serverless deployments where the
   > hosting platform handles infrastructure.

   ### Deployment Diagram
   [Mermaid diagram showing environments, nodes, and artifact placement]

   ### Environment Strategy
   | Environment | Purpose | Key Differences |
   |-------------|---------|-----------------|
   | Development | Local development | [differences] |
   | Staging     | Pre-production validation | [differences] |
   | Production  | Live traffic | [differences] |

   ### Infrastructure Decisions
   - Hosting: [approach and rationale]
   - Scaling: [strategy]
   - CDN/Edge: [if applicable]
   ```

2. **`templates/hybrid-template.md`** — Add equivalent section between Constraints (11) and Architecture Decision Records (13).

3. **`workflows/create-architecture-doc.md`** — Add optional Phase 7.5: "If the system has non-trivial deployment topology, document deployment architecture."

4. **`workflows/create-hybrid-doc.md`** — Add optional Phase 10.5 with same guidance.

### Effort

Medium — adding ~25 lines to 2 templates and ~5 lines to 2 workflows. The conditional marker ("Optional — skip for simple deployments") prevents unnecessary bloat.

---

## Gap 4: Minimal Runtime / Sequence Diagrams

**Severity:** Low (adequate for MVPs; insufficient for complex multi-flow systems)
**Impact:** Systems with multiple interaction patterns (user flows, async processing, event-driven) get only one sequence diagram stub, which forces the agent to either skip flows or improvise without guidance

### Problem

Each template includes exactly one sequence diagram placeholder:
- `templates/architecture-doc-template.md` — Section 6 "Data Flow" has one `sequenceDiagram` Mermaid stub
- `templates/hybrid-template.md` — Section 7 "Data Flow" has one `sequenceDiagram` Mermaid stub

The workflows don't instruct the agent on *how many* diagrams to create or *which flows* to prioritize. For a system with 5+ distinct user flows (e.g., browse, search, filter, detail view, export), one diagram is insufficient.

### Proposed Fix

Add a flow selection heuristic to the workflows and expand the template stubs to support multiple diagrams.

**Files to modify:**

1. **`references/methodology.md`** — Add a subsection under C4 Model guidance for runtime diagrams:
   ```markdown
   **Runtime Diagram Selection:**

   Not every flow needs a diagram. Prioritize:
   1. The **primary happy path** (the most common user journey) — Always include
   2. Flows that **cross system boundaries** (external API calls, async jobs) — Include if they exist
   3. Flows with **complex orchestration** (multi-step, conditional branching) — Include if non-obvious

   Rule of thumb: 1-3 sequence diagrams for simple systems, 3-5 for complex.
   Skip: CRUD operations, trivial reads, standard auth flows (unless customized).
   ```

2. **`templates/architecture-doc-template.md`** — Expand Section 6 from one stub to a repeatable pattern:
   ```markdown
   ## 6. Data Flow

   ### 6.1 Primary Flow: [Most Common User Journey]
   [sequenceDiagram]

   ### 6.2 [Secondary Flow Name] (if applicable)
   [sequenceDiagram]

   ### 6.3 [Boundary-Crossing Flow Name] (if applicable)
   [sequenceDiagram]
   ```

3. **`templates/hybrid-template.md`** — Same expansion as above.

4. **`workflows/create-architecture-doc.md`** and **`workflows/create-hybrid-doc.md`** — Add flow selection step before diagram creation: "Identify 1-3 key flows using the prioritization heuristic in `references/methodology.md`. Create a sequence diagram for each."

5. **Validation phases** — Update the diagram validation check from "Confirm Mermaid diagrams have valid syntax" to "Confirm at least 1 sequence diagram for the primary flow, and additional diagrams for boundary-crossing flows if they exist."

### Effort

Medium — modifying 5 files with ~15-20 lines each. The flow selection heuristic is the key addition that prevents both under-diagramming (1 for everything) and over-diagramming (one per endpoint).

---

## Priority Order

| Gap | Severity | Effort | Recommended Order |
|-----|----------|--------|-------------------|
| Gap 4: Minimal runtime diagrams | Low | Medium | 1st — highest value-to-effort ratio; improves all output types |
| Gap 2: Python-centric examples | Low | Small | 2nd — quick win, especially for TS-heavy projects |
| Gap 3: No deployment section | Low | Medium | 3rd — only matters for complex deployments; optional section limits risk |

All three are backlog items. None block the current HookHub pipeline (static site with simple architecture). Address when the skill is used on a more complex project and the gaps become friction.
