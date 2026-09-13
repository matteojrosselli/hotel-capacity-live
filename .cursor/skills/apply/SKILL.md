---
name: apply
description: Implement an approved OpenSpec change from openspec/changes/<slug>/, check off tasks.md, and open or update a pull request. Use after proposal review — not for greenfield bootstrap or drive-by edits.
---
# Apply an approved change

Use this skill when the user asks to **apply**, **implement**, or **build** an approved change identified by slug.

## Prerequisites

1. Folder exists: `openspec/changes/<slug>/` with `proposal.md`, `tasks.md`, `design.md`.
2. User has **approved** the proposal (explicit approval or PR review sign-off).
3. If approval is unclear, stop and ask — do not implement on assumption.

## Workflow

1. **Read** all three change docs and `AGENTS.md`.
2. **Branch** — create `cursor/<slug>-da44` (or continue an existing branch for this slug).
3. **Implement** following `design.md`, completing tasks in logical order.
4. **Test** — run `npm test`, `npm run build`, and any change-specific smoke steps from `proposal.md`.
5. **Update tasks.md** — check off completed items (`- [x]`). Leave unchecked items if intentionally deferred; note why in the PR.
6. **Commit & push** — clear messages referencing the slug.
7. **Pull request** — open or update a PR titled `[<slug>] <short title>`. Link to `openspec/changes/<slug>/proposal.md` in the description.

## Rules

- Stay within **in scope** in `proposal.md`. Out-of-scope work needs a new `/propose`.
- Do not archive in the same PR unless the user asks — archiving is **`/archive`**.
- No secrets in commits; use environment secrets for API keys.
- Prefer minimal diffs; match existing conventions.

## When blocked

If `design.md` open questions remain or external access is missing:
- Implement what is unblocked (e.g. mock adapter, UI shell)
- Document blockers in the PR
- Do not guess at production credentials

## When done

Summarize:
- PR link
- Tasks completed vs remaining
- How to smoke-test the change
- Whether `/archive` is appropriate after merge
