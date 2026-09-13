import { describe, expect, it } from "vitest";
import { aggregateMarketsFromProperties } from "@/lib/aggregate-markets";
import type { PropertyCapacity } from "@/lib/capacity";

describe("aggregateMarketsFromProperties", () => {
  it("groups properties by airport and sums totals", () => {
    const properties: PropertyCapacity[] = [
      {
        propertyId: "a",
        name: "A",
        airportCode: "ORD",
        roomsTotal: 100,
        roomsAvailable: 20,
        roomsSold: 80,
        asOf: "2026-01-01T12:00:00.000Z",
      },
      {
        propertyId: "b",
        name: "B",
        airportCode: "ORD",
        roomsTotal: 200,
        roomsAvailable: 40,
        roomsSold: 160,
        asOf: "2026-01-01T13:00:00.000Z",
      },
    ];

    const markets = aggregateMarketsFromProperties(properties);
    expect(markets).toHaveLength(1);
    expect(markets[0].airportCode).toBe("ORD");
    expect(markets[0].properties).toBe(2);
    expect(markets[0].roomsTotal).toBe(300);
    expect(markets[0].roomsAvailable).toBe(60);
    expect(markets[0].occupancyPct).toBe(80);
    expect(markets[0].asOf).toBe("2026-01-01T13:00:00.000Z");
  });
});
