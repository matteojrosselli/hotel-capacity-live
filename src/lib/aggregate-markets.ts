import type { MarketCapacity, PropertyCapacity } from "@/lib/capacity";
import { occupancyPct } from "@/lib/capacity";

const MARKET_NAMES: Record<string, string> = {
  ORD: "Chicago O'Hare",
  LAX: "Los Angeles Intl",
  JFK: "New York JFK",
};

function marketNameFor(airportCode: string): string {
  return MARKET_NAMES[airportCode] ?? `${airportCode} market`;
}

export function aggregateMarketsFromProperties(
  properties: PropertyCapacity[],
): MarketCapacity[] {
  const byAirport = new Map<string, PropertyCapacity[]>();

  for (const row of properties) {
    const code = row.airportCode.toUpperCase();
    const list = byAirport.get(code) ?? [];
    list.push(row);
    byAirport.set(code, list);
  }

  const markets: MarketCapacity[] = [];

  for (const [airportCode, rows] of byAirport) {
    const roomsTotal = rows.reduce((sum, r) => sum + r.roomsTotal, 0);
    const roomsAvailable = rows.reduce((sum, r) => sum + r.roomsAvailable, 0);
    const asOf = rows.reduce(
      (latest, r) => (r.asOf > latest ? r.asOf : latest),
      rows[0]?.asOf ?? new Date().toISOString(),
    );

    markets.push({
      airportCode,
      marketName: marketNameFor(airportCode),
      properties: rows.length,
      roomsTotal,
      roomsAvailable,
      occupancyPct: occupancyPct(roomsAvailable, roomsTotal),
      asOf,
    });
  }

  return markets.sort((a, b) => a.airportCode.localeCompare(b.airportCode));
}
