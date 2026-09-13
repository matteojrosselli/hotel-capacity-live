# Proposal: Live data connector for airport market capacity

## Problem

The dashboard currently renders **static mock data** from `getMockMarketCapacity()` and `getMockPropertyCapacity()` on the server at build/request time. There is no refresh pipeline, no API boundary for agents or iPad clients to poll, and no way to drill from an airport market into its constituent properties. Operators cannot trust "as of" timestamps or see capacity move without a full page reload.

## Scope

### In scope

- **Connector layer** — pluggable fetch/normalize pipeline that returns `MarketCapacity[]` and `PropertyCapacity[]` using the existing types in `src/lib/capacity.ts`.
- **Initial connector** — `mock-live` provider that returns deterministic seed data with **simulated drift** (small random deltas on each fetch) so polling visibly updates the UI without external vendor credentials.
- **Hilton connector** — real **Hilton Direct Connect Shop** integration (`POST /hospitality-partner/v2/dcshop/props/{propCode}`) with OAuth client credentials; normalizes `numRoomsAvail` into property capacity for catalogued Hilton airport properties.
- **Multi-vendor registry** — `CAPACITY_CONNECTOR` supports `mock-live`, `hilton`, or `composite`; `CAPACITY_VENDORS` lists vendors to merge (e.g. `hilton,mock-live`).
- **Server cache** — in-memory TTL cache (default **5 minutes**) keyed by airport code; connector runs only on cache miss or explicit refresh.
- **API routes** (Next.js App Router):
  - `GET /api/markets` — all airport markets with aggregate capacity.
  - `GET /api/markets/[airportCode]/properties` — property-level rows for one market (drill-down).
- **Client polling** — dashboard polls `/api/markets` every **5 minutes** (configurable via env); shows last-updated time and a lightweight loading/error state.
- **Property drill-down UI** — tap/click an airport market card to expand or navigate to a filtered property list for that `airportCode`; data loaded from the properties API route.
- **Unit tests** — connector normalization, cache TTL behavior, and API route response shapes.

### Out of scope

- Additional real vendor integrations beyond Hilton (STR, OTA, other PMS) — registry supports swap-in later.
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
- [ ] Header or market cards show **data source** (connector id, e.g. `mock-live`, `hilton`, `hilton+mock-live`) and **last refreshed** timestamp.
- [ ] With `HILTON_CLIENT_ID` + `HILTON_CLIENT_SECRET` set, `CAPACITY_CONNECTOR=hilton` fetches real availability from Hilton shop API for catalogued properties.
- [ ] `npm test` covers connector + cache helpers; smoke test (`npm test && npm run build`) passes.
- [ ] No secrets committed; connector selection via `CAPACITY_CONNECTOR` env (default `mock-live`).

## Dependencies / blockers

- None for `mock-live` implementation.
- Hilton live data requires `HILTON_CLIENT_ID` and `HILTON_CLIENT_SECRET` in Cloud Agent environment secrets (Hilton Partner API / Direct Connect sandbox or production).
- Additional vendors will follow the same connector registry pattern (documented at archive time in `openspec/specs/data-sources.md`).
