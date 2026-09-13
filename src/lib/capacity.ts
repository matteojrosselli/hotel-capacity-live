export type PropertyCapacity = {
  propertyId: string;
  name: string;
  airportCode: string;
  roomsTotal: number;
  roomsAvailable: number;
  roomsSold: number;
  asOf: string;
};

export type MarketCapacity = {
  airportCode: string;
  marketName: string;
  properties: number;
  roomsTotal: number;
  roomsAvailable: number;
  occupancyPct: number;
  asOf: string;
};

/** Placeholder data until live connectors land via /apply. */
export function getMockPropertyCapacity(): PropertyCapacity[] {
  const asOf = new Date().toISOString();
  return [
    {
      propertyId: "prop-ord-001",
      name: "Loop Tower Hotel",
      airportCode: "ORD",
      roomsTotal: 420,
      roomsAvailable: 87,
      roomsSold: 333,
      asOf,
    },
    {
      propertyId: "prop-lax-001",
      name: "Westside Grand",
      airportCode: "LAX",
      roomsTotal: 310,
      roomsAvailable: 41,
      roomsSold: 269,
      asOf,
    },
  ];
}

export function getMockMarketCapacity(): MarketCapacity[] {
  const asOf = new Date().toISOString();
  return [
    {
      airportCode: "ORD",
      marketName: "Chicago O'Hare",
      properties: 48,
      roomsTotal: 12400,
      roomsAvailable: 2100,
      occupancyPct: 83,
      asOf,
    },
    {
      airportCode: "LAX",
      marketName: "Los Angeles Intl",
      properties: 62,
      roomsTotal: 18200,
      roomsAvailable: 3200,
      occupancyPct: 82,
      asOf,
    },
  ];
}

export function occupancyPct(available: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round(((total - available) / total) * 100);
}
