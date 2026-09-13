import { describe, expect, it } from "vitest";
import { applyMockDrift, createMockLiveConnector } from "@/lib/connectors/mock-live";

describe("mock-live connector", () => {
  it("keeps availability within room totals after drift", () => {
    let n = 0;
    const random = () => {
      n += 0.17;
      return n % 1;
    };

    const rows = applyMockDrift(
      [
        {
          propertyId: "p1",
          name: "Test",
          airportCode: "ORD",
          roomsTotal: 100,
          roomsAvailable: 50,
          roomsSold: 50,
        },
      ],
      random,
    );

    for (const row of rows) {
      expect(row.roomsAvailable).toBeGreaterThanOrEqual(0);
      expect(row.roomsAvailable).toBeLessThanOrEqual(row.roomsTotal);
      expect(row.roomsSold + row.roomsAvailable).toBe(row.roomsTotal);
    }
  });

  it("returns seeded markets including JFK", async () => {
    const connector = createMockLiveConnector(() => 0.5);
    const rows = await connector.fetchProperties();
    expect(rows.some((r) => r.airportCode === "JFK")).toBe(true);
    expect(rows.length).toBeGreaterThanOrEqual(5);
  });
});
