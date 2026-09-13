import { describe, expect, it } from "vitest";
import { normalizeAirportCode } from "@/lib/airport-code";

describe("normalizeAirportCode", () => {
  it("accepts valid IATA codes", () => {
    expect(normalizeAirportCode("ord")).toBe("ORD");
    expect(normalizeAirportCode(" LAX ")).toBe("LAX");
  });

  it("rejects invalid codes", () => {
    expect(normalizeAirportCode("OR")).toBeNull();
    expect(normalizeAirportCode("ORDD")).toBeNull();
    expect(normalizeAirportCode("12A")).toBeNull();
  });
});
