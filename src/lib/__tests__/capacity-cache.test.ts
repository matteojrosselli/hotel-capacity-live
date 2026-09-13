import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearCapacityCache,
  getMarkets,
  getPropertiesByAirport,
} from "@/lib/capacity-cache";

describe("capacity cache", () => {
  beforeEach(() => {
    clearCapacityCache();
    vi.stubEnv("CAPACITY_CONNECTOR", "mock-live");
    vi.stubEnv("CAPACITY_CACHE_TTL_MS", "300000");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    clearCapacityCache();
  });

  it("returns markets from connector", async () => {
    const result = await getMarkets();
    expect(result.markets.length).toBeGreaterThan(0);
    expect(result.source).toBe("mock-live");
    expect(result.cachedAt).toBeTruthy();
  });

  it("filters properties by airport code", async () => {
    const { properties } = await getPropertiesByAirport("LAX");
    expect(properties.length).toBeGreaterThan(0);
    expect(properties.every((p) => p.airportCode === "LAX")).toBe(true);
  });

  it("reuses cache within TTL", async () => {
    const first = await getMarkets();
    const second = await getMarkets();
    expect(second.cachedAt).toBe(first.cachedAt);
  });
});
