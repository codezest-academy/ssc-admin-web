# Architecture Decision Record (ADR) Process

**Date:** 2026-08-29
**Status:** 🟢 Active

---

## Context
As the `ssc-admin-web` grows, we need a formalized way to track significant architectural choices, library selections, and design patterns.

## The Process
Whenever a decision is made that significantly impacts the codebase's architecture, dependencies, or standard patterns:
1. Create a new markdown file in the relevant `docs/` subfolder.
2. Name it `YYYY-MM-DD-short-topic-name.md`.
3. Use the template below.
4. Link it in the `docs/README.md`.

## Archiving
If an ADR becomes obsolete due to a new decision, move the old markdown file into `docs/archive/` and update its status to `🔴 Superseded`. Add a note pointing to the new ADR.

---

## ADR Markdown Template

```markdown
# [Title of the Decision]

**Date:** YYYY-MM-DD
**Status:** 🟢 Active (or 🟡 Proposed / 🔴 Superseded)
**Author:** [Name]

---

## Context
Describe the problem, the context, and the constraints that lead to this decision. Why are we making a choice now?

## Considered Options
* Option 1 (e.g., Redux)
* Option 2 (e.g., Zustand)
* Option 3 (e.g., Context API)

## Decision
State the final decision clearly.

## Rationale
Why was this option chosen over the others? (e.g., bundle size, developer experience, prior team knowledge).

## Consequences
What becomes easier or harder because of this choice? What are the next steps?
```
