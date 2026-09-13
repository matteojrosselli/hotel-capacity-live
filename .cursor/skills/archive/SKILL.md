---
name: archive
description: Archive a completed OpenSpec change from openspec/changes/<slug>/ to openspec/changes/archive/, and update living specs in openspec/specs/ and AGENTS.md when needed. Use after a change is merged or explicitly marked complete.
---
# Archive a completed change

Use this skill when the user asks to **archive** a change — typically after its PR is merged and deployed or accepted as done.

## Prerequisites

1. Change slug folder exists under `openspec/changes/<slug>/`.
2. Implementation PR is **merged** or user confirms completion without merge.
3. `tasks.md` reflects completed work (all relevant items checked, or explicitly waived).

## Workflow

1. **Verify** — quick smoke test on main branch if code changed; confirm success criteria from `proposal.md`.
2. **Promote specs** — extract durable facts into living docs under `openspec/specs/`:
   - `openspec/specs/architecture.md` — system shape, refresh strategy
   - `openspec/specs/data-sources.md` — connectors, auth, rate limits
   - `openspec/specs/ui.md` — iPad views and routes
   Create or update only what the change actually introduced.
3. **Update AGENTS.md** if stack, install steps, or agent rules changed.
4. **Move change folder**:
   ```
   openspec/changes/<slug>/  →  openspec/changes/archive/<slug>/
   ```
   Preserve all files; add optional `archive.md` with merge date and PR link if not already in proposal.
5. **Commit** on a branch `cursor/archive-<slug>-da44`, push, open PR titled `Archive: <slug>`.

## Rules

- Do not archive **proposed-only** changes (no implementation).
- Do not delete history — move, don't remove.
- If tasks remain incomplete, either finish via `/apply` or note explicit deferrals in `archive.md` before archiving.

## When done

Tell the user:
- Where the archived change lives
- Which living spec files were updated
- Suggested next `/propose` if follow-up work is obvious
