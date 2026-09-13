# Data sources

Connectors implement `CapacityConnector` in `src/lib/connectors/types.ts` and register in `src/lib/connectors/registry.ts`.

Select via `CAPACITY_CONNECTOR` (default `mock-live`).

## mock-live

**Purpose:** Development and demos without vendor credentials.

**Behavior:** Seed properties for ORD, LAX, JFK with bounded random drift on each fetch.

**Secrets:** None.

## hilton

**Purpose:** Real property availability from Hilton Direct Connect Partner API.

**Auth:** OAuth2 client credentials

- Token: `POST {HILTON_API_BASE}/hospitality-partner/v2/realms/applications/token`
- Secrets: `HILTON_CLIENT_ID`, `HILTON_CLIENT_SECRET` (Cloud Agent environment secrets)

**Availability:** Single-property shop per catalog entry

- `POST {HILTON_API_BASE}/hospitality-partner/v2/dcshop/props/{propCode}`
- Stay dates: tonight → tomorrow, `numAdults: 1`
- Normalization: sum max `numRoomsAvail` per `roomTypeCode` from `roomRates`; `roomsTotal` from catalog

**Config:**

| Variable | Default |
| --- | --- |
| `HILTON_API_BASE` | `https://kapip-s.hilton.io` (sandbox) |
| `HILTON_PROPERTY_CATALOG` | Built-in ORD/LAX/JFK Hilton airport properties (JSON override optional) |

**Catalog fields:** `propCode`, `name`, `airportCode`, `roomsTotal`

**Docs:** [Hilton Developer Portal](https://developer.hilton.io/) — Direct Connect Shop

## composite

**Purpose:** Merge multiple vendors in one dashboard view.

**Config:**

```
CAPACITY_CONNECTOR=composite
CAPACITY_VENDORS=hilton,mock-live
```

Fetches vendors in parallel; merges by unique `propertyId`. Failed vendors are skipped unless all fail.

## Adding a vendor

1. Implement `CapacityConnector` under `src/lib/connectors/<vendor>/`.
2. Register factory in `src/lib/connectors/registry.ts`.
3. Document auth, endpoints, and env vars in this file via `/archive`.
