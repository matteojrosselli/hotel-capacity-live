import type { PropertyCapacity } from "@/lib/capacity";

/** Vendor connector — fetches property-level capacity rows. */
export interface CapacityConnector {
  readonly id: string;
  readonly label: string;
  fetchProperties(): Promise<PropertyCapacity[]>;
}

export type ConnectorFetchResult = {
  properties: PropertyCapacity[];
  source: string;
};
