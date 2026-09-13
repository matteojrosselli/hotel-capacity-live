import { afterEach, describe, expect, it, vi } from "vitest";
import { clearCapacityCache } from "@/lib/capacity-cache";
import { createCompositeConnector } from "@/lib/connectors/composite";
import { createMockLiveConnector } from "@/lib/connectors/mock-live";
import { getConnector } from "@/lib/connectors/registry";

describe("connector registry", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    clearCapacityCache();
  });

  it("defaults to mock-live", () => {
    vi.unstubAllEnvs();
    const connector = getConnector();
    expect(connector.id).toBe("mock-live");
  });

  it("supports composite vendor mode", async () => {
    vi.stubEnv("CAPACITY_CONNECTOR", "composite");
    vi.stubEnv("CAPACITY_VENDORS", "mock-live");

    const connector = getConnector();
    expect(connector.id).toBe("mock-live");
    const rows = await connector.fetchProperties();
    expect(rows.length).toBeGreaterThan(0);
  });

  it("merges properties from multiple vendors without duplicate ids", async () => {
    const a = createMockLiveConnector(() => 0.1);
    const b = createCompositeConnector([
      {
        id: "extra",
        label: "Extra",
        async fetchProperties() {
          return [
            {
              propertyId: "unique-extra",
              name: "Extra Hotel",
              airportCode: "DFW",
              roomsTotal: 100,
              roomsAvailable: 10,
              roomsSold: 90,
              asOf: new Date().toISOString(),
            },
          ];
        },
      },
      a,
    ]);

    const rows = await b.fetchProperties();
    expect(rows.some((r) => r.propertyId === "unique-extra")).toBe(true);
    expect(rows.some((r) => r.airportCode === "ORD")).toBe(true);
  });
});
