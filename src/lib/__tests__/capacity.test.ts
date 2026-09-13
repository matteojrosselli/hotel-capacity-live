import { describe, expect, it } from "vitest";
import {
  getMockMarketCapacity,
  getMockPropertyCapacity,
  occupancyPct,
} from "../capacity";

describe("capacity", () => {
  it("returns mock property rows with valid totals", () => {
    const rows = getMockPropertyCapacity();
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.roomsSold + row.roomsAvailable).toBe(row.roomsTotal);
    }
  });

  it("returns mock market rows", () => {
    const rows = getMockMarketCapacity();
    expect(rows.some((r) => r.airportCode === "ORD")).toBe(true);
  });

  it("computes occupancy percentage", () => {
    expect(occupancyPct(20, 100)).toBe(80);
    expect(occupancyPct(0, 0)).toBe(0);
  });
});
