import type { CapacityConnector } from "./types";
import { createCompositeConnector } from "./composite";
import { createHiltonConnector, isHiltonConfigured } from "./hilton/connector";
import { createMockLiveConnector } from "./mock-live";

const CONNECTOR_FACTORIES: Record<string, () => CapacityConnector> = {
  "mock-live": createMockLiveConnector,
  hilton: createHiltonConnector,
};

export function listConnectorIds(): string[] {
  return Object.keys(CONNECTOR_FACTORIES);
}

export function createConnector(id: string): CapacityConnector {
  const factory = CONNECTOR_FACTORIES[id];
  if (!factory) {
    throw new Error(
      `Unknown CAPACITY_CONNECTOR "${id}". Available: ${listConnectorIds().join(", ")}, composite`,
    );
  }
  return factory();
}

function parseVendorList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Resolve active connector from env — supports single vendor or composite. */
export function getConnector(): CapacityConnector {
  const mode = process.env.CAPACITY_CONNECTOR?.trim() || "mock-live";

  if (mode === "composite") {
    const vendors =
      parseVendorList(process.env.CAPACITY_VENDORS) ||
      (isHiltonConfigured() ? ["hilton", "mock-live"] : ["mock-live"]);
    return createCompositeConnector(vendors.map(createConnector));
  }

  return createConnector(mode);
}
