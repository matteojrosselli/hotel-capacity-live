# Architecture

## System shape

Hotel Capacity Live uses a **connector → cache → API → client poll** pipeline.

```
Dashboard (client)  ──poll──►  GET /api/markets
       │                              │
       └── drill-down ──►  GET /api/markets/[airportCode]/properties
                                      │
                                      ▼
                              capacity-cache (in-memory TTL)
                                      │
                                      ▼
                              connector registry
                              (mock-live | hilton | composite)
```

## Refresh strategy

| Layer | Default cadence | Config |
| --- | --- | --- |
| Client poll | 5 minutes | `NEXT_PUBLIC_CAPACITY_POLL_MS` |
| Server cache | 5 minutes | `CAPACITY_CACHE_TTL_MS` |
| Connector fetch | On cache miss or `?refresh=1` | — |

Manual **Refresh now** on the dashboard calls `/api/markets?refresh=1` to bypass stale server cache.

## Key modules

| Path | Role |
| --- | --- |
| `src/lib/connectors/` | Vendor connectors and registry |
| `src/lib/capacity-cache.ts` | TTL cache, `getMarkets()`, `getPropertiesByAirport()` |
| `src/lib/aggregate-markets.ts` | Derive `MarketCapacity[]` from property rows |
| `src/lib/capacity.ts` | Shared types and `occupancyPct()` |
| `src/app/api/markets/` | JSON API for markets and property drill-down |
| `src/components/Dashboard.tsx` | Client UI with polling and drill-down |

## Limits (v1)

- In-memory cache only (no Redis); each server instance refreshes independently.
- Polling only (no WebSockets).
- No auth on API routes (internal/dashboard use).
