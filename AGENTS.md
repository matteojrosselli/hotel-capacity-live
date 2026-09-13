# AGENTS.md — Hotel Capacity Live

## Product idea

**Hotel Capacity Live** is a dashboard for iPad and Cloud Agents that pulls and displays **live hotel room capacity** at two levels:

1. **Property level** — rooms available, sold, and total capacity per hotel/property.
2. **Airport market level** — aggregated capacity and occupancy for markets tied to airport codes (e.g. ORD, LAX, JFK).

Data should be as **current as possible**, sourced from vendor APIs, PMS/channel-manager connectors, or other approved feeds. The UI is optimized for quick scanning on iPad and for agent-driven workflows in Cursor Cloud Agents.

This repository is a **greenfield bootstrap**. The app currently shows placeholder/mock data. Real connectors and refresh pipelines are implemented only through approved OpenSpec changes.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 15** (App Router) | SSR/API routes, Cloud Agent friendly, strong TypeScript support |
| Language | **TypeScript** | Type safety for API contracts and capacity models |
| Styling | **Tailwind CSS** | Fast, responsive UI for iPad layouts |
| Tests | **Vitest** | Lightweight unit tests for data helpers and API adapters |
| Package manager | **npm** | Default for Cloud Agent `install` scripts |

Future additions (via `/propose`, not bootstrap): data connectors (STR, OTA feeds, internal APIs), polling/WebSocket refresh, Postgres or Redis cache, auth.

## Cloud Agent workflow: propose → apply → archive

**Do not implement large or architectural changes without a written proposal first.**

| Phase | Skill | What happens |
| --- | --- | --- |
| **Propose** | `.cursor/skills/propose` | Write `openspec/changes/<slug>/{proposal.md,tasks.md,design.md}`. No product code yet. |
| **Apply** | `.cursor/skills/apply` | Implement an **approved** change, check off `tasks.md`, commit on a branch, open/update PR. |
| **Archive** | `.cursor/skills/archive` | Move completed change docs to `openspec/changes/archive/`, update living specs under `openspec/specs/` and this file if needed. |

Slugs are kebab-case (e.g. `str-market-connector`, `property-capacity-api`).

## Install / run / smoke-test (Cloud Agents)

From the repository root:

```bash
# Install (also runs automatically via .cursor/environment.json)
npm install

# Development server (http://localhost:3000)
npm run dev

# Unit tests
npm test

# Production build
npm run build
```

**Smoke test** (after `npm install`):

```bash
npm test && npm run build
curl -sf http://localhost:3000 | grep -q "Hotel Capacity Live"
```

The last line assumes `npm run dev` is running in another terminal. A passing smoke test means tests green, build succeeds, and the home page renders the app title.

## Repository layout

```
AGENTS.md                 # This file — product + agent rules
.cursor/
  environment.json        # Cloud Agent install bootstrap
  skills/                 # propose | apply | archive
openspec/
  specs/                  # Living specifications (updated on archive)
  changes/                # Active change proposals
  changes/archive/        # Completed changes
src/                      # Next.js application
```

## Agent conventions

- Prefer small, focused PRs tied to one OpenSpec change slug.
- Keep secrets out of the repo; use Cloud Agent environment secrets for API keys.
- Document new data sources in `openspec/specs/data-sources.md` when archiving connector work.
- Match existing naming and file layout; read surrounding code before editing.

## Next steps

Run **`/propose`** with a concrete first feature, for example:

> `/propose Add STR or mock live connector for airport market capacity with 5-minute refresh`

That creates the change folder and design docs without code. After review, run **`/apply`** on the approved slug.
