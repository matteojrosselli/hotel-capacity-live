import type { MarketCapacity, PropertyCapacity } from "@/lib/capacity";
import { aggregateMarketsFromProperties } from "@/lib/aggregate-markets";
import { getConnector } from "@/lib/connectors";

type CacheEntry = {
  properties: PropertyCapacity[];
  markets: MarketCapacity[];
  source: string;
  cachedAt: string;
};

let cache: CacheEntry | null = null;
let inflight: Promise<CacheEntry> | null = null;

function cacheTtlMs(): number {
  const raw = process.env.CAPACITY_CACHE_TTL_MS;
  const parsed = raw ? Number.parseInt(raw, 10) : 300_000;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 300_000;
}

function isStale(entry: CacheEntry): boolean {
  const age = Date.now() - new Date(entry.cachedAt).getTime();
  return age >= cacheTtlMs();
}

async function refreshCache(force = false): Promise<CacheEntry> {
  if (!force && cache && !isStale(cache)) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const connector = getConnector();
    const properties = await connector.fetchProperties();
    const markets = aggregateMarketsFromProperties(properties);
    const entry: CacheEntry = {
      properties,
      markets,
      source: connector.id,
      cachedAt: new Date().toISOString(),
    };
    cache = entry;
    return entry;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function clearCapacityCache(): void {
  cache = null;
}

export async function getMarkets(force = false): Promise<{
  markets: MarketCapacity[];
  source: string;
  cachedAt: string;
}> {
  const entry = await refreshCache(force);
  return {
    markets: entry.markets,
    source: entry.source,
    cachedAt: entry.cachedAt,
  };
}

export async function getPropertiesByAirport(
  airportCode: string,
  force = false,
): Promise<{
  properties: PropertyCapacity[];
  source: string;
  cachedAt: string;
}> {
  const entry = await refreshCache(force);
  const code = airportCode.toUpperCase();
  const properties = entry.properties.filter(
    (p) => p.airportCode.toUpperCase() === code,
  );
  return {
    properties,
    source: entry.source,
    cachedAt: entry.cachedAt,
  };
}
