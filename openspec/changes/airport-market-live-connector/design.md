# Design: airport-market-live-connector

## Overview

Introduce a server-side **connector → cache → API → client poll** pipeline. The dashboard stops importing mock functions directly; instead it polls Next.js API routes that read from a TTL cache backed by a pluggable connector. The first connector (`mock-live`) simulates live feeds for development and demos. Market cards become interactive entry points for **property-level drill-down** via a nested API route.

## Data model

Reuse existing types from `src/lib/capacity.ts`:

```typescript
type PropertyCapacity = {
  propertyId: string;
  name: string;
  airportCode: string; // IATA, e.g. "ORD"
  roomsTotal: number;
  roomsAvailable: number;
  roomsSold: number;
  asOf: string; // ISO 8601
};

type MarketCapacity = {
  airportCode: string;
  marketName: string;
  properties: number;
  roomsTotal: number;
  roomsAvailable: number;
  occupancyPct: number;
  asOf: string;
};
```

**API response envelopes** (new):

```typescript
type MarketsResponse = {
  markets: MarketCapacity[];
  source: string; // connector id, e.g. "mock-live"
  cachedAt: string;
};

type PropertiesResponse = {
  airportCode: string;
  properties: PropertyCapacity[];
  source: string;
  cachedAt: string;
};

type ApiError = { error: string; code?: string };
```

**Aggregation rule:** If the connector returns properties only, markets are computed by grouping on `airportCode`:

- `properties` = count of rows
- `roomsTotal` / `roomsAvailable` = sums
- `occupancyPct` = `occupancyPct(roomsAvailable, roomsTotal)` (existing helper)
- `asOf` = max `asOf` among grouped properties (or fetch timestamp)

## Architecture

```
┌─────────────┐     poll 5m      ┌──────────────────┐
│  Dashboard  │ ───────────────► │ GET /api/markets │
│  (client)   │                  └────────┬─────────┘
└──────┬──────┘                           │
       │ drill-down                       ▼
       │                          ┌───────────────┐
       └────────────────────────► │  Cache layer  │ TTL 5m
                                  └───────┬───────┘
                                          │ miss
                                          ▼
                                  ┌───────────────┐
                                  │  Connector    │ mock-live (v1)
                                  │  registry     │ → future: str, internal
                                  └───────────────┘
```

**Refresh semantics:**

| Layer | Behavior |
| --- | --- |
| Client | `setInterval` 300_000 ms; also refetch on drill-down open and manual retry |
| Server cache | Single process in-memory `Map`; TTL from env; stale entry triggers connector fetch |
| Connector | Stateless fetch; `mock-live` applies bounded random walk to availability |

## API / connectors

### Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `CAPACITY_CONNECTOR` | `mock-live` | Connector id |
| `CAPACITY_CACHE_TTL_MS` | `300000` | Server cache TTL (5 min) |
| `NEXT_PUBLIC_CAPACITY_POLL_MS` | `300000` | Client poll interval |

### Routes

**`GET /api/markets`**

- 200: `MarketsResponse`
- 500: `{ error: "Failed to load markets" }` if connector throws

**`GET /api/markets/[airportCode]/properties`**

- Normalize `airportCode` to uppercase; validate `/^[A-Z]{3}$/`
- 200: `PropertiesResponse`
- 404: `{ error: "Unknown market", code: "MARKET_NOT_FOUND" }` when no properties exist for code
- 400: invalid airport code format

### Connector interface

```typescript
interface CapacityConnector {
  readonly id: string;
  fetchProperties(): Promise<PropertyCapacity[]>;
  // Optional: fetchMarkets() for connectors that return aggregates directly
}
```

**`mock-live` behavior:**

- Seed ≥3 properties across ORD, LAX, and one additional market (e.g. JFK).
- On each fetch, adjust `roomsAvailable` ±0–5 per property, clamp to `[0, roomsTotal]`, recompute `roomsSold = roomsTotal - roomsAvailable`.
- Set `asOf` to `new Date().toISOString()`.
- Use deterministic RNG seeded by hour bucket if tests need stability, or inject RNG for tests.

**Future connectors:** Register in `src/lib/connectors/index.ts`; STR/internal implementations live in separate OpenSpec changes.

## UI

**iPad / responsive layout:**

1. **Header** — title, subtitle, `RefreshStatus` pill: "Source: mock-live · Updated 2:34 PM · Next refresh in 4:12".
2. **Market grid** — existing card layout; add `cursor-pointer` / tap target, selected state ring (`border-sky-400`), chevron hint.
3. **Drill-down panel** — below grid or slide-over on narrow viewports:
   - Title: "{marketName} ({airportCode}) properties"
   - Reuse `PropertyTable` filtered to fetched properties
   - Back/close control to collapse selection
4. **States** — skeleton cards while loading; inline error banner with "Retry" button.

**Client hook sketch:**

```typescript
function useMarketCapacity(pollMs: number) {
  // fetch /api/markets on mount + interval
  // return { markets, loading, error, lastFetched, refetch }
}
```

Drill-down fetches `/api/markets/${code}/properties` when a card is selected (cache on client for session to avoid duplicate calls).

## Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| In-memory cache invalid across serverless instances | Acceptable for v1; document that each instance may refresh independently; future Redis change |
| Simulated drift looks unrealistic | Clamp deltas; keep occupancy between 70–90% on seed data |
| Polling hammers API during many tabs | Server cache dedupes connector work; client uses single interval per tab only |
| Client/server type drift | Share types from `src/lib/capacity.ts`; API tests assert shapes |
| Drill-down UX unclear on desktop | Selected card highlight + explicit "Viewing N properties" panel |

## Open questions

- Should drill-down be **inline expand** vs. **separate route** `/markets/[code]`? **Recommendation:** inline panel on home for v1 (fewer routes); revisit if navigation deepens.
- Include **manual refresh button** in v1? **Recommendation:** yes — calls `refetch()` and bypasses client-side stale display only (server cache still applies unless `?refresh=1` query added later).
- Expose **`Cache-Control`** on API responses? **Recommendation:** `private, max-age=60` for CDN/browser hint; server TTL remains authoritative.
