import type { PropertyCapacity } from "@/lib/capacity";
import type { HiltonCatalogEntry } from "./catalog";

export type HiltonShopResponse = {
  roomRates?: Array<{
    roomTypeCode?: string;
    numRoomsAvail?: number;
  }>;
  statusCode?: number;
  statusMessage?: string;
};

export type HiltonShopConfig = {
  apiBase: string;
  accessToken: string;
  fetchImpl?: typeof fetch;
};

function tonightStayDates(): { arrivalDate: string; departureDate: string } {
  const arrival = new Date();
  const departure = new Date(arrival);
  departure.setDate(departure.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { arrivalDate: fmt(arrival), departureDate: fmt(departure) };
}

/** Sum max availability per room type from Hilton shop roomRates. */
export function sumRoomAvailability(response: HiltonShopResponse): number {
  if (!response.roomRates?.length) return 0;

  const byRoomType = new Map<string, number>();
  for (const rate of response.roomRates) {
    if (!rate.roomTypeCode) continue;
    const avail = rate.numRoomsAvail ?? 0;
    const prev = byRoomType.get(rate.roomTypeCode) ?? 0;
    byRoomType.set(rate.roomTypeCode, Math.max(prev, avail));
  }

  let total = 0;
  for (const avail of byRoomType.values()) total += avail;
  return total;
}

export async function shopHiltonProperty(
  entry: HiltonCatalogEntry,
  config: HiltonShopConfig,
): Promise<HiltonShopResponse> {
  const fetchImpl = config.fetchImpl ?? fetch;
  const { arrivalDate, departureDate } = tonightStayDates();

  const response = await fetchImpl(
    `${config.apiBase}/hospitality-partner/v2/dcshop/props/${encodeURIComponent(entry.propCode)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        arrivalDate,
        departureDate,
        numAdults: 1,
        numChildren: 0,
        displayCurrency: "USD",
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Hilton shop ${entry.propCode} failed (${response.status}): ${text.slice(0, 200)}`,
    );
  }

  return (await response.json()) as HiltonShopResponse;
}

export function normalizeHiltonProperty(
  entry: HiltonCatalogEntry,
  shopResponse: HiltonShopResponse,
): PropertyCapacity {
  const asOf = new Date().toISOString();
  const roomsAvailable = Math.min(
    entry.roomsTotal,
    sumRoomAvailability(shopResponse),
  );
  return {
    propertyId: `hilton-${entry.propCode.toLowerCase()}`,
    name: entry.name,
    airportCode: entry.airportCode,
    roomsTotal: entry.roomsTotal,
    roomsAvailable,
    roomsSold: entry.roomsTotal - roomsAvailable,
    asOf,
  };
}
