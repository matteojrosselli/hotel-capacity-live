# UI

## Routes

| Route | Type | Description |
| --- | --- | --- |
| `/` | Static shell + client dashboard | Airport markets grid, drill-down, refresh status |
| `/api/markets` | API | All markets JSON |
| `/api/markets/[airportCode]/properties` | API | Property drill-down JSON |

## Home dashboard (`src/components/Dashboard.tsx`)

**Header**

- Title: Hotel Capacity Live
- `RefreshStatus`: connector source id, last updated time, poll interval, manual refresh button

**Airport markets**

- Responsive 2-column grid of `MarketCard` components
- Tap/click selects market (highlight ring); tap again deselects
- Skeleton placeholders while loading

**Property drill-down**

- Inline panel below market grid when a market is selected
- `PropertyTable` with property name, market code, available, sold, occupancy
- Close button collapses panel

**Error states**

- Banner with Retry for markets or drill-down fetch failures

## iPad layout notes

- Max width `5xl`, generous padding (`px-4 md:px-8`)
- Market cards use large tap targets and clear selected state
- Property table horizontally scrolls on narrow viewports (`min-w-[640px]`)

## Client hooks

| Hook | Purpose |
| --- | --- |
| `useMarketCapacity` | Poll `/api/markets` on mount + interval |
| `useMarketProperties` | Fetch `/api/markets/[code]/properties` when market selected |
