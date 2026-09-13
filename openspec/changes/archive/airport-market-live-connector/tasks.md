# Tasks: airport-market-live-connector

- [x] Add connector interface and registry in `src/lib/connectors/` (`CapacityConnector`, `getConnector()` driven by `CAPACITY_CONNECTOR` env, default `mock-live`)
- [x] Implement `mock-live` connector: seed markets ORD/LAX/JFK, property rows per market, simulated drift on `roomsAvailable`/`roomsSold` within sane bounds
- [x] Implement `hilton` connector: OAuth token, Direct Connect shop per catalog property, normalize `numRoomsAvail` to `PropertyCapacity`
- [x] Implement `composite` connector and `CAPACITY_VENDORS` for multi-vendor merge
- [x] Add in-memory cache module with configurable TTL (`CAPACITY_CACHE_TTL_MS`, default 300_000) and helpers `getMarkets()`, `getPropertiesByAirport(airportCode)`
- [x] Add aggregation helper to derive `MarketCapacity` from property rows when connector returns properties-first
- [x] Implement `GET /api/markets` route returning `{ markets, source, cachedAt }` with appropriate cache headers
- [x] Implement `GET /api/markets/[airportCode]/properties` route with IATA validation, 404 for unknown codes, returning `{ properties, airportCode, source, cachedAt }`
- [x] Extract presentational components from `page.tsx`: `MarketCard`, `PropertyTable`, `RefreshStatus`
- [x] Convert home dashboard to client-side fetch + 5-minute polling (`useMarketCapacity` hook)
- [x] Wire market card click/tap to drill-down: inline panel showing properties from properties API for selected `airportCode`
- [x] Display loading skeleton, error retry affordance, and last-refreshed timestamp in header
- [x] Unit tests: mock-live drift, cache TTL, Hilton normalization, composite merge, API helper shapes
- [x] Update home page copy; show connector name and refresh interval
- [x] Manual smoke: dev server running, markets load from API, drill-down works for ORD and LAX
