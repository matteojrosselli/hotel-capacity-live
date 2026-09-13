import type { PropertyCapacity } from "@/lib/capacity";
import type { CapacityConnector } from "../types";
import { getHiltonAccessToken, getHiltonAuthConfig } from "./auth";
import { getHiltonCatalog } from "./catalog";
import { normalizeHiltonProperty, shopHiltonProperty } from "./shop";

export function isHiltonConfigured(): boolean {
  return getHiltonAuthConfig() !== null;
}

export function createHiltonConnector(): CapacityConnector {
  return {
    id: "hilton",
    label: "Hilton Direct Connect",
    async fetchProperties(): Promise<PropertyCapacity[]> {
      const auth = getHiltonAuthConfig();
      if (!auth) {
        throw new Error(
          "Hilton connector requires HILTON_CLIENT_ID and HILTON_CLIENT_SECRET environment secrets",
        );
      }

      const token = await getHiltonAccessToken(auth);
      const catalog = getHiltonCatalog();
      const shopConfig = {
        apiBase: auth.apiBase,
        accessToken: token,
        fetchImpl: auth.fetchImpl,
      };

      const results = await Promise.all(
        catalog.map(async (entry) => {
          const shop = await shopHiltonProperty(entry, shopConfig);
          return normalizeHiltonProperty(entry, shop);
        }),
      );

      return results;
    },
  };
}

export const hiltonConnector = createHiltonConnector();
