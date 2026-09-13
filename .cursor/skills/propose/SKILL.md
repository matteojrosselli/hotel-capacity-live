---
name: propose
description: Write OpenSpec change proposals under openspec/changes/<slug>/ (proposal.md, tasks.md, design.md). Use before implementing significant features, connectors, or architectural changes. No product code in this phase.
---
# Propose a change

Use this skill when the user asks to **propose**, **plan**, or **spec** a feature — or before any non-trivial implementation.

## Output location

Create a new folder:

```
openspec/changes/<slug>/
  proposal.md   # Why, what, scope, success criteria
  tasks.md      # Checklist for implementation (all unchecked)
  design.md     # Technical approach, APIs, data model, risks
```

`<slug>` is kebab-case derived from the change title (e.g. `airport-market-refresh`, `property-capacity-api`).

## Rules

1. **No product code** — do not edit `src/`, add dependencies, or change runtime behavior. Documentation under `openspec/` and `AGENTS.md` cross-references are allowed only if the user explicitly asks to update agent docs during propose.
2. **Be specific** — name data sources, refresh intervals, UI surfaces, and acceptance criteria.
3. **Keep tasks actionable** — each task in `tasks.md` should be completable in one PR-sized chunk where possible.
4. **Design decisions** — record alternatives considered and why the chosen approach wins in `design.md`.

## proposal.md template

```markdown
# Proposal: <Title>

## Problem
<What pain this solves>

## Scope
### In scope
- ...

### Out of scope
- ...

## Success criteria
- [ ] ...

## Dependencies / blockers
- API keys, vendor access, etc.
```

## tasks.md template

```markdown
# Tasks: <slug>

- [ ] Task 1
- [ ] Task 2
```

## design.md template

```markdown
# Design: <slug>

## Overview
<One-paragraph summary>

## Data model
<Types, tables, or API shapes>

## Architecture
<Diagram or bullets: fetch → normalize → cache → UI>

## API / connectors
<Endpoints, polling, auth>

## UI
<iPad layout notes>

## Risks & mitigations
| Risk | Mitigation |
| --- | --- |

## Open questions
- ...
```

## When done

Tell the user:
- The slug and path to the change folder
- That they should review the three files before running **`/apply`**
- Suggested `/apply` command: `/apply <slug>`
