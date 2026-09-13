/** Static Hilton property catalog — prop codes mapped to airport markets. */
export type HiltonCatalogEntry = {
  propCode: string;
  name: string;
  airportCode: string;
  /** Physical room count for occupancy when shop returns availability only. */
  roomsTotal: number;
};

export const HILTON_CATALOG: HiltonCatalogEntry[] = [
  {
    propCode: "ORDCH",
    name: "Hilton Chicago O'Hare Airport",
    airportCode: "ORD",
    roomsTotal: 369,
  },
  {
    propCode: "LAXAHHI",
    name: "Hilton Los Angeles Airport",
    airportCode: "LAX",
    roomsTotal: 614,
  },
  {
    propCode: "JFKTM",
    name: "Hilton New York JFK Airport",
    airportCode: "JFK",
    roomsTotal: 356,
  },
];

export function getHiltonCatalog(): HiltonCatalogEntry[] {
  const raw = process.env.HILTON_PROPERTY_CATALOG;
  if (!raw) return HILTON_CATALOG;
  try {
    const parsed = JSON.parse(raw) as HiltonCatalogEntry[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("HILTON_PROPERTY_CATALOG must be a non-empty JSON array");
    }
    return parsed;
  } catch (error) {
    throw new Error(
      `Invalid HILTON_PROPERTY_CATALOG: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
