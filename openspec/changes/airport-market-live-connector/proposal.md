# Proposal: Live data connector for airport market capacity

## Problem

The dashboard currently renders **static mock data** from `getMockMarketCapacity()` and `getMockPropertyCapacity()` on the server at build/request time. There is no refresh pipeline, no API boundary for agents or iPad clients to poll, and no way to drill from an airport market into its constituent properties. Operators cannot trust "as of" timestamps or see capacity move without a full page reload.

## Scope

### In scope

- **Connector layer** — pluggable fetch/normalize pipeline that returns `MarketCapacity[]` and `PropertyCapacity[]` using the existing types in `src/lib/capacity.ts`.
- **Initial connector** — `mock-live` provider that returns deterministic seed data with **simulated drift** (small random deltas on each fetch) so polling visibly updates the UI without external vendor credentials.
- **Server cache** — in-memory TTL cache (default **5 minutes**) keyed by airport code; connector runs only on cache miss or explicit refresh.
- **API routes** (Next.js App Router):
  - `GET /api/markets` — all airport markets with aggregate capacity.
  - `GET /api/markets/[airportCode]/properties` — property-level rows for one market (drill-down).
- **Client polling** — dashboard polls `/api/markets` every **5 minutes** (configurable via env); shows last-updated time and a lightweight loading/error state.
- **Property drill-down UI** — tap/click an airport market card to expand or navigate to a filtered property list for that `airportCode`; data loaded from the properties API route.
- **Unit tests** — connector normalization, cache TTL behavior, and API route response shapes.

### Out of scope

- Real vendor integrations (STR, OTA, PMS) — connector interface only; swap-in later via env (`CAPACITY_CONNECTOR=str`).
- Authentication / API keys exposed to the browser.
- Postgres, Redis, or WebSocket push (polling only for this change).
- Historical charts, alerts, or multi-day forecasts.
- iPad-native app shell (web responsive layout only).

## Success criteria

- [ ] `GET /api/markets` returns JSON matching `MarketCapacity[]` with `asOf` updated on each cache refresh.
- [ ] `GET /api/markets/ORD/properties` (and other valid IATA codes) returns `PropertyCapacity[]` filtered to that market.
- [ ] Unknown airport codes return **404** with a clear error body.
- [ ] Dashboard shows live-fetched markets (not direct mock imports) and **auto-refreshes every 5 minutes** without full page reload.
- [ ] User can drill into a market and see only properties for that airport code.
- [ ] Header or market cards show **data source** (`mock-live`) and **last refreshed** timestamp.
- [ ] `npm test` covers connector + cache helpers; smoke test (`npm test && npm run build`) passes.
- [ ] No secrets committed; connector selection via `CAPACITY_CONNECTOR` env (default `mock-live`).

## Dependencies / blockers

- None for `mock-live` implementation.
- Future real connectors will require vendor API keys in Cloud Agent environment secrets (documented at archive time in `openspec/specs/data-sources.md`).
