import type { PropertyCapacity } from "@/lib/capacity";
import type { CapacityConnector } from "./types";

export function createCompositeConnector(
  connectors: CapacityConnector[],
): CapacityConnector {
  const ids = connectors.map((c) => c.id).join("+");

  return {
    id: ids || "composite",
    label: connectors.map((c) => c.label).join(" + ") || "Composite",
    async fetchProperties(): Promise<PropertyCapacity[]> {
      const batches = await Promise.all(
        connectors.map(async (connector) => {
          try {
            return await connector.fetchProperties();
          } catch (error) {
            console.error(
              `[capacity] vendor "${connector.id}" fetch failed:`,
              error,
            );
            return [] as PropertyCapacity[];
          }
        }),
      );

      const merged: PropertyCapacity[] = [];
      const seen = new Set<string>();
      for (const batch of batches) {
        for (const row of batch) {
          if (seen.has(row.propertyId)) continue;
          seen.add(row.propertyId);
          merged.push(row);
        }
      }

      if (merged.length === 0) {
        throw new Error("All configured capacity vendors failed to return data");
      }

      return merged;
    },
  };
}
