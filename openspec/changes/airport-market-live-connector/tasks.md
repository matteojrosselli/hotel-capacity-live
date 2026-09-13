# Tasks: airport-market-live-connector

- [ ] Add connector interface and registry in `src/lib/connectors/` (`CapacityConnector`, `getConnector()` driven by `CAPACITY_CONNECTOR` env, default `mock-live`)
- [ ] Implement `mock-live` connector: seed markets ORD/LAX (+ at least one extra market), property rows per market, simulated drift on `roomsAvailable`/`roomsSold` within sane bounds
- [ ] Add in-memory cache module with configurable TTL (`CAPACITY_CACHE_TTL_MS`, default 300_000) and helpers `getMarkets()`, `getPropertiesByAirport(airportCode)`
- [ ] Add aggregation helper to derive `MarketCapacity` from property rows when connector returns properties-first (or document markets-first path if mock returns both)
- [ ] Implement `GET /api/markets` route returning `{ markets, source, cachedAt }` with appropriate cache headers
- [ ] Implement `GET /api/markets/[airportCode]/properties` route with IATA validation, 404 for unknown codes, returning `{ properties, airportCode, source, cachedAt }`
- [ ] Extract presentational components from `page.tsx`: `MarketCard`, `PropertyTable`, `RefreshStatus`
- [ ] Convert home dashboard to client-side fetch + 5-minute polling (`useEffect` + `setInterval` or shared hook `useMarketCapacity`)
- [ ] Wire market card click/tap to drill-down: expand inline section or dedicated panel showing properties from properties API for selected `airportCode`
- [ ] Display loading skeleton, error retry affordance, and last-refreshed timestamp in header
- [ ] Unit tests: mock-live drift stays within bounds, cache respects TTL, API handlers return expected shapes (route tests or handler unit tests)
- [ ] Update home page copy to remove "mock until /propose" bootstrap message; show connector name and refresh interval
- [ ] Manual smoke: dev server running, markets load from API, drill-down works for ORD and LAX, wait or force cache expiry to confirm refresh updates `asOf`
